import { loadProducts } from "@/components/perf-lab-b/api/loadProducts";
import type { Category, Product } from "@/components/perf-lab-b/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapApiProductToProduct } from "@/components/perf-lab-b/api/mapApiProductToProduct";

type UseProductsReturn = {
	products: Product[];
	loading: boolean;
	searchLoading?: boolean;
	loadMoreLoading?: boolean;
	error: string | null;
	loadMore: () => void;
	hasMore: boolean;
};

type UseProductsArgs = {
	limit: number;
	initialSkip?: number;
	query?: string;
	category?: Category | null;
};

type Mode = "replace" | "loadMore" | "init";

export const useProducts = (props: UseProductsArgs): UseProductsReturn => {
	const { limit, initialSkip = 0, query = "", category } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [loadMoreLoading, setLoadMoreLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const totalRef = useRef<number | null>(null);
	const inFlightRef = useRef(false);
	const requestIdRef = useRef<number>(0);

	const hasMore =
		totalRef.current === null ? true : products.length < totalRef.current;

	const fetchNextPage = useCallback(
		async (mode: Mode) => {
			if (inFlightRef.current) return;
			if (!hasMore && mode === "loadMore") return;

			if (mode === "loadMore") {
				setLoadMoreLoading(true);
			} else if (mode === "init") {
				setLoading(true);
			} else {
				setSearchLoading(true);
			}

			setError(null);
			inFlightRef.current = true;

			const requestId = requestIdRef.current;

			try {
				const res = await loadProducts(
					initialSkip,
					limit,
					query,
					undefined,
					category,
				);

				if (requestId !== requestIdRef.current) return;

				const { products: apiProducts, total } = res;
				totalRef.current = total;

				const currentProducts = mapApiProductToProduct(apiProducts);

				if (mode === "replace") {
					setProducts(currentProducts);
				} else {
					setProducts((prev) => [...prev, ...currentProducts]);
				}
			} catch (e) {
				if (requestId !== requestIdRef.current) return;
				if (e instanceof Error) setError(e.message);
			} finally {
				if (requestId === requestIdRef.current) {
					setLoading(false);
					setSearchLoading(false);
					setLoadMoreLoading(false);
					inFlightRef.current = false;
				} else {
					inFlightRef.current = false;
				}
			}
		},
		[limit, query, hasMore, category, initialSkip],
	);

	const loadMore = useCallback(() => {
		if (!hasMore) return;

		void fetchNextPage("loadMore");
	}, [fetchNextPage, hasMore]);

	useEffect(() => {
		if (limit <= 0) return;

		requestIdRef.current += 1;
		totalRef.current = null;
		setError(null);
		setLoading(false);
		setSearchLoading(false);
		setLoadMoreLoading(false);

		if (query.length > 0) {
			void fetchNextPage("replace");
		} else if (category && category?.length > 0) {
			void fetchNextPage("replace");
		} else {
			void fetchNextPage("init");
		}
	}, [limit, query, category, fetchNextPage]);

	return {
		products,
		loading,
		searchLoading,
		loadMoreLoading,
		error,
		loadMore,
		hasMore,
	};
};
