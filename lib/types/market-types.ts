import type { Branded } from "@/lib/types/brand";

type InstrumentCategory =
	| "crypto"
	| "stocks"
	| "forex"
	| "commodities"
	| "indices";

type InstrumentCurrency = "USD" | "EUR" | "GBP" | "CHF" | "USDT";

export type RiskLevel = "high-risk" | "volatile" | "low-risk";

export type InstrumentId = Branded<string, "InstrumentId">;
export type Ticker = Branded<string, "Ticker">;
export type Name = Branded<string, "Name">;
export type Category = MarketInstrument["category"];
export type Currency = MarketInstrument["currency"];

export type MarketInstrument = {
	id: InstrumentId;
	ticker: Ticker;
	name: Name;
	category: InstrumentCategory;
	currentPrice: number;
	change: number;
	volume: number;
	currency: InstrumentCurrency;
	tradeAvailable: boolean;
	riskLevel: RiskLevel;
};

export type HotState = {
	currentPrice: number;
	change: number;
	volume: number;
};
