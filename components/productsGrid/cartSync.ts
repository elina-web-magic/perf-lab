export type Sku = string;

export type CartItem = {
	title: string;
	sku: Sku;
	qty: number;
	priceCents: number;
};

export type Cart = {
	items: CartItem[];
	updatedAt?: number;
};

type PendingInfo =
	| { kind: "qty"; version: number }
	| { kind: "remove"; version: number };

export type CartState = {
	cart: Cart;
	syncing: boolean;
	error: string | null;

	pendingBySku: Map<Sku, PendingInfo>;
	getRequestId: number;
};

export type Api = {
	getCart: (signal?: AbortSignal) => Promise<Cart>;
	patchQty: (sku: Sku, qty: number, signal?: AbortSignal) => Promise<void>;
	removeItem: (sku: Sku, signal?: AbortSignal) => Promise<void>;
};

const upsertItem = (items: CartItem[], next: CartItem): CartItem[] => {
	const idx = items.findIndex((x) => x.sku === next.sku);
	if (idx === -1) return [...items, next];
	const copy = items.slice();
	copy[idx] = { ...copy[idx], ...next };
	return copy;
};

const removeBySku = (items: CartItem[], sku: Sku): CartItem[] =>
	items.filter((x) => x.sku !== sku);

export const mergeServerCart = (
	local: Cart,
	server: Cart,
	pendingBySku: Map<Sku, PendingInfo>,
): Cart => {
	const localBySku = new Map(local.items.map((i) => [i.sku, i]));
	const serverBySku = new Map(server.items.map((i) => [i.sku, i]));

	const mergedItems: CartItem[] = [];

	for (const s of server.items) {
		const pending = pendingBySku.get(s.sku);

		if (pending) {
			const localItem = localBySku.get(s.sku);
			if (localItem) {
				mergedItems.push({ ...s, qty: localItem.qty });
			} else {
				mergedItems.push(s);
			}
		} else {
			mergedItems.push(s);
		}
	}

	for (const l of local.items) {
		if (serverBySku.has(l.sku)) continue;

		const pending = pendingBySku.get(l.sku);
		if (pending) mergedItems.push(l);
	}

	return {
		...server,
		items: mergedItems,
	};
};

export const createCartManager = (api: Api) => {
	const state: CartState = {
		cart: { items: [] },
		syncing: false,
		error: null,
		pendingBySku: new Map(),
		getRequestId: 0,
	};

	const listeners = new Set<() => void>();
	const notify = () => {
		for (const l of listeners) l();
	};

	const subscribe = (fn: () => void) => {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	};

	const getState = () => state;

	const refreshCart = async () => {
		state.getRequestId += 1;
		const rid = state.getRequestId;
		const ac = new AbortController();

		state.syncing = true;
		state.error = null;
		notify();

		try {
			const server = await api.getCart(ac.signal);
			if (rid !== state.getRequestId) return;

			state.cart = mergeServerCart(state.cart, server, state.pendingBySku);
			notify();
		} catch (e) {
			if (rid !== state.getRequestId) return;
			state.error = e instanceof Error ? e.message : String(e);
			notify();
			throw e;
		} finally {
			if (rid === state.getRequestId) {
				state.syncing = false;
				notify();
			}
		}
	};

	const setQty = async (
		sku: Sku,
		nextQty: number,
		priceCents: number,
		title: string,
	) => {
		state.error = null;

		state.cart = {
			...state.cart,
			items: upsertItem(state.cart.items, {
				sku,
				qty: nextQty,
				priceCents,
				title,
			}),
		};

		const prev = state.pendingBySku.get(sku);
		const nextVersion = (prev?.version ?? 0) + 1;
		state.pendingBySku.set(sku, { kind: "qty", version: nextVersion });
		notify();

		const ac = new AbortController();
		state.syncing = true;
		notify();

		try {
			await api.patchQty(sku, nextQty, ac.signal);

			const current = state.pendingBySku.get(sku);
			if (
				!current ||
				current.kind !== "qty" ||
				current.version !== nextVersion
			) {
				return;
			}

			state.pendingBySku.delete(sku);
			notify();
		} catch (e) {
			const current = state.pendingBySku.get(sku);
			if (
				current &&
				current.kind === "qty" &&
				current.version === nextVersion
			) {
				state.pendingBySku.delete(sku);
				notify();
			}

			await refreshCart();
			throw e;
		} finally {
			state.syncing = false;
			notify();
		}
	};

	const removeSku = async (sku: Sku) => {
		state.error = null;

		state.cart = { ...state.cart, items: removeBySku(state.cart.items, sku) };

		const prev = state.pendingBySku.get(sku);
		const nextVersion = (prev?.version ?? 0) + 1;
		state.pendingBySku.set(sku, { kind: "remove", version: nextVersion });
		notify();

		const ac = new AbortController();
		state.syncing = true;
		notify();

		try {
			await api.removeItem(sku, ac.signal);

			const current = state.pendingBySku.get(sku);
			if (
				!current ||
				current.kind !== "remove" ||
				current.version !== nextVersion
			) {
				return;
			}

			state.pendingBySku.delete(sku);
			notify();
		} catch (e) {
			const current = state.pendingBySku.get(sku);
			if (
				current &&
				current.kind === "remove" &&
				current.version === nextVersion
			) {
				state.pendingBySku.delete(sku);
				notify();
			}

			await refreshCart();
			throw e;
		} finally {
			state.syncing = false;
			notify();
		}
	};

	return {
		subscribe,
		getState,
		refreshCart,
		setQty,
		removeSku,
	};
};
