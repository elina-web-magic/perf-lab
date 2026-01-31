import { useEffect, useRef, useState } from "react";

export const useScrollTop = (node: HTMLDivElement | null) => {
	const scrollTopRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);
	const [scrollTick, setScrollTick] = useState(0);

	useEffect(() => {
		if (!node) return;

		const onScroll = () => {
			scrollTopRef.current = node.scrollTop;

			if (rafIdRef.current !== null) return;

			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				setScrollTick((t) => t + 1);
			});
		};

		onScroll();
		node.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			node.removeEventListener("scroll", onScroll);
			if (rafIdRef.current !== null)
				window.cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		};
	}, [node]);

	return { scrollTopRef, scrollTick };
};
