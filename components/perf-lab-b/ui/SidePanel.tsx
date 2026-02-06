import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { categories } from "../features/defineCategories";
import type { Category } from "../types";

type SidePanelProps = {
	onCategoryChange: (value: Category | null) => void;
	appliedCategory: Category | null;
};

export default function SidePanel(props: SidePanelProps): ReactNode {
	const { onCategoryChange, appliedCategory } = props;

	return (
		<div className="SidePanel text-card-foreground gap-6 shadow-sm gap-6 rounded-xl border p-4 h-full">
			<h2>Filters</h2>
			<div className="Filters_Wrapper mt-4 gap-y-4">
				<RadioGroup
					className="w-fit"
					onValueChange={(value) =>
						onCategoryChange(value === "default" ? null : (value as Category))
					}
					value={appliedCategory ?? "default"}
				>
					<div className="flex items-center gap-3">
						<RadioGroupItem value="default" id="default" />
						<Label htmlFor="default">All</Label>
					</div>

					{categories.map(({ id, value }) => (
						<div key={id} className="flex items-center gap-3">
							<RadioGroupItem value={id} id={id} />
							<Label htmlFor={id}>{value}</Label>
						</div>
					))}
				</RadioGroup>
			</div>
		</div>
	);
}
