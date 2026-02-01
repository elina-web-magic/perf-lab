"use client";

import MarketTableHeader from "@/components/custom-ui/Header";
import ProductCard from "@/components/perf-lab-a/ProductCard";
import type { ProductId } from "@/components/perf-lab-b/types";
import { Button } from "@/components/ui/button";
import type {
	HotState,
	InstrumentId,
	MarketInstrument,
} from "@/lib/types/market-types";
import {
	type ReactElement,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

const PerfLabB = ({
	instrumentsData,
}: {
	instrumentsData: MarketInstrument[];
}): ReactElement | null => {
	const totalAvailable = instrumentsData?.length;
	const [streamOn, setStreamOn] = useState(false);
	const [ticksCount, setTicksCount] = useState(0);
	const [hotState, setHotState] = useState<Map<InstrumentId, HotState>>(
		new Map(),
	);

	const startStream = useCallback(() => {
		setStreamOn(true);
		setTicksCount(0);
	}, []);

	const stopStream = useCallback(() => {
		setStreamOn(false);
		setTicksCount(0);
		setHotState(new Map());
	}, []);

	if (!instrumentsData) return <>No data</>;

	return (
		<div className="max-h-[100vh] p-4 w-full">
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="w-full">
				<ProductCard
					id={"1" as ProductId}
					title="Product 1"
					price={{ value: 10, currency: "EUR" }}
					available={false}
					brand="Nike"
				/>
			</div>
		</div>
	);
};

export default PerfLabB;
