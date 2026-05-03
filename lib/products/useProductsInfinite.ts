"use client";

import type { Category, Product } from "@/components/perf-lab-b/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { loadProducts } from "./loadProducts";
import { mapApiProductToProduct } from "@/components/perf-lab-b/api/mapApiProductToProduct";

type UseProductsArgs = {
	q: string;
	cat: Category | null;
	limit: number;
};

type UseProductsReturn = {
	products: Product[];
	loading: boolean;
	searchLoading?: boolean;
	loadMoreLoading?: boolean;
	error: string | null;
	loadMore: () => void;
	hasMore: boolean;
};

export const useProductsInfinite = (
	args: UseProductsArgs,
): UseProductsReturn => {
	const q = args.q.trim();

	const query = useInfiniteQuery({
		queryKey: ["products", { q, cat: args.cat, limit: args.limit }],
		initialPageParam: 0,
		queryFn: ({ pageParam, signal }) =>
			loadProducts({
				skip: pageParam,
				limit: args.limit,
				query: args.q,
				category: args.cat,
				signal,
			}),
		getNextPageParam: (lastPage) => {
			const nextSkip = lastPage.skip + lastPage.limit;
			const hasMore = nextSkip < lastPage.total;
			return hasMore ? nextSkip : undefined;
		},
	});

	const apiProducts = query.data
		? query.data.pages.flatMap((p) => p.products)
		: [];
	const products = mapApiProductToProduct(apiProducts);
	const hasMore = query.hasNextPage ?? false;

	return {
		products,
		hasMore,
		loading: query.isLoading,
		loadMoreLoading: query.isFetchingNextPage,
		error: query.error ? String(query.error) : null,
		loadMore: query.fetchNextPage,
	};
};
