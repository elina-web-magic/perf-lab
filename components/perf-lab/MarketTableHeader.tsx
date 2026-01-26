export default function MarketTableHeader() {
	return (
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
	);
}
