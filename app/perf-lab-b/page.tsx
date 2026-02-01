import generator from "@/lib/perf-lab/generator";
import { useMemo } from "react";
import PerfLabB from "./PerfLabB";

const INSTRUMENTS_AMOUNT = 10;

const PerfLabPage = () => {
	const instrumentsData = useMemo(() => generator(INSTRUMENTS_AMOUNT), []);

	return <PerfLabB instrumentsData={instrumentsData} />;
};

export default PerfLabPage;
