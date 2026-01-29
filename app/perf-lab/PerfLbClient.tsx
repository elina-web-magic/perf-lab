"use client";

import MarketTableBody from "@/components/custom-ui/Row";
import MarketTableHeader from "@/components/custom-ui/Header";
import { Button } from "@/components/ui/button";
import { randomFloat } from "@/lib/perf-lab/randomizers";
import type {
	HotState,
	InstrumentId,
	MarketInstrument,
} from "@/lib/types/market-types";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const STREAM_INTERVAL = 1000;
const PACKAGE_PORTION = 200;

const PerfLbClient = ({
	instrumentsData,
}: {
	instrumentsData: MarketInstrument[];
}) => {
	const [hotState, setHotState] = useState<Map<InstrumentId, HotState>>(
		new Map(),
	);
	const [streamOn, setStreamOn] = useState(false);
	const [ticksCount, setTicksCount] = useState(0);
	const offset = useRef(0);

	const runTick = useCallback(() => {
		const start = offset.current;
		const end = start + PACKAGE_PORTION;
		const len = instrumentsData.length;

		const newHotState = (prev: Map<InstrumentId, HotState>) => {
			const next = new Map(prev);
			for (let i = start; i < end; i += 1) {
				const index = i % len;
				const instrument = instrumentsData[index];
				const prevHotState = prev.get(instrument.id);
				const currentPrice =
					prevHotState?.currentPrice ?? instrument.currentPrice;
				const currentChange = prevHotState?.change ?? instrument.change;
				const currentVolume = prevHotState?.volume ?? instrument.volume;

				const newPrice = Number((currentPrice + randomFloat(-1, 1)).toFixed(2));
				const newChange = Number(
					(currentChange + randomFloat(-1, 1)).toFixed(2),
				);
				const newVolume = Number(
					(currentVolume + randomFloat(-1, 1)).toFixed(2),
				);

				next.set(instrument.id, {
					currentPrice: newPrice,
					change: newChange,
					volume: newVolume,
				});
			}

			offset.current = end % len;
			return next;
		};
		setHotState((prev) => newHotState(prev));
	}, [instrumentsData]);

	const startStream = useCallback(() => {
		setStreamOn(true);
		setTicksCount(0);
	}, []);

	const stopStream = useCallback(() => {
		setStreamOn(false);
		setTicksCount(0);
		setHotState(new Map());
	}, []);

	useEffect(() => {
		if (!streamOn) return;
		const id = setInterval(() => {
			runTick();
			setTicksCount((prev) => prev + 1);
		}, STREAM_INTERVAL);

		return () => clearInterval(id);
	}, [streamOn, runTick]);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="m-4 flex justify-between">
				<Button onClick={streamOn ? stopStream : startStream}>
					{streamOn ? "Stop Stream (ON)" : "Start Stream (OFF)"}
				</Button>
				<div className="text-lg font-bold">Ticks count: {ticksCount}</div>
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<div className="w-full">
					<MarketTableHeader />
					{instrumentsData.map((instrument) => (
						<MarketTableBody
							id={instrument.id}
							key={instrument.id}
							name={instrument.name}
							ticker={instrument.ticker}
							currentPrice={
								hotState.get(instrument.id)?.currentPrice ??
								instrument.currentPrice
							}
							change={hotState.get(instrument.id)?.change ?? instrument.change}
							volume={hotState.get(instrument.id)?.volume ?? instrument.volume}
							currency={instrument.currency}
							tradeAvailable={instrument.tradeAvailable}
							riskLevel={instrument.riskLevel}
						/>
					))}
				</div>
			</Suspense>
		</div>
	);
};

export default PerfLbClient;
