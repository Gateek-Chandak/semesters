import { useMemo } from "react";
import { useParams } from "react-router-dom";

const useParsedRouteParams = () => {
    const { term, course } = useParams();

    const parsedRouteParams = useMemo(() => {
        const parsedCourse = course?.replace('-', ' ');
        const parsedTerm = term?.replace('-', ' ');
    
        return { parsedTerm, parsedCourse};
    }, [term, course]);
    
    return parsedRouteParams;
};

export default useParsedRouteParams;
