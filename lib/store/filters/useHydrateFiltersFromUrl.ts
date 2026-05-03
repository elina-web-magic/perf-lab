"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { useEffect } from "react";
import { hydrateFromUrl } from "./filtersSlice";

import { readFiltersFromUrl } from "@/lib/url/readFiltersFromUrl";

export const useHydrateFiltersFromUrl = (defaultLimit: number) => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const f = readFiltersFromUrl(defaultLimit);
		dispatch(hydrateFromUrl({ q: f.q, cat: f.cat, limit: f.limit }));
	}, [dispatch, defaultLimit]);
};
