// UI
import { Button } from "../../ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
// Custom Components
import { DateTimePicker } from "../../shared/DateTimePicker";
import { Input } from "../../ui/input";
// Hooks
import { ChangeEvent, useState } from "react";
import useData from "@/hooks/general/use-data";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import { Course } from "@/types/mainTypes";

const _inputFieldValidationService = new InputFieldValidationService();

interface AddStudyLogPopupProps {
    isAddingLog: boolean,
    setIsAddingLog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddStudyLogPopup: React.FC<AddStudyLogPopupProps> = ({ isAddingLog, setIsAddingLog }) => {
    // Hooks
    const { termData } = useData();
    // States
    const [hoursStudied, setHoursStudied] = useState<number>(0)
    const [date, setDate] = useState<string | null>((new Date()).toISOString());

    // const startDate = termData!.start_date;
    // const endDate = termData!.end_date;


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
        return;
        // const shouldAddLog = addStudyLog(date, lowerLimit, upperLimit);
        
        // if (shouldAddLog) {
        //     setIsAddingLog(false);
        // }
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
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-medium">Hours Studied</h1>
                        <div className="ml-0 flex flex-col gap-4">
                            {termData && termData.courses.map((course: Course) => {
                                return (
                                    <div key={course.id} className="text-sm flex flex-col gap-2">
                                        <h1 className={`text-foreground`}>{course.course_title}</h1>
                                        <Input type="number" name="hoursStudied" value={hoursStudied} onChange={validateFields}/>
                                    </div>
                                )
                            })}
                        </div>
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