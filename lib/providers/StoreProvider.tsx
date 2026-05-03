"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

type Props = { children: ReactNode };

export const StoreProvider = (props: Props) => {
	return <Provider store={store}>{props.children}</Provider>;
};
