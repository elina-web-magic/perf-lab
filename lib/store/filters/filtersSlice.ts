import type { Category } from "@/components/perf-lab-b/types";
import type { FiltersState, HydratePayload } from "@/lib/types/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: FiltersState = {
	q: "",
	cat: null,
	limit: 10,
};

export const slice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		hydrateFromUrl: (state, action: PayloadAction<HydratePayload>) => {
			state.q = action.payload.q;
			state.cat = action.payload.cat;
			state.limit = action.payload.limit;
		},
		setQuery: (state, action: PayloadAction<string>) => {
			state.q = action.payload;
		},
		setCategory: (state, action: PayloadAction<Category | null>) => {
			state.cat = action.payload;
		},
		setLimit: (state, action: PayloadAction<number>) => {
			state.limit = action.payload;
		},
	},
});

export const filtersReducer = slice.reducer;
export const { hydrateFromUrl, setQuery, setCategory, setLimit } =
	slice.actions;
