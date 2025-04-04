// UI
import { Card } from "../ui/card";
// Libraries
import { format } from "date-fns";
// Services
// Hooks
import useTermCalendarEvents from "@/hooks/term/use-term-calendar-events";

interface EventsInProximityProps {
    proximityInDays: number;
}

const EventsInProximity: React.FC<EventsInProximityProps> = ( {proximityInDays}: EventsInProximityProps ) => {

    const { calendarEvents } = useTermCalendarEvents();

    // Today + ProximityInDays
    const proximityDaysFromNow = new Date(Date.now() + proximityInDays * 86400000);

    // Filter Events
    const now = new Date();
    const eventsNextXDays = calendarEvents.filter(event => {
        const eventDate = new Date(event.start!);
        return eventDate >= now && eventDate <= proximityDaysFromNow;
    });

    return ( 
        <Card className="w-[100%] h-full h-min-[15rem] h-max-[25rem] overflow-y-auto p-4 flex flex-col gap-2">
            <div className="h-full h-min-[15rem] flex flex-col gap-4 justify-between overflow-y-auto">
                {eventsNextXDays.length > 0 && eventsNextXDays.map((event, index) => {
                    return (
                        <Card key={index} className={`p-5 h-full !rounded-xl`}>
                            <h1 className={`font-medium text-${event.color}-600`}>{event.course}</h1>
                            <div className="mt-2 flex flex-row justify-between">
                                <p className="font-normal truncate">{event.title}</p>
                                <p className="font-extralight text-sm">{format(event.start!, `MMMM dd, yyyy '@' hh:mma`)}</p>
                            </div>
                        </Card>)})} 
                {eventsNextXDays.length <= 0 && 
                    <div className="w-full h-full flex flex-row justify-center items-center">
                        <h1 className="font-medium">No Upcoming Deliverables.</h1>
                    </div>}
            </div>
        </Card>
     );
}
 
export default EventsInProximity;