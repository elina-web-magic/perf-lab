"use client";

import ProductCard from "@/components/perf-lab-a/ProductCard";
import VirtualList from "@/components/perf-lab-b/ui/VirtualList";
import { useProducts } from "@/lib/hooks/useProducts";
import { type ReactNode, useState, type ReactElement } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SearchInput } from "@/components/perf-lab-a-plus/ui/search/SearchInput";

const LIMIT_VALUE = 10;

const PerfLabB = (): ReactElement | null => {
	const [appliedQuery, setAppliedQuery] = useState<string>("");
	const {
		products,
		loadMore,
		hasMore,
		loading,
		searchLoading = false,
		loadMoreLoading = false,
	} = useProducts({
		limit: LIMIT_VALUE,
		initialSkip: 0,
		query: appliedQuery,
	});

	const renderCount = products.length;

	const defineLoading = (loadingState: string): ReactNode => {
		if (loadingState === "loadMoreLoading") {
			return (
				<div className="py-6 absolute bottom-0 left-1/2 transform translate-x-1/2 translate-y-0">
					<Spinner className="LoadMore_Spinner Spinner" />
				</div>
			);
		}
		if (loadingState === "searchLoading") {
			return <div className="opacity-60">Searching...</div>;
		}
		return (
			<div className="py-6 w-full h-full flex justify-center content-center">
				<Spinner className="Loading_Spinner Spinner size-8" />
			</div>
		);
	};

	return (
		<div className="h-[100vh] p-4 w-full relative">
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="w-full mb-5 mt-10">
				<SearchInput
					onQueryChange={setAppliedQuery}
					searchLoading={searchLoading}
				/>
			</div>
			<VirtualList
				className="Virtual_List"
				loadMore={loadMore}
				hasMore={hasMore}
				renderCount={renderCount}
				loading={loading}
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

			{loadMoreLoading && defineLoading("loadMoreLoading")}
			{searchLoading && !loadMoreLoading && loading && renderCount > 0 ? (
				defineLoading("searchLoading")
			) : (
				<>No products</>
			)}
			{renderCount === 0 && loading && defineLoading("loading")}
		</div>
	);
};

export default PerfLabB;
