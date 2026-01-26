export default function MarketTable({
	name,
	ticker,
	currentPrice,
	change,
	volume,
	currency,
	tradeAvailable,
	riskLevel,
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
}) {
	return (
		<div
			className="grid grid-cols-8 gap-2 border-b border-gray-200 p-2"
			key={name}
		>
			<div className="text-blue-500">{name}</div>
			<div className="text-blue-500">{ticker}</div>
			<div className="text-red-500">{currentPrice}</div>
			<div className="text-green-500">{change}</div>
			<div className="text-yellow-500">{volume}</div>
			<div className="text-violet-500">{currency}</div>
			<div className="text-orange-500">{tradeAvailable ? "Yes" : "No"}</div>
			<div className="text-pink-500">{riskLevel}</div>
		</div>
	);
}
