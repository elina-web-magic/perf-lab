"use client";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
	type ChangeEvent,
	useRef,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DEBOUNCE_TIME = 1000;

type SearchInputProps = {
	onQueryChange: (value: string) => void;
	searchLoading: boolean;
};

export function SearchInput(props: SearchInputProps): ReactNode {
	const { onQueryChange, searchLoading } = props;

	const [inputValue, setInputValue] = useState("");

	const debounceTimeRef = useRef<NodeJS.Timeout | null>(null);

	const clearSearch = useCallback(() => {
		if (debounceTimeRef.current !== null) {
			clearTimeout(debounceTimeRef.current);
			debounceTimeRef.current = null;
		}
		onQueryChange("");
		setInputValue("");
	}, [onQueryChange]);

	const handleSearch = (e: ChangeEvent) => {
		e.stopPropagation();
		const value = (e.target as HTMLInputElement).value;

		setInputValue(value);

		if (debounceTimeRef.current !== null) {
			clearTimeout(debounceTimeRef.current);
			debounceTimeRef.current = null;
		}

		debounceTimeRef.current = setTimeout(() => {
			const nextQuery = value.trim();
			if (nextQuery.length === 0) {
				clearSearch();
				return;
			}
			onQueryChange(nextQuery);
		}, DEBOUNCE_TIME);
	};

	return (
		<div className="Search_Input grid w-full max-w-sm gap-4">
			<InputGroup className="max-w-xs">
				<InputGroupInput
					placeholder="Search"
					value={inputValue}
					onChange={handleSearch}
				/>
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
				<InputGroupAddon className="pr-3" align="inline-end">
					{searchLoading ? (
						<Spinner />
					) : (
						<Button
							className="p-0"
							variant="ghost"
							size="icon"
							onClick={clearSearch}
						>
							<X />
						</Button>
					)}
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}
