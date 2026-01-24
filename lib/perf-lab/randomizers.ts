import type { WeightedItem } from "@/lib/types/randomizers";

const randomFloat = (min: number, max: number): number =>
	Math.random() * (max - min) + min;

const randomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min);

const pickOne = <T>(items: readonly T[]): T =>
	items[randomInt(0, items.length - 1)];

const pickedWeightedItem = <T>(items: readonly WeightedItem<T>[]) => {
	const total = items.reduce((acc, item) => acc + item.weight, 0);

	let r = Math.random() * total;

	for (const item of items) {
		r -= item.weight;
		if (r < 0) return item.value;
	}

	return items[items.length - 1].value;
};

export { randomFloat, randomInt, pickOne, pickedWeightedItem };
