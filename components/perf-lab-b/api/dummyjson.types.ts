export type DummyApiProduct = {
	id: number;
	title: string;
	price: number;
	discountPercentage?: number;
	brand: string;
	category: string;
	thumbnail: string;
	images?: string[];
	stock: number;
};

export type DummyProductsResponse = {
	products: DummyApiProduct[];
	total: number;
	skip: number;
	limit: number;
};
