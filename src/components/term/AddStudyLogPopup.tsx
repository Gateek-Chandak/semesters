// UI
import { Button } from "../ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
// Custom Components
import { DateTimePicker } from "../shared/DateTimePicker";
import { Input } from "../ui/input";
// Hooks
import { ChangeEvent, useState } from "react";
import useParsedRouteParams from "@/hooks/general/use-parsed-route-params";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import FormSubmitService from "@/services/formSubmitService";

const _inputFieldValidationService = new InputFieldValidationService();

interface AddStudyLogPopupProps {
    isAddingLog: boolean,
    setIsAddingLog: React.Dispatch<React.SetStateAction<boolean>>;
    forToday: boolean
}

const AddStudyLogPopup: React.FC<AddStudyLogPopupProps> = ({ isAddingLog, setIsAddingLog }) => {
    // Hooks
    const { parsedTerm } = useParsedRouteParams();
    const { addStudyLog } = FormSubmitService();
    // States
    const [hoursStudied, setHoursStudied] = useState<number>(0)
    const [date, setDate] = useState<string | null>((new Date()).toISOString());

    let lowerLimit = "";
    let upperLimit = "";
    const term = parsedTerm?.split(' ')[0];
    const year = parsedTerm?.split(' ')[1];
    if (term == 'Fall') {
        lowerLimit = `${year}-09-01`;
        upperLimit = `${year}-12-30`;
    } else if (term == 'Winter') {
        lowerLimit = `${year}-01-01`;
        upperLimit = `${year}-04-30`;
    } else {
        lowerLimit = `${year}-05-01`;
        upperLimit = `${year}-08-30`;
    }


    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "hoursStudied":
                const validatedWeight = _inputFieldValidationService.inputHoursStudied(value)
                if (validatedWeight === undefined) {
                    return;
                }
                if (validatedWeight == null) {
                    setHoursStudied(0)
                    return;
                }
                setHoursStudied(validatedWeight);
                return;
            default:
                return false
        }
    }

    const handleSubmit = () => {
        const shouldAddLog = addStudyLog(date, lowerLimit, upperLimit);
        
        if (shouldAddLog) {
            setIsAddingLog(false);
        }
    }

    const handleClose = () => {
        setHoursStudied(0);
        setDate((new Date).toISOString());
        setIsAddingLog(false);
    }

    return ( 
        <Dialog open={isAddingLog} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Log</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-md font-medium">Hours Studied</h1>
                        <Input type="number" name="hoursStudied" value={hoursStudied} onChange={validateFields}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-md font-medium">Date</h1>
                        <DateTimePicker enableHours={false} dueDate={date} setLocalDueDate={setDate}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Add Course</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddStudyLogPopup;