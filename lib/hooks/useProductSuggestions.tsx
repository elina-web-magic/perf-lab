"use client";

import { loadProducts } from "@/components/perf-lab-b/api/loadProducts";
import { mapApiProductToProduct } from "@/components/perf-lab-b/api/mapApiProductToProduct";
import type { Product } from "@/components/perf-lab-b/types";
import { useCallback, useEffect, useRef, useState } from "react";

type UseProductSuggestionsReturn = {
	suggestions: Product[];
	suggestionsLoading: boolean;
	error: string | null;
};

const LIMIT = 8;
const SKIP = 0;
const DEBOUNCE_TIME = 200;

export const useProductSuggestions = (
	inputValue: string,
): UseProductSuggestionsReturn => {
	const [suggestions, setSuggestions] = useState<Product[]>([]);
	const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const q = inputValue.trim();

	const controllerRef = useRef<AbortController | null>(null);
	const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);

	const clearAllRefs = useCallback(() => {
		if (debounceTimeRef.current !== null) clearTimeout(debounceTimeRef.current);
		debounceTimeRef.current = null;

		if (controllerRef.current !== null) {
			controllerRef.current.abort();
			controllerRef.current = null;
		}
	}, []);

	const clearAllStates = useCallback(() => {
		setSuggestionsLoading(false);
		setError(null);
		setSuggestions([]);
	}, []);

	useEffect(() => {
		const run = async (q: string) => {
			controllerRef.current = new AbortController();
			setSuggestionsLoading(true);
			const { signal } = controllerRef.current;

			try {
				const res = await loadProducts(SKIP, LIMIT, q, signal);
				const { products: apiProducts } = res;
				const products = mapApiProductToProduct(apiProducts);
				setSuggestions(products);
			} catch (error) {
				if ((error as unknown as Error).name === "AbortError") return;
				setError((error as unknown as Error).message);
			} finally {
				setSuggestionsLoading(false);
			}
		};
		setError(null);
		clearAllRefs();

		if (q.length >= 2) {
			debounceTimeRef.current = setTimeout(() => {
				void run(q);
			}, DEBOUNCE_TIME);
		} else {
			clearAllStates();
			return;
		}

		return () => {
			clearAllRefs();
		};
	}, [q, clearAllStates, clearAllRefs]);

	return {
		suggestions,
		suggestionsLoading,
		error,
	};
};
