import { useMemo } from "react";
import useData from "../generalHooks/use-data";
import { CalculationService } from "@/services/calculationService";
import { CalendarEvent } from "@/types/mainTypes";

const _calculationService = new CalculationService();

const useTermCalendarEvents = () => {
    const { termData } = useData();

    const calendarEvents: CalendarEvent[] = useMemo(() => _calculationService.getTermCalendarEvents(termData!), [termData]);
    const numOfEventsInNext7Days: number = useMemo(() => _calculationService.getEventsInTimeFrame(calendarEvents, 7), [calendarEvents]);
    const deliverablesRemaining: number = useMemo(() => _calculationService.getDeliverablesRemaining(termData!), [termData]);

    return { calendarEvents, numOfEventsInNext7Days, deliverablesRemaining };
};

export default useTermCalendarEvents;
