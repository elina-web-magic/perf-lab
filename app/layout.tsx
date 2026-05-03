import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/providers/StoreProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";

export const metadata: Metadata = {
	title: "Perf Lab",
	description: "High-traffic Product Listing Performance Lab",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className="min-h-screen bg-background text-foreground">
				<StoreProvider>
					<QueryProvider>{children}</QueryProvider>
				</StoreProvider>
			</body>
		</html>
	);
};

export default RootLayout;
