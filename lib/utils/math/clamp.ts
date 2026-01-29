export const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const reverseClamp = (value: number, min: number, max: number): number =>
	Math.max(Math.min(value, max), min);
