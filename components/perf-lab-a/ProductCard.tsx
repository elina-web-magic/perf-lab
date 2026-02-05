import type { ProductCardProps } from "@/components/perf-lab-b/types";
import type { JSX } from "react";
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

const ProductCard = (props: ProductCardProps): JSX.Element | null => {
	const { id, title, category, brand, price, images, discount, available } =
		props;
	const isAvailable = available;

	if (!props.id) return null;

	return (
		<Card
			id={id}
			className="ProductCard flex flex-col content-center justify-center"
		>
			<CardHeader className="ProductCardHeader">
				<div className="ProductCardTitle flex justify-between gap-2">
					<div>{isAvailable ? "" : <Badge>Out of stock</Badge>}</div>
					<div className="text-center">Like Icon</div>
				</div>
			</CardHeader>
			<CardContent className="ProductCardContent flex flex-col justify-center content-center gap-2">
				<Image
					width={500}
					height={500}
					src={images?.[0] ?? ""}
					alt="Product Image"
					className="relative z-20 aspect-1 w-full object-cover dark:brightness-40"
				/>
			</CardContent>
			<CardFooter className="ProductCardFooter flex-col justify-center gap-2 content-center">
				<CardTitle className="ProductCardTitle flex flex-col justify-center content-center gap-2">
					<div className="ProductCardCategory text-center">{category}</div>
					<p className="ProductCardTitle text-center">{title}</p>
					<span className="ProductCardBrand text-center">{brand}</span>
				</CardTitle>
				<p className="ProductCardPrice text-center">
					{price.value} {price.currency}
				</p>
				<div className="ProductCardDiscrount">
					{discount ? `Discount: ${discount}` : ""}
				</div>
				<CardAction className="ProductCardCallAction gap-2 self-center">
					<Button>Add to bag</Button>
				</CardAction>
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
