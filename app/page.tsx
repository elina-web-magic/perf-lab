import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-zinc-50 flex justify-center">
			<main className="w-full max-w-[550px] px-4 py-10 flex flex-col gap-8">
				<header className="flex flex-col gap-2">
					<h1>Perf Labs</h1>
					<p className="text-sm text-zinc-600">
						Data-heavy UI performance playground
					</p>

					<nav className="flex flex-col gap-4">
						<Link
							href="/perf-lab"
							className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 hover:bg-zinc-100 transition"
						>
							Perf Lab
						</Link>

						<Link
							href="/perf-lab-a-plus"
							className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 hover:bg-zinc-100 transition"
						>
							Perf Lab A+
						</Link>

						<Link
							href="/perf-lab-b"
							className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 hover:bg-zinc-100 transition"
						>
							Perf Lab B
						</Link>
						<Link
							href="/products"
							className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 hover:bg-zinc-100 transition"
						>
							Show Products
						</Link>
					</nav>
				</header>
			</main>
		</div>
	);
}
