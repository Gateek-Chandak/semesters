// UI
import { Dialog,
         DialogHeader,
         DialogContent,
         DialogFooter,
         DialogTitle,
         DialogDescription
        } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// Hooks
import { useState } from "react";
import { useToast } from "@/hooks/generalHooks/use-toast";
import useTermCalendarEvents from "@/hooks/termPageHooks/use-term-calendar-events";
import useParsedRouteParams from "@/hooks/generalHooks/use-parsed-route-params";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

interface ExportGoogleCalPopupProps {
    isExporting: boolean;
    setIsExporting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExportGoogleCalPopup: React.FC<ExportGoogleCalPopupProps> = ( {isExporting, setIsExporting} ) => {
    // Hooks
    const { calendarEvents } = useTermCalendarEvents();
    const { toast } = useToast()
    const { parsedTerm } = useParsedRouteParams();
    // States
    //  conditionals
    const [loading, setLoading] = useState<boolean>(false)
    //  values
    const [calendarName, setCalendarName]= useState<string>(`Semesters | ${parsedTerm}`)

    const handleClose = () => {
        setIsExporting(false)
        setCalendarName(`Semesters | ${parsedTerm}`)
    }

    const handleExport = async () => {
        if (calendarName.trim() === '') {
            return;
        }
        if (calendarEvents.length <= 0) {
            toast({
                variant: "destructive",
                title: "Calendar Export Unsuccessful",
                description: "Must have at least one event to export",
            });
            handleClose();
            return;
        }
        setIsExporting(false)
        setLoading(true)

        try {
            _apiService.exportToGoogleCalendar(calendarName, calendarEvents)
            toast({
                variant: "success",
                title: "Calendar Export Successfull",
                description: "Your term calendar was successfully exported",
            });
            handleClose();
            setLoading(false)
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Calendar Export Unsuccessful",
                description: "Your calendar export was unsuccessful",
            });
            setLoading(false)
            setIsExporting(true)
        }
    };    

    return ( 
        <Dialog open={isExporting || loading} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export to Google Calendar</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {isExporting && !loading && 
                    <div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Name *</h1>
                                <Input placeholder="ex. Quiz 1" value={calendarName} onChange={(e) => setCalendarName(e.target.value.trimStart().slice(0, 30))}></Input>
                            </div>
                        </div>
                    </div>}
                {loading && <h1 className="text-center">Exporting...</h1>}
                <DialogFooter>
                    {!loading && <Button onClick={handleExport}>Export</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default ExportGoogleCalPopup;