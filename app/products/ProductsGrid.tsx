"use client";

import ProductCard from "@/components/perf-lab-a/ProductCard";
import VirtualList from "@/components/perf-lab-b/ui/VirtualList";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { CircleFadingArrowUpIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { setQuery, setCategory } from "@/lib/store/filters/filtersSlice";
import { writeFiltersToUrl } from "@/lib/url/writeFiltersToUrl";

import { SearchInput } from "@/components/perf-lab-a-plus/ui/search/SearchInput";
import SidePanel from "@/components/perf-lab-b/ui/SidePanel";

import { LIMIT_VALUE } from "../perf-lab-b/constants";
import { useHydrateFiltersFromUrl } from "@/lib/store/filters/useHydrateFiltersFromUrl";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store/store";
import type { Category, Product } from "@/components/perf-lab-b/types";
import ProductsVirtualList from "@/components/productsGrid/ui/ProductsVirtualList";
import { useProducts } from "@/lib/productsGrid/useProducts";

const ProductsGrid = (): ReactElement | null => {
	const [showBackToTop, setShowBackToTop] = useState(false);

	const listElRef = useRef<HTMLDivElement | null>(null);

	const { products, hasMore, loading, loadMore, loadMoreLoading } = useProducts(
		{
			limit: LIMIT_VALUE,
			skip: 0,
		},
	);
	const cat = null;

	const renderCount = products.length;

	const onScrollToTopClick = () => {
		if (listElRef?.current) {
			listElRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	const onQueryChange = (nextQ: string) => {};

	const onCategoryChange = (nextCat: Category | null) => {};

	const onLoadMore = () => {
		if (!hasMore) return;
		if (loading || loadMoreLoading) return;
		void loadMore();
	};

	useEffect(() => {
		const el = listElRef?.current as HTMLDivElement;

		const onScroll = () => {
			if (!el) return;

			setShowBackToTop(el.scrollTop > 400);
		};

		window.addEventListener("scroll", onScroll);

		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<div className="h-[100vh] p-4 w-full relative overflow-hidden">
			<h1 className="text-2xl font-bold mb-4">Perf Lab</h1>
			<div className="w-full mb-5 mt-10">
				<SearchInput onQueryChange={onQueryChange} />
			</div>
			<div className="ProductPage grid grid-cols-[300px_minmax(800px,_1fr)] mt-10 gap-6">
				<div className="ProductSidePanel">
					<SidePanel
						onCategoryChange={onCategoryChange}
						appliedCategory={cat}
					/>
				</div>
				<div className="ProductView">
					<ProductsVirtualList
						className="Virtual_List"
						onLoadMore={onLoadMore}
						hasMore={hasMore}
						renderCount={renderCount}
						loading={loading || loadMoreLoading}
						containerRef={listElRef}
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
					</ProductsVirtualList>
					{/* {loadMoreLoading && !searchLoading && (
						<div className="py-6 absolute bottom-0 left-1/2 transform translate-x-1/2 translate-y-0">
							<Spinner className="LoadMore_Spinner Spinner" />
						</div>
					)} */}
					{renderCount === 0 && loading && (
						<div className="py-6 w-full h-full flex justify-center content-center">
							<Spinner className="Loading_Spinner Spinner size-8" />
						</div>
					)}
				</div>
			</div>
			{showBackToTop ? (
				<Button
					className="BackToTop absolute bottom-5 right-10 shadow-lg cursor-pointer hover:bg-sky-700 z-[100]"
					variant="default"
					size="icon"
					onClick={onScrollToTopClick}
				>
					<CircleFadingArrowUpIcon />
				</Button>
			) : (
				<></>
			)}
		</div>
	);
};

export default ProductsGrid;
