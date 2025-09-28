// UI
import { Card } from "../ui/card";
// Libraries
import { format } from "date-fns";
// Services
// Hooks
import useTermCalendarEvents from "@/hooks/term/use-term-calendar-events";
import { Link } from "react-router-dom";
import useData from "@/hooks/general/use-data";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CalendarEvent } from "@/types/mainTypes";

const EST_OFFSET_IN_MILLISECONDS = 18000000;
const DAY_IN_MILLISECONDS = 86400000;

interface EventsInProximityProps {
    selectedPeriod: string;
}

const EventsInProximity: React.FC<EventsInProximityProps> = ({ selectedPeriod }) => {

    const { calendarEvents } = useTermCalendarEvents();
    const { termData } = useData();

    // Time period options
    const timeOptions = [
        { value: "0", label: "Today", days: 0 },
        { value: "7", label: "7 Days", days: 7 },
        { value: "14", label: "14 Days", days: 14 },
        { value: "30", label: "This Month", days: 30 },
        { value: "60", label: "Next 2 Months", days: 60 },
        { value: "90", label: "Next 3 Months", days: 90 },
        { value: "180", label: "Next 4 Months", days: 180 },
    ];

    const [eventsNextXDays, setEventsNextXDays] = useState<CalendarEvent[]>([]);
    const proximityInDays = useMemo(() => timeOptions.find(option => option.value === selectedPeriod)?.days ?? 7, [selectedPeriod]);

    // Calculate date range based on selected period
    useEffect(() => {
        const now = new Date(Date.now() - EST_OFFSET_IN_MILLISECONDS);
        let proximityDaysFromNow: Date;
        
        if (proximityInDays === 0) {
            // For "Today", show events until end of today
            proximityDaysFromNow = new Date(Date.now() - EST_OFFSET_IN_MILLISECONDS);
            console.log(proximityDaysFromNow);
            proximityDaysFromNow.setHours(23, 59, 59, 999);

        } else {
            // For other periods, add the specified number of days
            proximityDaysFromNow = new Date(Date.now() + (proximityInDays * DAY_IN_MILLISECONDS) - EST_OFFSET_IN_MILLISECONDS);
        }

        // Filter Events
        setEventsNextXDays(calendarEvents.filter(event => {
            const eventDate = new Date(event.start!);
            return eventDate >= now && eventDate <= proximityDaysFromNow;
        }));
    }, [calendarEvents, proximityInDays])

    return ( 
        <Card className="w-[100%] h-full h-min-[15rem] h-max-[25rem] overflow-y-auto p-4 flex flex-col gap-2">
            <div className="h-full h-min-[15rem] flex flex-col gap-4 justify-between overflow-y-auto">
                {eventsNextXDays.length > 0 && eventsNextXDays.map((event, index) => {
                    return (
                        <Link key={index} to={`/home/${termData?.term_name}/${event.course}`}>
                            <Card key={index} className={`p-3 h-full !rounded-xl transform transition-all duration-200 hover:bg-gray-100`}>
                                <div className="flex flex-row justify-between items-center">
                                    <h1 className={`font-medium text${event.color}`}>{event.course}</h1>
                                    <SquareArrowOutUpRightIcon className="w-4 h-4 -mt-3  !text-muted-foreground" />
                                </div>
                                <div className="mt-2 flex flex-row justify-between">
                                    <p className="font-normal truncate">{event.title}</p>
                                    <p className="font-extralight text-sm">{format(event.start!, `MMMM dd, yyyy '@' hh:mma`)}</p>
                                </div>
                            </Card>
                        </Link>
                        )})} 
                {eventsNextXDays.length <= 0 && 
                    <div className="w-full h-full flex flex-row justify-center items-center">
                        <h1 className="font-medium">No Upcoming Deliverables.</h1>
                    </div>}
            </div>
        </Card>
     );
}
 
export default EventsInProximity;