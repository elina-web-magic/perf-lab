import type { DummyProductsResponse } from "./dummyjson.types";

export async function loadProducts(
	skip: number,
	limit: number,
	query?: string,
	signal?: AbortSignal,
): Promise<DummyProductsResponse> {
	const q = query?.trim() ?? "";
	const url =
		q.length > 0
			? `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
			: `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

	const res = await fetch(url, {
		signal,
	});

	if (!res.ok) {
		throw new Error(`Failed to load products (${res.status})`);
	}

	return res.json();
}
