// Types
import { HoursStudiedLog } from "@/types/mainTypes";
import { InputField } from "@/components/term/popups/AddStudyLogPopup";
// Libraries
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, startOfDay, isBefore, isAfter, addWeeks, addMonths } from "date-fns";
// Hooks
import { useEffect, useMemo, useState } from "react";
import useUser from "../general/use-user";
import useData from "../general/use-data";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

const getLogsInRange = (logs: HoursStudiedLog[], rangeStart: Date, rangeEnd: Date) => {
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);

    return logs.filter((log) => {
        const logDate = startOfDay(log.date);
        return isWithinInterval(logDate, { start, end });
    });
};

// Checks if the range provided falls within the current term or not
const isRangeOutOfTerm = (rangeStart: Date, rangeEnd: Date, termStart: Date, termEnd: Date) => {
    return isBefore(rangeEnd, termStart) || isAfter(rangeStart, termEnd);
};

// Used to calculate the total hours studied in a time period
const calculateHoursStudied = (logs: HoursStudiedLog[]) => {
    return logs.reduce((acc, log) => {
        const hoursStudiedOnDay = Object.keys(log).reduce((acc, key) => {
            if (typeof log[key] == 'number') {
                return acc + log[key]
            } 
            return acc + 0
        }, 0)

        return acc + hoursStudiedOnDay
    }, 0)
}

const useHoursStudiedLogs = () => {
    // inits
    const { user } = useUser();
    const { termData } = useData();

    const [hoursStudiedLogs, setHoursStudiedLogs] = useState<HoursStudiedLog[] | any>([])
    const [view, setView] = useState<"weekly" | "monthly" | "term">("weekly");
    const [anchorDate, setAnchorDate] = useState<Date>(determineDefaultAnchorDate());
    const [dateRange, setDateRange] = useState<string>(displayRange());

    // Metrics
    const [hoursStudied, setHoursStudied] = useState<number>(0);
    const [avgHoursStudied, setAvgHoursStudied] = useState<number>(0); 

    // const chartData = [
    //     { date: "2025-01-01", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-01-02", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-01-03", "AFM 191": 3, "CFM 101": 7 },
    //     { date: "2025-01-04", "AFM 191": 11, "CFM 101": 9 },
    //     { date: "2025-01-05", "AFM 191": 6, "CFM 101": 12 },
    //     { date: "2025-01-06", "AFM 191": 7, "CFM 101": 11 },
    //     { date: "2025-01-07", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-01-08", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-01-09", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-01-10", "AFM 191": 7, "CFM 101": 6 },
    //     { date: "2025-01-11", "AFM 191": 8, "CFM 101": 12 },
    //     { date: "2025-01-12", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-01-13", "AFM 191": 9, "CFM 101": 12 },
    //     { date: "2025-01-14", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-01-15", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-01-16", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-01-17", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-01-18", "AFM 191": 9, "CFM 101": 12 },
    //     { date: "2025-01-19", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-01-20", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-01-21", "AFM 191": 4, "CFM 101": 7 },
    //     { date: "2025-01-22", "AFM 191": 6, "CFM 101": 5 },
    //     { date: "2025-01-23", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-01-24", "AFM 191": 12, "CFM 101": 7 },
    //     { date: "2025-01-25", "AFM 191": 5, "CFM 101": 9 },
    //     { date: "2025-01-26", "AFM 191": 2, "CFM 101": 4 },
    //     { date: "2025-01-27", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-01-28", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-01-29", "AFM 191": 7, "CFM 101": 6 },
    //     { date: "2025-01-30", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-01-31", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-01", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-02-02", "AFM 191": 9, "CFM 101": 10 },
    //     { date: "2025-02-03", "AFM 191": 7, "CFM 101": 6 },
    //     { date: "2025-02-04", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-05", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-02-06", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-07", "AFM 191": 10, "CFM 101": 7 },
    //     { date: "2025-02-08", "AFM 191": 4, "CFM 101": 6 },
    //     { date: "2025-02-09", "AFM 191": 6, "CFM 101": 5 },
    //     { date: "2025-02-10", "AFM 191": 9, "CFM 101": 11 },
    //     { date: "2025-02-11", "AFM 191": 9, "CFM 101": 7 },
    //     { date: "2025-02-12", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-02-13", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-02-14", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-15", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-02-16", "AFM 191": 9, "CFM 101": 12 },
    //     { date: "2025-02-17", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-18", "AFM 191": 7, "CFM 101": 8 },
    //     { date: "2025-02-19", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-02-20", "AFM 191": 4, "CFM 101": 7 },
    //     { date: "2025-02-21", "AFM 191": 2, "CFM 101": 4 },
    //     { date: "2025-02-22", "AFM 191": 2, "CFM 101": 3 },
    //     { date: "2025-02-23", "AFM 191": 7, "CFM 101": 9 },
    //     { date: "2025-02-24", "AFM 191": 9, "CFM 101": 6 },
    //     { date: "2025-02-25", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-02-26", "AFM 191": 5, "CFM 101": 4 },
    //     { date: "2025-02-27", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-02-28", "AFM 191": 6, "CFM 101": 5 },
    //     { date: "2025-03-01", "AFM 191": 4, "CFM 101": 6 },
    //     { date: "2025-03-02", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-03-03", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-03-04", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-03-05", "AFM 191": 2, "CFM 101": 4 },
    //     { date: "2025-03-06", "AFM 191": 9, "CFM 101": 7 },
    //     { date: "2025-03-07", "AFM 191": 10, "CFM 101": 9 },
    //     { date: "2025-03-08", "AFM 191": 12, "CFM 101": 8 },
    //     { date: "2025-03-09", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-03-10", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-03-11", "AFM 191": 2, "CFM 101": 4 },
    //     { date: "2025-03-12", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-03-13", "AFM 191": 2, "CFM 101": 3 },
    //     { date: "2025-03-14", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-03-15", "AFM 191": 8, "CFM 101": 8 },
    //     { date: "2025-03-16", "AFM 191": 9, "CFM 101": 7 },
    //     { date: "2025-03-17", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-03-18", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-03-19", "AFM 191": 9, "CFM 101": 6 },
    //     { date: "2025-03-20", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-03-21", "AFM 191": 4, "CFM 101": 6 },
    //     { date: "2025-03-22", "AFM 191": 7, "CFM 101": 5 },
    //     { date: "2025-03-23", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-03-24", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-03-25", "AFM 191": 4, "CFM 101": 6 },
    //     { date: "2025-03-26", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-03-27", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-03-28", "AFM 191": 4, "CFM 101": 6 },
    //     { date: "2025-03-29", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-03-30", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-03-31", "AFM 191": 12, "CFM 101": 10 },
    //     { date: "2025-04-01", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-04-02", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-04-03", "AFM 191": 3, "CFM 101": 7 },
    //     { date: "2025-04-04", "AFM 191": 11, "CFM 101": 9 },
    //     { date: "2025-04-05", "AFM 191": 6, "CFM 101": 7 },
    //     { date: "2025-04-06", "AFM 191": 7, "CFM 101": 8 },
    //     { date: "2025-04-07", "AFM 191": 4, "CFM 101": 5 },
    //     { date: "2025-04-08", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-04-09", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-04-10", "AFM 191": 7, "CFM 101": 6 },
    //     { date: "2025-04-11", "AFM 191": 8, "CFM 101": 12 },
    //     { date: "2025-04-12", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-04-13", "AFM 191": 9, "CFM 101": 12 },
    //     { date: "2025-04-14", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-04-15", "AFM 191": 5, "CFM 101": 7 },
    //     { date: "2025-04-16", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-04-17", "AFM 191": 12, "CFM 101": 9 },
    //     { date: "2025-04-18", "AFM 191": 9, "CFM 101": 12 },
    //     { date: "2025-04-19", "AFM 191": 5, "CFM 101": 6 },
    //     { date: "2025-04-20", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-04-21", "AFM 191": 4, "CFM 101": 7 },
    //     { date: "2025-04-22", "AFM 191": 6, "CFM 101": 5 },
    //     { date: "2025-04-23", "AFM 191": 4, "CFM 101": 8 },
    //     { date: "2025-04-24", "AFM 191": 12, "CFM 101": 7 },
    //     { date: "2025-04-25", "AFM 191": 5, "CFM 101": 9 },
    //     { date: "2025-04-26", "AFM 191": 2, "CFM 101": 4 },
    //     { date: "2025-04-27", "AFM 191": 12, "CFM 101": 12 },
    //     { date: "2025-04-28", "AFM 191": 3, "CFM 101": 5 },
    //     { date: "2025-04-29", "AFM 191": 7, "CFM 101": 6 },
    //     { date: "2025-04-30", "AFM 191": 12, "CFM 101": 9 },
    //   ]  

    useEffect(() => {
        fetchLogs();
        setAnchorDate(determineDefaultAnchorDate())
        setDateRange(displayRange());
    }, [termData])

    function determineDefaultAnchorDate() {
        return isRangeOutOfTerm(new Date(), new Date(), new Date(termData!.start_date), new Date(termData!.end_date)) 
            ? new Date(termData!.start_date)
            : new Date();
    }

    const fetchLogs = async () => {
        const logs = await _apiService.getStudyLogs(user!.id, termData!.id);

        const start = new Date(termData!.start_date);
        const end = new Date(termData!.end_date);

        // The following code adds in all the missing dates
        const logMap = new Map(
            logs.map((log: any) => [format(new Date(log.date), "yyyy-MM-dd"), log])
        );

        const result: any[] = [];
        for (
            let current = new Date(start);
            current <= end;
            current = addDays(current, 1)
        ) {
            const formattedDate = format(current, "yyyy-MM-dd");
            if (logMap.has(formattedDate)) {
                result.push(logMap.get(formattedDate));
            } else {
                result.push({ date: current.toISOString() });
            }
        }

        setHoursStudiedLogs(result);
    }

    const createLogs = async (date: string, inputFields: InputField[]) => {
        const selectedDate = new Date(date!);
        const startDate = new Date(termData!.start_date);
        const endDate = new Date(termData!.end_date);

        if (selectedDate < startDate || selectedDate > endDate) {
            return {
                success: false,
                message: `Date must be between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`
            };
        }

        try {
            const studyLogs = inputFields.map((field: any) => {
                return {
                    course_id: field.course_id,
                    hours_studied: field.hours_studied
                }
            })
            await _apiService.createStudyLog(user!.id, termData!.id, date!, studyLogs)
            return { success: true };
        } catch(error: any) {
            return {
                success: false,
                message: "Logs for this date have already been entered."
            };
        }
    }

    // Used to get hours studied for a certain course in a time period
    const calculateHoursStudiedByCourse = (course: string) => {
        return logsToShow.reduce((acc: number, log: HoursStudiedLog) => {
            const hoursStudiedOnDay = Object.keys(log).reduce((acc, key) => {
                if (typeof log[key] == 'number' && key == course) {
                    return acc + log[key]
                } 
                return acc + 0
            }, 0)

            return acc + hoursStudiedOnDay
        }, 0)
    }

    const getWeeklyLogs = (targetDate = new Date()) => {
        if (!termData) return [];
    
        const termStart = new Date(termData!.start_date);
        const termEnd = new Date(termData!.end_date);

        let start = startOfWeek(targetDate, { weekStartsOn: 1 });
        let end = endOfWeek(start, { weekStartsOn: 1 });

        if (isRangeOutOfTerm(start, end, termStart, termEnd)) {
            start = startOfWeek(termStart, { weekStartsOn: 1 });
            end = endOfWeek(termStart, { weekStartsOn: 1 });
        }
    
        return getLogsInRange(hoursStudiedLogs, start, end);
    };
    
    const getMonthlyLogs = (targetDate = new Date()) => {
        if (!termData) return [];
    
        const termStart = new Date(termData!.start_date);
        const termEnd = new Date(termData!.end_date);
    
        let start = startOfMonth(targetDate);
        let end = endOfMonth(start);
    
        if (isRangeOutOfTerm(start, end, termStart, termEnd)) {
            start = startOfMonth(termStart);
            end = endOfMonth(termStart);
        }
    
        return getLogsInRange(hoursStudiedLogs, start, end);
    };
    
    const goToPrevious = () => {
        const termStart = new Date(termData!.start_date);
        const termEnd = new Date(termData!.end_date);
        setAnchorDate(prev => {
            const newDate = view === "weekly" ? addWeeks(prev, -1) : addMonths(prev, -1);
            return isBefore(newDate, termStart) ? termEnd : newDate;
        });
    };
    
    const goToNext = () => {
        const termStart = new Date(termData!.start_date);
        const termEnd = new Date(termData!.end_date);
        setAnchorDate(prev => {
            const newDate = view === "weekly" ? addWeeks(prev, 1) : addMonths(prev, 1);
            return isAfter(newDate, termEnd) ? termStart : newDate;
        });
    };

    function displayRange() {
        if (view === "weekly") {
            const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
            const end = endOfWeek(anchorDate, { weekStartsOn: 1 });
            return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
        } else {
            return format(anchorDate, "MMMM yyyy");
        }
    };

    const logsToShow = useMemo(() => {
        const range = displayRange();
        setDateRange(range);
        switch (view) {
            case "weekly":
                const weeklyLogs = getWeeklyLogs(anchorDate);
                const weeklyHoursStudied = calculateHoursStudied(weeklyLogs)
                setHoursStudied(weeklyHoursStudied)
                setAvgHoursStudied(weeklyLogs.length > 0 ? (weeklyHoursStudied / weeklyLogs.length) : 0)
                return weeklyLogs;
            case "monthly":
                const monthlyLogs = getMonthlyLogs(anchorDate);
                const monthlyHoursStudied = calculateHoursStudied(monthlyLogs)
                setHoursStudied(monthlyHoursStudied)
                setAvgHoursStudied(monthlyLogs.length > 0 ? (monthlyHoursStudied / monthlyLogs.length) : 0)
                return monthlyLogs
            case "term":
                const totalHoursStudied = calculateHoursStudied(hoursStudiedLogs)
                setHoursStudied(totalHoursStudied)
                setAvgHoursStudied(hoursStudiedLogs.length > 0 ? (totalHoursStudied / hoursStudiedLogs.length) : 0)
                setDateRange(termData!.term_name)
                return hoursStudiedLogs;
            default:
                return hoursStudiedLogs;
        }
    }, [view, hoursStudiedLogs, anchorDate]);

    return { 
        createLogs, 
        fetchLogs, 
        setView, 
        view, 
        logsToShow, 
        goToNext, 
        goToPrevious, 
        dateRange, 
        hoursStudied,
        avgHoursStudied,
        calculateHoursStudiedByCourse
    }
}
 
export default useHoursStudiedLogs;