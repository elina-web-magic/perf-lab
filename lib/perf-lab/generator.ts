import type {
	Category,
	Currency,
	MarketInstrument,
	RiskLevel,
} from "@/lib/types/market-types";
import {
	createInstrumentID,
	createName,
	createTicker,
} from "./market-factories";
import { pickedWeightedItem, pickOne, randomFloat } from "./randomizers";

const priceByCategory = (category: Category) => {
	switch (category) {
		case "stocks":
			return randomFloat(5, 1000);
		case "crypto":
			return randomFloat(0.01, 60000);
		case "forex":
			return randomFloat(0.5, 2.0);
		case "commodities":
			return randomFloat(10, 5000);
		case "indices":
			return randomFloat(1000, 50000);

		default:
			return randomFloat(10, 5000);
	}
};

const changePriceByCategory = (category: Category) => {
	switch (category) {
		case "stocks":
			return randomFloat(-10, 10);
		case "crypto":
			return randomFloat(-20, 20);
		case "forex":
			return randomFloat(-0.5, 0.5);
		case "commodities":
			return randomFloat(-8, 8);
		case "indices":
			return randomFloat(-3, 3);

		default:
			return randomFloat(-5, 5);
	}
};

const volumeByCategory = (category: Category) => {
	switch (category) {
		case "stocks":
			return randomFloat(10_000, 50_000_000);
		case "crypto":
			return randomFloat(1_000_000, 1_000_000_000);
		case "forex":
			return randomFloat(5_000_000, 5_000_000_000);
		case "commodities":
			return randomFloat(100_000, 100_000_000);
		case "indices":
			return randomFloat(100_000, 500_000_000);

		default:
			return randomFloat(100_000, 500_000_000);
	}
};

const pickCategory = (): Category => {
	return pickedWeightedItem([
		{ value: "crypto", weight: 30 },
		{ value: "stocks", weight: 30 },
		{ value: "forex", weight: 20 },
		{ value: "commodities", weight: 10 },
		{ value: "indices", weight: 10 },
	]);
};

const pickCurrency = (category: Category): Currency => {
	switch (category) {
		case "crypto":
			return "USDT";
		case "stocks":
			return "USD";
		case "forex":
			return pickOne(["EUR", "USD", "GBP", "CHF"]);
		case "commodities":
			return "USD";
		case "indices":
			return "USD";

		default:
			return "USD";
	}
};

const pickRiskLevel = (category: Category): RiskLevel => {
	switch (category) {
		case "crypto":
			return "high-risk";
		case "stocks":
			return "volatile";
		case "forex":
			return "low-risk";
		case "commodities":
			return "volatile";
		case "indices":
			return "low-risk";

		default:
			return "low-risk";
	}
};

const pickTradeAvailable = (category: Category, hour: number): boolean => {
	switch (category) {
		case "crypto":
			return true;
		case "stocks":
			return true;
		case "commodities":
			return false;
		case "indices":
			return false;
		case "forex":
			if (hour >= 22 || hour <= 8) return false;
			return true;
		default:
			return false;
	}
};

const generator = (amount: number): MarketInstrument[] => {
	const instruments: MarketInstrument[] = [];
	const hour = new Date().getHours();

	for (let i = 0; i < amount; i += 1) {
		const category = pickCategory();
		const currency = pickCurrency(category);
		const riskLevel = pickRiskLevel(category);
		const tradeAvailable = pickTradeAvailable(category, hour);
		const currentPrice = priceByCategory(category);
		const change = changePriceByCategory(category);
		const volume = volumeByCategory(category);

		instruments.push({
			id: createInstrumentID(String(i)),
			ticker: createTicker(`${currency}_${i}`),
			name: createName(`${category.toUpperCase()} Inc. ${i}`),
			category,
			currentPrice: Number(currentPrice.toFixed(2)),
			change: Number(change.toFixed(2)),
			volume: Math.floor(volume),
			currency,
			tradeAvailable,
			riskLevel,
		});
	}

	return instruments;
};

export default generator;
