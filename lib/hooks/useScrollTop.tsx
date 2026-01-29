import { useEffect, useRef, type RefObject } from "react";

export const useScrollTop = (elemRef: RefObject<HTMLDivElement | null>) => {
	const scrollTopRef = useRef<number>(0);

	useEffect(() => {
		const el = elemRef?.current as HTMLElement;
		if (!el) return;

		const handleScroll = () => {
			scrollTopRef.current = el.scrollTop;
		};

		el.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, [elemRef]);

	return scrollTopRef;
};
