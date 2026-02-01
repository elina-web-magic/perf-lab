/* eslint-disable @typescript-eslint/no-explicit-any */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const isNumber = (x: any): x is number => {
	return typeof x === "number";
};
