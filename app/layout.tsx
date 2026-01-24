import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Perf Lab",
	description: "High-traffic Product Listing Performance Lab",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className="min-h-screen bg-background text-foreground">
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
