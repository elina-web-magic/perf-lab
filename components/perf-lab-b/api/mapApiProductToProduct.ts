import type { Category, Product, ProductId } from "../types";
import type { DummyApiProduct } from "./dummyjson.types";
import _ from "lodash";

export const mapApiProductToProduct = (api: DummyApiProduct[]): Product[] => {
	return api.map((apiProduct: DummyApiProduct) => {
		const inStock = apiProduct.stock > 0;
		const discountPercentage = _.isNumber(apiProduct.discountPercentage)
			? Math.round(apiProduct.discountPercentage)
			: undefined;

		return {
			id: String(apiProduct.id) as ProductId,
			title: apiProduct.title,
			brand: apiProduct.brand ?? "Unknown",
			price: {
				value: apiProduct.price,
				currency: "EUR",
			},
			images: apiProduct.images,
			available: inStock,
			category: apiProduct.category as Category,
			discount: {
				percentage: discountPercentage,
			},
		};
	});
};
