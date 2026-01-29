import clsx from "clsx";
import RowItem from "./RowIem";
import type { CSSProperties } from "react";

export default function Row({
	id,
	name,
	ticker,
	currentPrice,
	change,
	volume,
	currency,
	tradeAvailable,
	riskLevel,
	style,
	className,
}: {
	id: string;
	name: string;
	ticker: string;
	currentPrice: number;
	change: number;
	volume: number;
	currency: string;
	tradeAvailable: boolean;
	riskLevel: string;
	style?: CSSProperties;
	className?: string;
}) {
	return (
		<div
			id={id}
			style={style}
			className={clsx(
				className,
				"grid grid-cols-8 gap-2 border-b border-gray-200 p-2",
			)}
		>
			<RowItem id={name} className="text-blue-500">
				{name}
			</RowItem>
			<RowItem id={ticker} className="text-blue-500">
				{ticker}
			</RowItem>
			<RowItem id={currentPrice.toString()} className="text-red-500">
				{currentPrice}
			</RowItem>
			<RowItem id={change.toString()} className="text-green-500">
				{change}
			</RowItem>
			<RowItem id={volume.toString()} className="text-yellow-500">
				{volume}
			</RowItem>
			<RowItem id={currency} className="text-violet-500">
				{currency}
			</RowItem>
			<RowItem id={tradeAvailable.toString()} className="text-orange-500">
				{tradeAvailable ? "Yes" : "No"}
			</RowItem>
			<RowItem id={riskLevel} className="text-pink-500">
				{riskLevel}
			</RowItem>
		</div>
	);
}
