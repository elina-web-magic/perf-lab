"use client";

import type { Category } from "@/components/perf-lab-b/types";

export type FiltersUrl = {
	q: string;
	cat: Category | null;
	limit: number;
};

export const readFiltersFromUrl = (defaultLimit: number): FiltersUrl => {
	if (typeof window === "undefined")
		return {
			q: "",
			cat: null,
			limit: defaultLimit,
		};

	const searchParams = new URLSearchParams(window.location.search);
	const qRaw = searchParams.get("q") ?? searchParams.get("q");
	const catRaw = searchParams.get("cat") ?? searchParams.get("cat");
	const limitRaw = Number.parseInt(
		searchParams.get("limit") ?? String(defaultLimit),
		10,
	);

	const q = qRaw ? qRaw.trim() : "";

	const cat = catRaw ? (catRaw.trim() as Category) : null;
	const limit =
		Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : defaultLimit;
	return {
		q,
		cat,
		limit,
	};
};
