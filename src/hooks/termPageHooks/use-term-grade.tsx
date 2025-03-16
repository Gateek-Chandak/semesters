import { useMemo } from "react";
import useData from "../use-data";
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

const useTermGrade = () => {
    const { termData } = useData();

    const termGrade = useMemo(() => {
        return _calculationService.getTermAverage(termData!);
    }, [termData]);

    return termGrade;
};

export default useTermGrade;
