import { useMemo } from "react";
import { CalendarEvent } from "@/types/mainTypes";
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

const useCalendarEvents = (courseData: any) => {
    const calendarEvents: CalendarEvent[] | undefined = useMemo(() => {
        return courseData?.gradingSchemes?.length
            ? _calculationService.getCourseCalendarEvents(courseData)
            : undefined;
    }, [courseData]);

    return calendarEvents;
};

export default useCalendarEvents;
