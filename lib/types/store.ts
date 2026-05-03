import type { Category } from "@/components/perf-lab-b/types";

export type FiltersState = {
	q: string;
	cat: Category | null;
	limit: number;
};

export type HydratePayload = {
	q: string;
	cat: Category | null;
	limit: number;
};
