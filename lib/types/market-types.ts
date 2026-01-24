import type { Branded } from "@/lib/types/brand";

type InstrumentCategory =
	| "crypto"
	| "stocks"
	| "forex"
	| "commodities"
	| "indices";

type InstrumentCurrency = "USD" | "EUR" | "GBP" | "CHF" | "USDT";

type RiskLevel = "high-risk" | "volatile" | "low-risk";

export type InstrumentId = Branded<string, "InstrumentId">;
export type Ticker = Branded<string, "Ticker">;

export type MarketInstrument = {
	id: InstrumentId;
	ticker: Ticker;
	name: string;
	category: InstrumentCategory;
	currentPrice: number;
	change: number;
	volume: number;
	currency: InstrumentCurrency;
	tradeAvailable: boolean;
	riskLevel: RiskLevel;
};
