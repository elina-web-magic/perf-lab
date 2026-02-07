"use client";

import { LIMIT_VALUE } from "@/app/perf-lab-b/constants";
import type { Category } from "@/components/perf-lab-b/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type UrlFiltersStateReturn = {
	q: string;
	limit: number;
	skip: number;
	category: Category | null;
};

type UseUrlFiltersActionsReturn = {
	setQuery: (value: string) => void;
	setCategory: (value: Category | null) => void;
	loadNextPage: (value1: number, value2: number) => void;
	resetPagination: () => void;
};

export const useUrlFiltersActions = (): UseUrlFiltersActionsReturn => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setQuery = useCallback(
		(nextQ: string) => {
			const params = new URLSearchParams(searchParams.toString());
			const q = nextQ.trim();
			if (q.length > 0) {
				params.delete("skip");
				params.set("q", q);
			} else {
				params.delete("q");
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const setCategory = useCallback(
		(nextCat: Category | null) => {
			const params = new URLSearchParams(searchParams.toString());
			if (nextCat) {
				params.delete("skip");
				params.set("cat", nextCat);
			} else {
				params.delete("cat");
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const loadNextPage = useCallback(
		(nextSkip: number, limit: number) => {
			const params = new URLSearchParams(searchParams.toString());
			if (nextSkip > 0) {
				params.set("skip", nextSkip.toString());
			} else {
				params.delete("skip");
			}

			if (limit > 0) {
				params.set("limit", limit.toString());
			} else {
				params.delete("limit");
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const resetPagination = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("skip");

		router.replace(`${pathname}?${params.toString()}`);
	}, [pathname, router, searchParams]);

	return {
		setQuery,
		setCategory,
		loadNextPage,
		resetPagination,
	};
};

export const useUrlFiltersState = (): UrlFiltersStateReturn => {
	const searchParams = useSearchParams();

	const q = searchParams.get("q") ?? "";
	const limit =
		Number.parseInt(searchParams.get("limit") ?? LIMIT_VALUE.toString()) ??
		LIMIT_VALUE;

	const skip = Number.parseInt(searchParams.get("skip") ?? "0") ?? 0;
	const category = (searchParams.get("cat") as string as Category) ?? null;
	return {
		q,
		limit,
		skip,
		category,
	};
};
