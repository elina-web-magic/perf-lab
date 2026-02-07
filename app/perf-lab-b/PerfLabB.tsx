"use client";

import ProductCard from "@/components/perf-lab-a/ProductCard";
import VirtualList from "@/components/perf-lab-b/ui/VirtualList";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCallback, useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { CircleFadingArrowUpIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { SearchInput } from "@/components/perf-lab-a-plus/ui/search/SearchInput";
import SidePanel from "@/components/perf-lab-b/ui/SidePanel";
import type { Category } from "@/components/perf-lab-b/types";
import {
	useUrlFiltersActions,
	useUrlFiltersState,
} from "@/lib/hooks/useUrlFilters";

const PerfLabB = (): ReactElement | null => {
	const [appliedCategory, setAppliedCategory] = useState<Category | null>(null);
	const { setQuery, setCategory, loadNextPage, resetPagination } =
		useUrlFiltersActions();
	const { limit, skip, q: query, category } = useUrlFiltersState();

	const {
		products,
		hasMore,
		loading,
		loadMoreLoading = false,
		searchLoading = false,
	} = useProducts({
		limit: limit,
		initialSkip: skip,
		query,
		category,
	});

	const renderCount = products.length;

	const onLoadMore = useCallback(() => {
		if (!hasMore) return;
		if (loading || loadMoreLoading) return;

		loadNextPage(skip + limit, limit);
	}, [hasMore, loading, loadMoreLoading, skip, limit, loadNextPage]);

	return (
		<div className="h-[100vh] p-4 w-full relative">
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="w-full mb-5 mt-10">
				<SearchInput onQueryChange={setQuery} />
			</div>
			<div className="ProductPage grid grid-cols-[300px_minmax(800px,_1fr)] mt-10 gap-6">
				<div className="ProductSidePanel">
					<SidePanel
						onCategoryChange={(nextCategoryOrNull) => {
							setAppliedCategory(nextCategoryOrNull);
							setCategory(nextCategoryOrNull);
						}}
						appliedCategory={appliedCategory}
					/>
				</div>
				<div className="ProductView">
					<VirtualList
						className="Virtual_List"
						onLoadMore={onLoadMore}
						hasMore={hasMore}
						renderCount={renderCount}
						loading={loading || loadMoreLoading}
					>
						{(index) => {
							const list = products[index];

							return (
								<ProductCard
									key={list.id}
									id={list.id}
									title={list.title}
									price={list.price}
									available={list.available}
									brand={list.brand}
									images={list.images}
									category={list.category}
								/>
							);
						}}
					</VirtualList>
					<Button
						className="BackToTop absolute bottom-5 right-6 shadow-lg cursor-pointer hover:bg-sky-700"
						variant="default"
						size="icon"
						onClick={resetPagination}
					>
						<CircleFadingArrowUpIcon />
					</Button>

					{loadMoreLoading && !searchLoading && (
						<div className="py-6 absolute bottom-0 left-1/2 transform translate-x-1/2 translate-y-0">
							<Spinner className="LoadMore_Spinner Spinner" />
						</div>
					)}
					{renderCount === 0 && loading && (
						<div className="py-6 w-full h-full flex justify-center content-center">
							<Spinner className="Loading_Spinner Spinner size-8" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PerfLabB;
