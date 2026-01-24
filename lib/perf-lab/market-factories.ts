import type {
	Currency,
	InstrumentId,
	Name,
	Ticker,
} from "@/lib/types/market-types";

export const createInstrumentID = (id: string): InstrumentId => {
	return id as InstrumentId;
};

export const createTicker = (ticker: string): Ticker => {
	return ticker as Ticker;
};

export const createName = (name: string): Name => {
	return name as Name;
};

export const createCurrency = (currency: string): Currency => {
	return currency as Currency;
};
