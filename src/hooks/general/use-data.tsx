import { useSelector } from "react-redux";
import useParsedRouteParams from "./use-parsed-route-params";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { Course, Term } from "@/types/mainTypes";

const useData = () => {
    const { parsedTerm, parsedCourse } = useParsedRouteParams();
    const data = useSelector((state: RootState) => state.data.data);

    const termData = useMemo(() => {
        return parsedTerm 
            ? data.find((t: Term) => t.term_name === parsedTerm) 
            : undefined;
    }, [data, parsedTerm]);

    const courseData = useMemo(() => {
        return parsedCourse && termData 
            ? termData?.courses.find((c: Course) => c.course_title.toLowerCase() === parsedCourse?.toLowerCase()) 
            : undefined;
    }, [data, parsedCourse]);

    const courseIndex = useMemo(() => {
        if (parsedCourse && termData) {
            return termData?.courses.findIndex((c: Course) => c.course_title.toLowerCase() === parsedCourse.toLowerCase());
        }
        return 0;
    }, [data, parsedCourse, termData]);

    return { data, termData, courseData, courseIndex };
};

export default useData;
