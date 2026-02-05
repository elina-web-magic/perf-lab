"use client";

import ProductCard from "@/components/perf-lab-a/ProductCard";
import VirtualList from "@/components/perf-lab-b/ui/VirtualList";
import { useProducts } from "@/lib/hooks/useProducts";
import { useState, type ReactElement } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SearchInput } from "@/components/perf-lab-a-plus/ui/search/SearchInput";
import type { Product } from "@/components/perf-lab-b/types";
import { useProductSuggestions } from "@/lib/hooks/useProductSuggestions";

const LIMIT_VALUE = 10;

const PerfLabB = (): ReactElement | null => {
	const [appliedQuery, setAppliedQuery] = useState<string>("");
	const [inputValue, setInputValue] = useState<string>("");

	const {
		products,
		loadMore,
		hasMore,
		loading,
		loadMoreLoading = false,
		searchLoading = false,
	} = useProducts({
		limit: LIMIT_VALUE,
		initialSkip: 0,
		query: appliedQuery,
	});
	const { suggestions, suggestionsLoading } = useProductSuggestions(inputValue);

	const renderCount = products.length;

	return (
		<div className="h-[100vh] p-4 w-full relative">
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="w-full mb-5 mt-10">
				<SearchInput
					onQueryChange={setAppliedQuery}
					onInputChange={setInputValue}
					suggestions={suggestions}
					suggestionsLoading={suggestionsLoading}
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
	);
};

export default PerfLabB;
