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
	useEffect,
	useRef,
	useState,
} from "react";
import { useScrollTop } from "@/lib/hooks/useScrollTop";
import {
	DEFAULT_OVERSCAN_ROWS,
	DEFAULT_PAGE_SIZE,
	INITIAL_COUNT,
	MARKET_RAW_ITEM_HEIGHT,
} from "@/lib/constants";
import type { VirtualWindowOutputs } from "@/lib/virtualization/getVirtualWindow";

const PerfLbClientAPlus = ({
	instrumentsData,
}: {
	instrumentsData: MarketInstrument[];
}): ReactElement | null => {
	const [hotState, setHotState] = useState<Map<InstrumentId, HotState>>(
		new Map(),
	);
	const totalAvailable = instrumentsData?.length;
	const [streamOn, setStreamOn] = useState(false);
	const [ticksCount, setTicksCount] = useState(0);
	const layerRef = useRef<HTMLDivElement>(null);
	const [viewportHeight, setViewportHeight] = useState<number>(0);

	const [window, setWindow] = useState<VirtualWindowOutputs>();
	const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null);

	const [loadedCount, setLoadedCount] = useState<number>(() =>
		Math.min(INITIAL_COUNT, totalAvailable),
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

	const handleWindowChange = (data: VirtualWindowOutputs) => {
		setWindow(data);
	};

	const setLayerNode = useCallback((node: HTMLDivElement | null) => {
		layerRef.current = node;
		setScrollNode(node);
		if (!node) return;

		const h = node.getBoundingClientRect().height;
		setViewportHeight((prev) => (prev !== h ? h : prev));
	}, []);

	const { scrollTopRef, scrollTick } = useScrollTop(scrollNode);

	const loadMore = useCallback(() => {
		setLoadedCount((prev) => {
			if (prev >= totalAvailable) return prev;
			return Math.min(prev + DEFAULT_PAGE_SIZE, totalAvailable);
		});
	}, [totalAvailable]);

	useEffect(() => {
		if (!window) return;
		const threshold = window?.visibleCount * 2;
		const shouldLoadMore = window.overscanEnd >= loadedCount - threshold;

		if (!shouldLoadMore) return;

		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadMore();
	}, [window, loadMore, loadedCount]);

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
							totalCount={loadedCount}
							viewportHeight={viewportHeight}
							scrollTopRef={scrollTopRef}
							scrollTick={scrollTick}
							rowHeight={MARKET_RAW_ITEM_HEIGHT}
							overscanRows={DEFAULT_OVERSCAN_ROWS}
							getKey={(index) => instrumentsData[index].id}
							onWindowChange={handleWindowChange}
							className="Virtual_List"
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
