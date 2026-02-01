import type { DummyApiProduct } from "@/components/perf-lab-b/api/dummyjson.types";
import { loadProducts } from "@/components/perf-lab-b/api/loadProducts";
import type {
	Category,
	Product,
	ProductId,
} from "@/components/perf-lab-b/types";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";

type UseProductsReturn = {
	products: Product[];
	loading: boolean;
	error: string | null;
	loadMore: () => void;
	hasMore: boolean;
};

type UseProductsArgs = {
	limit: number;
	initialSkip?: number;
};

const mapApiProductToProduct = (api: DummyApiProduct[]): Product[] => {
	return api.map((apiProduct: DummyApiProduct) => {
		const inStock = apiProduct.stock > 0;
		const discountPercentage = _.isNumber(apiProduct.discountPercentage)
			? Math.round(apiProduct.discountPercentage)
			: undefined;

		return {
			id: String(apiProduct.id) as ProductId,
			title: apiProduct.title,
			brand: apiProduct.brand ?? "Unknown",
			price: {
				value: apiProduct.price,
				currency: "EUR",
			},
			images: apiProduct.images,
			available: inStock,
			category: apiProduct.category as Category,
			discount: {
				percentage: discountPercentage,
			},
		};
	});
};

export const useProducts = (props: UseProductsArgs): UseProductsReturn => {
	const { limit, initialSkip = 0 } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);

	const totalRef = useRef<number | null>(null);
	const skipRef = useRef<number>(initialSkip);
	const inFlightRef = useRef(false);

	const hasMore =
		totalRef.current === null ? true : products.length < totalRef.current;

	const fetchNextPage = useCallback(async () => {
		if (inFlightRef.current) return;
		if (!hasMore) return;
		setLoading(true);
		setError(null);

		try {
			inFlightRef.current = true;
			const res = await loadProducts(skipRef.current, limit);
			const { products: apiProducts, total } = res;
			totalRef.current = total;
			const currentProducts = mapApiProductToProduct(apiProducts);
			setProducts((prev) => [...prev, ...currentProducts]);
			skipRef.current += limit;
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setLoading(false);
			inFlightRef.current = false;
		}
	}, [hasMore, limit]);

	const loadMore = useCallback(() => {
		void fetchNextPage();
	}, [fetchNextPage]);

	useEffect(() => {
		if (limit <= 0) return;
		fetchNextPage();
	}, [limit, fetchNextPage]);

	return {
		products,
		loading,
		error,
		loadMore,
		hasMore,
	};
};
