import type { ReactNode } from "react";

export type VirtualListProps = {
	viewportHeight: number;
	scrollTop: number;
	totalCount: number;
	rowHeight: number;
	overscanRows: number;
	children: (index: number) => ReactNode;
	className?: string;
	getKey?: (index: number) => string
};
