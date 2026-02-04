import type { DummyApiProduct } from "@/components/perf-lab-b/api/dummyjson.types";
import { loadProducts } from "@/components/perf-lab-b/api/loadProducts";
import type {
	Category,
	Product,
	ProductId,
} from "@/components/perf-lab-b/types";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { mapApiProductToProduct } from "@/components/perf-lab-b/api/mapApiProductToProduct";

type UseProductsReturn = {
	products: Product[];
	loading: boolean;
	searchLoading?: boolean;
	error: string | null;
	loadMore: () => void;
	hasMore: boolean;
};

type UseProductsArgs = {
	limit: number;
	initialSkip?: number;
	query?: string;
};

export const useProducts = (props: UseProductsArgs): UseProductsReturn => {
	const { limit, initialSkip = 0, query = "" } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const totalRef = useRef<number | null>(null);
	const skipRef = useRef<number>(initialSkip);
	const inFlightRef = useRef(false);
	const requestIdRef = useRef<number>(0);

	const hasMore =
		totalRef.current === null ? true : products.length < totalRef.current;

	const fetchNextPage = useCallback(
		async (mode: "replace" | "append") => {
			if (inFlightRef.current) return;
			if (!hasMore && mode === "append") return;

			if (mode === "append") {
				setLoading(true);
			} else {
				setSearchLoading(true);
			}
			setError(null);
			inFlightRef.current = true;

			const requestId = requestIdRef.current;

			try {
				const res = await loadProducts(skipRef.current, limit, query);
				if (requestId !== requestIdRef.current) return;

				const { products: apiProducts, total } = res;
				totalRef.current = total;

				const currentProducts = mapApiProductToProduct(apiProducts);

				if (mode === "replace") {
					setProducts(currentProducts);
				} else {
					setProducts((prev) => [...prev, ...currentProducts]);
				}

				skipRef.current += limit;
			} catch (e) {
				if (requestId !== requestIdRef.current) return;
				if (e instanceof Error) setError(e.message);
			} finally {
				if (requestId === requestIdRef.current) {
					setLoading(false);
					setSearchLoading(false);
					inFlightRef.current = false;
				} else {
					inFlightRef.current = false;
				}
			}
		},
		[limit, query, hasMore],
	);

	const loadMore = useCallback(() => {
		if (!hasMore) return;
		void fetchNextPage("append");
	}, [fetchNextPage, hasMore]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (limit <= 0) return;

		requestIdRef.current += 1;
		totalRef.current = null;
		skipRef.current = initialSkip;
		setError(null);
		setLoading(false);
		setSearchLoading(false);

		void fetchNextPage("replace");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [limit, initialSkip, query]);

	return {
		products,
		loading,
		searchLoading,
		error,
		loadMore,
		hasMore,
	};
};
