import _ from "lodash";

type VirtualWindowInputs = {
	viewportHeight: number;
	scrollTop: number;
	rowHeight: number;
	totalCount: number;
	overscanRows: number;
};

export type VirtualWindowOutputs = {
	startIndex: number;
	endIndex: number;
	overscanStart: number;
	overscanEnd: number;
	visibleCount: number;
};

export const getVirtualWindow = (
	options: VirtualWindowInputs,
): VirtualWindowOutputs | null => {
	const { viewportHeight, scrollTop, rowHeight, totalCount, overscanRows } =
		options;

	if (totalCount === 0 || viewportHeight <= 0 || rowHeight <= 0) return null;

	const visibleCount = Math.max(1, Math.floor(viewportHeight / rowHeight));
	const startIndex = Math.floor(
		_.clamp(scrollTop / rowHeight, 0, totalCount - 1),
	);
	const endIndex = Math.floor(
		_.clamp(startIndex + visibleCount - 1, 0, totalCount - 1),
	);
	const overscanStart = Math.floor(
		_.clamp(startIndex - overscanRows, 0, totalCount - 1),
	);
	const overscanEnd = Math.floor(
		_.clamp(endIndex + overscanRows + 1, 0, totalCount),
	);

	return {
		startIndex,
		endIndex,
		overscanStart,
		overscanEnd,
		visibleCount,
	};
};
