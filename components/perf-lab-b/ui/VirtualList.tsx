"use client";

import type { VirtualWindowOutputs } from "@/lib/virtualization/getVirtualWindow";
import clsx from "clsx";
import { Fragment, useEffect, useRef, type ReactNode } from "react";

type VirtualListProps = {
	children: (index: number) => ReactNode;
	hasMore: boolean;
	loadMore: () => void;
	className: string;
	getKey?: (index: number) => string;
	loading: boolean;
	onWindowChange?: (window: VirtualWindowOutputs) => void;
	renderCount: number;
};

export default function VirtualList(props: VirtualListProps) {
	const {
		children,
		getKey,
		className,
		renderCount,
		loadMore,
		loading,
		hasMore,
	} = props;

	const visibleRows: ReactNode[] = [];
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const requestedRef = useRef(false);

	useEffect(() => {
		if (!loading) requestedRef.current = false;
	}, [loading]);

	for (let i = 0; i < renderCount; i++) {
		const key = getKey ? getKey(i) : String(i);

		visibleRows.push(<Fragment key={key}>{children(i)}</Fragment>);
	}

	useEffect(() => {
		if (!hasMore) return;
		if (!sentinelRef.current || !containerRef.current) return;
		const root = containerRef.current;

		const sentinel = sentinelRef.current;
		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries[0].isIntersecting;

				if (!intersecting) return;
				if (!hasMore) return;
				if (loading) return;
				if (requestedRef.current) return;

				requestedRef.current = true;
				loadMore();
			},
			{
				root: root,
				rootMargin: "200px",
				threshold: 0,
			},
		);
		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [loadMore, hasMore, loading]);

	return (
		<div
			ref={containerRef}
			className={clsx(
				className,
				"Visible_Rows w-full grid lg:grid-cols-4 md:grid-cols-3 max-h-[100vh] gap-4 sm:grid-cols-2 grid-cols-1 overflow-y-auto",
			)}
		>
			{visibleRows}
			{hasMore ? <div className="ProductLast" ref={sentinelRef} /> : null}
		</div>
	);
}
