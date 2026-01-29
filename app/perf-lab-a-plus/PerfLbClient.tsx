"use client";

import Row from "@/components/custom-ui/Row";
import MarketTableHeader from "@/components/custom-ui/Header";
import { Button } from "@/components/ui/button";
import VirtualList from "@/components/perf-lab-a-plus/ui/render/VirtualList";
import type {
	HotState,
	InstrumentId,
	MarketInstrument,
} from "@/lib/types/market-types";
import {
	type ReactElement,
	Suspense,
	useCallback,
	useRef,
	useState,
} from "react";
import { useScrollTop } from "@/lib/hooks/useScrollTop";
import { DEFAULT_OVERSCAN_ROWS, MARKET_RAW_ITEM_HEIGHT } from "@/lib/constants";

const PerfLbClientAPlus = ({
	instrumentsData,
}: {
	instrumentsData: MarketInstrument[];
}): ReactElement | null => {
	const [hotState, setHotState] = useState<Map<InstrumentId, HotState>>(
		new Map(),
	);
	const [streamOn, setStreamOn] = useState(false);
	const [ticksCount, setTicksCount] = useState(0);
	const layerRef = useRef<HTMLDivElement>(null);
	const [viewportHeight, setViewportHeight] = useState<number>(0);
	const scrollTop = useScrollTop(layerRef);

	const startStream = useCallback(() => {
		setStreamOn(true);
		setTicksCount(0);
	}, []);

	const stopStream = useCallback(() => {
		setStreamOn(false);
		setTicksCount(0);
		setHotState(new Map());
	}, []);


const setLayerNode = useCallback((node: HTMLDivElement | null) => {
	layerRef.current = node;
	if (!node) return;

	const h = node.getBoundingClientRect().height;
	setViewportHeight((prev) => (prev !== h ? h : prev));
}, []);


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
					<div className="h-[70vh] overflow-y-auto border" ref={setLayerNode}>
						<VirtualList
							totalCount={instrumentsData?.length}
							viewportHeight={viewportHeight}
							scrollTop={scrollTop.current}
							rowHeight={MARKET_RAW_ITEM_HEIGHT}
							overscanRows={DEFAULT_OVERSCAN_ROWS}
							getKey={(index) => instrumentsData[index].id}
						>
							{(index) => {
								const instrument = instrumentsData[index];

								return (
									<Row
										id={instrument.id}
										name={instrument.name}
										ticker={instrument.ticker}
										currentPrice={
											hotState.get(instrument.id)?.currentPrice ??
											instrument.currentPrice
										}
										change={
											hotState.get(instrument.id)?.change ?? instrument.change
										}
										volume={
											hotState.get(instrument.id)?.volume ?? instrument.volume
										}
										currency={instrument.currency}
										tradeAvailable={instrument.tradeAvailable}
										riskLevel={instrument.riskLevel}
										style={{ height: MARKET_RAW_ITEM_HEIGHT }}
										className="Table_Row"
									/>
								);
							}}
						</VirtualList>
					</div>
				</div>
			</Suspense>
		</div>
	);
};

export default PerfLbClientAPlus;
