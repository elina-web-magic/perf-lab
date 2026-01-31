import type { VirtualWindowOutputs } from "@/lib/virtualization/getVirtualWindow";
import type { ReactNode, RefObject } from "react";

export type VirtualListProps = {
	viewportHeight: number;
	scrollTopRef?: RefObject<number>;
	scrollTick?: number;
	totalCount: number;
	rowHeight: number;
	overscanRows: number;
	children: (index: number) => ReactNode;
	className?: string;
	getKey?: (index: number) => string;
	onWindowChange?: (window: VirtualWindowOutputs) => void;
};
