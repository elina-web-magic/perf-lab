"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import type { VirtualListProps } from "./types";
import { getVirtualWindow } from "@/lib/virtualization/getVirtualWindow";

const VirtualList = (props: VirtualListProps) => {
	const {
		totalCount,
		rowHeight,
		overscanRows,
		viewportHeight,
		scrollTick,
		scrollTopRef,
		children,
		className,
		getKey,
		onWindowChange,
	} = props;
	void scrollTick;
	// eslint-disable-next-line react-hooks/refs
	const scrollTop = scrollTopRef?.current ?? 0;

	const window = getVirtualWindow({
		viewportHeight,
		scrollTop,
		rowHeight,
		totalCount,
		overscanRows,
	});

	const prevRef = useRef<{ overscanStart: number; overscanEnd: number } | null>(
		null,
	);

	useEffect(() => {
		if (!window || !onWindowChange) return;

		const prev = prevRef.current;
		const next = {
			overscanStart: window.overscanStart,
			overscanEnd: window.overscanEnd,
		};

		if (
			!prev ||
			prev.overscanStart !== next.overscanStart ||
			prev.overscanEnd !== next.overscanEnd
		) {
			prevRef.current = next;
			onWindowChange(window);
		}
	}, [window, onWindowChange]);

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
			<div
				className="Virtual_Rows_Space_Top"
				style={{ height: topSpacerHeight }}
			/>
			<div className="Visible_Rows">{visibleRows}</div>
			<div
				className="Virtual_Rows_Space_Bottom"
				style={{ height: bottomSpacerHeight }}
			/>
		</div>
	);
};

export default VirtualList;
