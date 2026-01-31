import generator from "@/lib/perf-lab/generator";
import { useMemo } from "react";
import PerfLbClient from "./PerfLbClient";

const INSTRUMENTS_AMOUNT = 1000;

const PerfLabPage = () => {
	const instrumentsData = useMemo(() => generator(INSTRUMENTS_AMOUNT), []);

	return <PerfLbClient instrumentsData={instrumentsData} />;
};

export default PerfLabPage;
