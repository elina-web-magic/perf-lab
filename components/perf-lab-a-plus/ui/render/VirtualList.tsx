"use client";

import { Fragment, type ReactNode } from "react";
import type { VirtualListProps } from "./types";
import { getVirtualWindow } from "@/lib/virtualization/getVirtualWindow";

const VirtualList = (props: VirtualListProps) => {
	const {
		totalCount,
		rowHeight,
		overscanRows,
		viewportHeight,
		scrollTop,
		children,
		className,
		getKey,
	} = props;

	const window = getVirtualWindow({
		viewportHeight,
		scrollTop,
		rowHeight,
		totalCount,
		overscanRows,
	});

	if (!window) return null;

	const visibleRows: ReactNode[] = [];
	const topSpacerHeight = Math.floor(window.overscanStart * rowHeight);
	const bottomSpacerHeight = Math.floor(
		(totalCount - window.overscanEnd) * rowHeight,
	);

	for (let i = window.overscanStart; i < window.overscanEnd; i++) {
		const key = getKey ? getKey(i) : String(i);
		visibleRows.push(<Fragment key={key}>{children(i)}</Fragment>);
	}
	return (
		<div className={className}>
			<div style={{ height: topSpacerHeight }} />
			<div>{visibleRows}</div>
			<div style={{ height: bottomSpacerHeight }} />
		</div>
	);
};

export default VirtualList;
