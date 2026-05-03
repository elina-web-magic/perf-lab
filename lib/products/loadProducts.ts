import type { Category } from "@/components/perf-lab-b/types";

export type DummyApiProduct = {
	id: number;
	title: string;
	price: number;
	discountPercentage?: number;
	brand: string;
	category: string;
	thumbnail: string;
	images?: string[];
	stock: number;
};

export type DummyProductsResponse = {
	products: DummyApiProduct[];
	total: number;
	skip: number;
	limit: number;
};

type Props = {
	skip: number;
	query: string;
	category: Category | null;
	limit: number;
	signal: AbortSignal;
};

export async function loadProducts(
	props: Props,
): Promise<DummyProductsResponse> {
	const { skip, query, category, limit, signal } = props;
	const baseUrl = "https://dummyjson.com/products";
	const url = new URL(baseUrl);
	if (query.length > 0) {
		url.pathname += "/search";
		url.searchParams.set("q", query);
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
