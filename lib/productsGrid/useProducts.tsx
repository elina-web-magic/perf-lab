"use client";

import { loadProducts } from "@/components/perf-lab-b/api/loadProducts";
import type { Category, Product } from "@/components/perf-lab-b/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapApiProductToProduct } from "@/components/perf-lab-b/api/mapApiProductToProduct";

type ProductsReturn = {
	products: Product[];
	loading: boolean;
	loadMoreLoading: boolean;
	error: Error | null;
	loadMore: () => void;
	hasMore: boolean;
};

type ProductsProps = {
	limit: number;
	skip: number;
	query?: string;
	category?: Category | null;
};

type Mode = "replace" | "loadMore" | "init";

export const useProducts = (props: ProductsProps): ProductsReturn => {
	const { limit, skip, query, category } = props;
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadMoreLoading, setLoadMoreLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const totalRef = useRef<number | null>(null);
	const requestIdRef = useRef<number>(0);
	const isFlightRef = useRef<boolean>(false);

	const hasMore =
		totalRef.current === null ? true : products.length < totalRef.current;

	const fetchNextPage = useCallback(
		async (mode: Mode) => {
			if (!hasMore) return;
			if (isFlightRef.current) return;

			const requestId = requestIdRef.current;

			if (mode === "loadMore") {
				setLoadMoreLoading(true);
			}
			setLoading(true);

			if (requestId !== requestIdRef.current) return;

			try {
				const res = await loadProducts(skip, limit, query, undefined, category);
				const { products: apiProducts } = res;

				if (apiProducts.length === 0) return;

				const currentProducts = mapApiProductToProduct(apiProducts);
				setProducts((prev) => [...prev, ...currentProducts]);
			} catch (e) {
				const errorMsg = e as Error;
				setError(errorMsg);
			} finally {
				if (requestId === requestIdRef.current) {
					setLoading(false);
					setLoadMoreLoading(false);
					setError(null);
					isFlightRef.current = false;
				} else {
					isFlightRef.current = false;
				}
			}
		},
		[hasMore, skip, limit, query, category],
	);

	const loadMore = useCallback(() => {
		if (!hasMore) return;

		void fetchNextPage("loadMore");
	}, [hasMore, fetchNextPage]);

	useEffect(() => {
		if (limit <= 0) return;

		requestIdRef.current += 1;
		totalRef.current = null;

		setError(null);
		setLoading(false);
		setLoadMoreLoading(false);

		void fetchNextPage("init");
	}, [limit, fetchNextPage]);

	return {
		products,
		loading,
		loadMoreLoading,
		error,
		loadMore,
		hasMore,
	};
};
