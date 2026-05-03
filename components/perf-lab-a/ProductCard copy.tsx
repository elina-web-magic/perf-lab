import type { ProductCardProps } from "@/components/perf-lab-b/types";
import { RefObject, useCallback, useEffect, useRef, type JSX } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { init } from "next/dist/compiled/webpack/webpack";

const products = [
	{
		id: "product1",
		title: "Product 1",
		category: "Cat 1",
	},
];

const ProductsScroll = (initialValue: string): JSX.Element | null => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const productRef = useRef(initialValue);

	const handleScroll = useCallback(() => {
		if (!containerRef.current) return;
		const root = containerRef.current;

		if (root) {
			/////
		}
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;
		const root = containerRef.current;

		root.addEventListener("scroll", handleScroll);

		return () => {
			root.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	useEffect(() => {
		productRef.current = "init";
	}, []);

	return (
		<div ref={containerRef}>
			{products.map((product) => (
				<Card
					key={product.id}
					id={product.id}
					className="ProductCard flex flex-col content-center justify-center"
				>
					<CardFooter className="ProductCardFooter flex-col justify-center gap-2 content-center">
						<CardTitle className="ProductCardTitle flex flex-col justify-center content-center gap-2">
							<div className="ProductCardCategory text-center">
								{product.category}
							</div>
						</CardTitle>
						<CardAction className="ProductCardCallAction gap-2 self-center">
							<Button>Add to bag</Button>
						</CardAction>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default ProductsScroll;
