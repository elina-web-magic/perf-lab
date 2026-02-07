import type { Category } from "../types";
import type { DummyProductsResponse } from "./dummyjson.types";

export async function loadProducts(
	skip: number,
	limit: number,
	query?: string,
	signal?: AbortSignal,
	category?: Category | null,
): Promise<DummyProductsResponse> {
	const baseUrl = "https://dummyjson.com/products";
	const url = new URL(baseUrl);
	const q = query?.trim() ?? "";
	if (q.length > 0) {
		url.pathname += "/search";
		url.searchParams.set("q", q);
	} else if (category) {
		url.pathname += `/category/${category}`;
	}
	url.searchParams.set("limit", limit.toString());
	url.searchParams.set("skip", skip.toString());
	const res = await fetch(url.toString(), {
		signal,
	});

	if (!res.ok) {
		throw new Error(`Failed to load products (${res.status})`);
	}

	return res.json();
}
