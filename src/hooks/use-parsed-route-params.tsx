import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

const useParsedRouteParams = () => {
    const { term, course } = useParams();

    const parsedRouteParams = useMemo(() => {
        return _calculationService.parseParams(term, course);
    }, [term, course]);

    return parsedRouteParams;
};

export default useParsedRouteParams;
