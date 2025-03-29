import { useMemo } from "react";
import useData from "../general/use-data";
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

const useTermGrade = () => {
    const { termData, data, courseData } = useData();

    const termGrade = useMemo(() => {
        return _calculationService.getTermAverage(termData!);
    }, [data, termData, courseData]);

    return termGrade;
};

export default useTermGrade;
