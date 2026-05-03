"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
	children: ReactNode;
};

const client = new QueryClient();

export const QueryProvider = (props: Props) => {
	const { children } = props;

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
