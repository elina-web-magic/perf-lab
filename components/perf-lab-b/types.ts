import type { Branded } from "@/lib/types/brand";

export type ProductId = Branded<string, "ProductId">;
export type ProductBrand = string;
export type Category =
	| "beauty"
	| "fragrances"
	| "furniture"
	| "groceries"
	| "home-decoration"
	| "kitchen-accessories";

export type Currency = "EUR" | "USD";

export type Price = {
	value: number;
	currency: Currency;
};

export type Discount = {
	percentage?: number;
	label?: string;
};

export interface Product {
	id: ProductId;
	title: string;
	brand: ProductBrand;
	price: Price;
	images?: string[];
	available: boolean;

	category: Category;
	originalPrice?: Price;
	discount?: Discount;
}

export type ProductCardProps = Pick<
	Product,
	"id" | "title" | "brand" | "price" | "images" | "discount" | "available"
>;
