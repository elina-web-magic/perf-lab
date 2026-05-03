import { useEffect, useMemo, useRef, useState } from "react";
import { createCartManager } from "./cartSync";
import type { Cart, CartItem, CartState } from "./cartSync";

type CartResponse = {
	items: CartItem[];
	updatedAt: string;
};

const normalizeCart = (r: CartResponse): Cart => ({
	items: r.items,
	updatedAt: Date.parse(r.updatedAt),
});

async function apiGetCart(signal?: AbortSignal): Promise<Cart> {
	const res = await fetch("/api/cart", { signal });
	if (!res.ok) throw new Error("GET /api/cart failed");
	const data: CartResponse = await res.json();
	return normalizeCart(data);
}

async function apiPatchCart(patch: {
	sku: string;
	qty: number;
}): Promise<Cart> {
	const res = await fetch("/api/cart", {
		method: "PATCH",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(patch),
	});
	if (!res.ok) throw new Error("PATCH /api/cart failed");
	const data: CartResponse = await res.json();
	return normalizeCart(data);
}

export default function CartDrawer({ open }: { open: boolean }) {
	const managerRef = useRef<ReturnType<typeof createCartManager> | null>(null);

	const [cartState, setCartState] = useState<CartState>({
		cart: { items: [], updatedAt: 0 },
		syncing: false,
		error: null,
		pendingBySku: new Map(),
		getRequestId: 0,
	});

	// створюємо manager 1 раз (в effect, щоб не чіпати ref в render)
	useEffect(() => {
		if (managerRef.current) return;

		managerRef.current = createCartManager({
			getCart: apiGetCart,
			patchQty: async (sku, qty, signal) => {
				await apiPatchCart({ sku, qty });
			},
			removeItem: async (sku, signal) => {
				await apiPatchCart({ sku, qty: 0 });
			},
		});

		// initial sync + subscribe
		const mgr = managerRef.current;

		// 1) initial snapshot
		setCartState(mgr.getState());

		// 2) subscribe
		const unsubscribe = mgr.subscribe(() => {
			setCartState(mgr.getState());
		});

		return () => {
			unsubscribe();
			// якщо manager має destroy/close — виклич тут
		};
	}, []);

	// коли open=true → refresh
	useEffect(() => {
		const mgr = managerRef.current;
		if (!mgr) return;
		if (!open) return;
		void mgr.refreshCart();
	}, [open]);

	const items = cartState.cart.items;

	const totalCents = useMemo(() => {
		return items.reduce((acc, it) => acc + it.priceCents * it.qty, 0);
	}, [items]);

	const onQtyChange = (
		sku: string,
		nextQty: number,
		priceCents: number,
		title: string,
	) => {
		const mgr = managerRef.current;
		if (!mgr) return;
		if (nextQty <= 0) void mgr.removeSku(sku);
		else void mgr.setQty(sku, nextQty, priceCents, title);
	};

	return (
		<aside className={`drawer ${open ? "open" : ""}`}>
			<header>
				<h2>Cart</h2>
				{cartState.syncing ? <span>Syncing…</span> : null}
			</header>

			{cartState.error ? <div className="error">{cartState.error}</div> : null}

			<ul>
				{items.map((it) => (
					<li key={it.sku} className="row">
						<div className="title">{it.title}</div>
						<div className="price">{(it.priceCents / 100).toFixed(2)} €</div>
						<input
							type="number"
							min={0}
							value={it.qty}
							onChange={(e) =>
								onQtyChange(
									it.sku,
									Number(e.target.value),
									it.priceCents,
									it.title,
								)
							}
						/>
					</li>
				))}
			</ul>

			<footer>
				<div>Total: {(totalCents / 100).toFixed(2)} €</div>
				<button
					type="button"
					disabled={items.length === 0 || cartState.syncing}
				>
					Checkout
				</button>
			</footer>
		</aside>
	);
}
