import { PRODUCT_CATEGORIES } from "../constants";
import type { CategoryOption } from "../types";

export const categories: CategoryOption[] = PRODUCT_CATEGORIES.map(
	(category) => {
		return {
			id: category,
			value: category
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
		};
	},
);
