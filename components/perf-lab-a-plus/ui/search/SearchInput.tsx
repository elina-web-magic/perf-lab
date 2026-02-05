"use client";

import {
	type ChangeEvent,
	useRef,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import AutocompleteUI from "./AutocompleteUI";
import type { Product } from "@/components/perf-lab-b/types";

const DEBOUNCE_TIME = 1000;

type SearchInputProps = {
	onQueryChange: (value: string) => void;
	onInputChange: (value: string) => void;
	suggestions: Product[];
	suggestionsLoading: boolean;
};

export function SearchInput(props: SearchInputProps): ReactNode {
	const { onQueryChange, onInputChange, suggestions, suggestionsLoading } =
		props;

	const [inputValue, setInputValue] = useState("");

	const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);
	const debounceSuggestionsRef = useRef<NodeJS.Timeout | null>(null);

	const clearSearch = useCallback(() => {
		if (debounceTimeRef.current !== null) {
			clearTimeout(debounceTimeRef.current);
			debounceTimeRef.current = null;
		}
		onQueryChange("");
		setInputValue("");
		onInputChange("");
	}, [onQueryChange, onInputChange]);

	const handleSearch = useCallback(
		(e: ChangeEvent) => {
			const value = (e.target as HTMLInputElement).value;
			const nextQuery = value.trim();

			setInputValue(value);
			onInputChange(nextQuery);

			if (debounceTimeRef.current !== null) {
				clearTimeout(debounceTimeRef.current);
				debounceTimeRef.current = null;
			}

			if (debounceSuggestionsRef.current !== null) {
				clearTimeout(debounceSuggestionsRef.current);
				debounceSuggestionsRef.current = null;
			}

			debounceTimeRef.current = setTimeout(() => {
				if (nextQuery.length === 0) {
					clearSearch();
					return;
				}
				onQueryChange(nextQuery);
			}, DEBOUNCE_TIME);
		},
		[clearSearch, onQueryChange, onInputChange],
	);

	return (
		<div className="Search_Input grid w-full max-w-sm gap-4">
			<AutocompleteUI
				name="search"
				placeholder="Search"
				onClear={clearSearch}
				onChange={handleSearch}
				value={inputValue}
				suggestions={suggestions}
				suggestionsLoading={suggestionsLoading}
			/>
		</div>
	);
}
