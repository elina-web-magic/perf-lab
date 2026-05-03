export type UrlPatch = {
	q?: string;
	cat?: string | null;
	limit?: number;
};

export const writeFiltersToUrl = (patch: UrlPatch) => {
	const { q, cat, limit } = patch;

	if (typeof window === "undefined")
		return {
			q: patch,
			cat: null,
			limit: limit,
		};

	const url = new URL(window.location.href);

	const searchParams = new URLSearchParams(window.location.search);

	if (q !== undefined) {
		const newQ = q.trim();
		if (newQ.length > 0) searchParams.set("q", newQ);
		else searchParams.delete("q");
	}

	if (cat) {
		if (cat === null) searchParams.delete("cat");
		const newCat = cat?.trim().length > 0 ? cat?.trim() : "";
		searchParams.set("cat", newCat);
	}

	if (limit !== undefined) {
		if (limit > 0) {
			searchParams.set("limit", String(limit));
		} else {
			searchParams.delete("limit");
		}
	}

	const nextUrl = `${url.pathname}?${searchParams.toString()}`;
	const currentUrl = `${window.location.pathname}${window.location.search}`;

	if (nextUrl !== currentUrl) window.history.replaceState(null, "", nextUrl);
};
