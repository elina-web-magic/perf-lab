"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import styles from "./index.module.css";
import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { X } from "lucide-react";

interface BaseItem {
	id: number | string;
	title: string;
}

type AutocompleteUIProps<T extends BaseItem> = {
	name: string;
	onChange: (e: ChangeEvent) => void;
	placeholder: string;
	onClear: () => void;
	value: string;
	suggestions: T[];
	suggestionsLoading: boolean;
	label?: string;
};

export default function AutocompleteUI<T extends BaseItem>(
	props: AutocompleteUIProps<T>,
) {
	const {
		name,
		onChange,
		placeholder,
		value,
		onClear,
		label,
		suggestions,
		suggestionsLoading,
	} = props;

	return (
		<Autocomplete.Root items={suggestions}>
			<label className={styles.Label} htmlFor={name}>
				{label}
			</label>
			<InputGroup className="max-w-xs">
				<Autocomplete.Input
					id={name}
					placeholder={placeholder}
					className={styles.Input}
					onChange={onChange}
					value={value}
				/>
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
				<InputGroupAddon className="pr-3" align="inline-end">
					{value.length > 0 ? (
						suggestionsLoading ? (
							<Spinner />
						) : (
							<Button
								className="p-0"
								variant="ghost"
								size="icon"
								onClick={onClear}
							>
								<X />
							</Button>
						)
					) : (
						<></>
					)}
				</InputGroupAddon>
			</InputGroup>

			<Autocomplete.Portal>
				<Autocomplete.Positioner className={styles.Positioner} sideOffset={4}>
					<Autocomplete.Popup className={styles.Popup}>
						{suggestions?.length === 0 ? (
							<Autocomplete.Empty className={styles.Empty}>
								No tags found.
							</Autocomplete.Empty>
						) : (
							<Autocomplete.List className={styles.List}>
								{(result: BaseItem) => (
									<Autocomplete.Item
										key={result.id}
										className={styles.Item}
										value={result.title}
									>
										{result.title}
									</Autocomplete.Item>
								)}
							</Autocomplete.List>
						)}
					</Autocomplete.Popup>
				</Autocomplete.Positioner>
			</Autocomplete.Portal>
		</Autocomplete.Root>
	);
}
