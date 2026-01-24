"use client";

import generator from "@/lib/perf-lab/generator";
import { useMemo } from "react";

const INSTRUMENTS_AMOUNT = 30000;

const PerfLabPage = () => {
	const instrumentsData = useMemo(() => generator(INSTRUMENTS_AMOUNT), []);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="grid grid-cols-8 gap-2 p-2 border-b border-gray-200 font-bold text-lg">
				<div>Name</div>
				<div>Ticker</div>
				<div>Current Price</div>
				<div>Change</div>
				<div>Volume</div>
				<div>Currency</div>
				<div>Trade Available</div>
				<div>Risk Level</div>
			</div>
			{instrumentsData.map((instrument) => (
				<div
					className="grid grid-cols-8 gap-2 border-b border-gray-200 p-2"
					key={instrument.id}
				>
					<div className="text-blue-500">{instrument.name}</div>
					<div className="text-blue-500">{instrument.ticker}</div>
					<div className="text-red-500">{instrument.currentPrice}</div>
					<div className="text-green-500">{instrument.change}</div>
					<div className="text-yellow-500">{instrument.volume}</div>
					<div className="text-violet-500">{instrument.currency}</div>
					<div className="text-orange-500">
						{instrument.tradeAvailable ? "Yes" : "No"}
					</div>
					<div className="text-pink-500">{instrument.riskLevel}</div>
				</div>
			))}
		</div>
	);
};

export default PerfLabPage;
