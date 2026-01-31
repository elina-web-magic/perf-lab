export type VirtualWindow = {
	startIndex: number;
	endIndex: number;
};

type Params = {
	totalCount: number;
	rowHeight: number;
	viewportHeight: number;
	scrollTop: number;
};

export const useVirtualWindow = (params: Params): VirtualWindow => {
	const { totalCount, rowHeight, viewportHeight, scrollTop } = params;

	// TODO: calculate visible range

	return {
		startIndex: 0,
		endIndex: 0,
	};
};
