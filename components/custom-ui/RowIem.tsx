import type { JSX } from "react";

export default function MarketTableItem({
	id,
	children,
	className,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
}): JSX.Element {
	return (
		<div id={id} className={className}>
			{children}
		</div>
	);
}
