import { useSelector } from "react-redux";
import useParsedRouteParams from "./use-parsed-route-params";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService(); 

const useData = () => {
    const { parsedTerm, parsedCourse } = useParsedRouteParams();
    const data = useSelector((state: RootState) => state.data.data);

    const termData = useMemo(() => {
        return parsedTerm ? _calculationService.getTermData(data, parsedTerm) : undefined;
    }, [data, parsedTerm]);

    const courseData = useMemo(() => {
        return parsedCourse && termData ? _calculationService.getCourseData(termData, parsedCourse) : undefined;
    }, [data, parsedCourse]);

    const courseIndex = useMemo(() => {
        if (parsedCourse && termData) {
            return _calculationService.getCourseIndex(termData, parsedCourse!);
        }
        return 0;
    }, [data, parsedCourse]);

    return { data, termData, courseData, courseIndex };
};

export default useData;
