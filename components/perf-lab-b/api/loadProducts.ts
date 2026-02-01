import type { DummyProductsResponse } from "./dummyjson.types";

export async function loadProducts(
	skip: number,
	limit: number,
): Promise<DummyProductsResponse> {
	const res = await fetch(
		`https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
	);

	if (!res.ok) {
		throw new Error(`Failed to load products (${res.status})`);
	}

	return res.json();
}
