"use client";

import {
	type ChangeEvent,
	useRef,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import AutocompleteUI from "./AutocompleteUI";
import { useProductSuggestions } from "@/lib/hooks/useProductSuggestions";

const DEBOUNCE_TIME = 1000;

type SearchInputProps = {
	onQueryChange: (value: string) => void;
};

export function SearchInput(props: SearchInputProps): ReactNode {
	const { onQueryChange } = props;

	const [inputValue, setInputValue] = useState("");
	const { suggestions, suggestionsLoading } = useProductSuggestions(inputValue);

	const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);
	const debounceSuggestionsRef = useRef<NodeJS.Timeout | null>(null);

	const clearSearch = useCallback(() => {
		if (debounceTimeRef.current !== null) {
			clearTimeout(debounceTimeRef.current);
			debounceTimeRef.current = null;
		}
		onQueryChange("");
		setInputValue("");
	}, [onQueryChange]);

	const handleSearch = useCallback(
		(e: ChangeEvent) => {
			const value = (e.target as HTMLInputElement).value;
			const nextQuery = value.trim();

			setInputValue(value);

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
		[clearSearch, onQueryChange],
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
