import { useMemo } from "react";
import { CalendarEvent } from "@/types/mainTypes";
import { CalculationService } from "@/services/calculationService";
import useData from "../general/use-data";

const _calculationService = new CalculationService();

const useCalendarEvents = () => {
    const { courseData } = useData();

    const calendarEvents: CalendarEvent[] | undefined = useMemo(() => {
        return (courseData?.grading_schemes)
            ? _calculationService.getCourseCalendarEvents(courseData)
            : [];
    }, [courseData]);

    return calendarEvents;
};

export default useCalendarEvents;
