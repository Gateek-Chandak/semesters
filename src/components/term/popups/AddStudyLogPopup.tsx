// UI
import { Button } from "../../ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
// Custom Components
import { DateTimePicker } from "../../shared/DateTimePicker";
import { Input } from "../../ui/input";
// Hooks
import { ChangeEvent, useEffect, useState } from "react";
import useData from "@/hooks/general/use-data";
import { useToast } from "@/hooks/general/use-toast";

export type InputField = { course_id: number; course_title: string; hours_studied: number };
interface AddStudyLogPopupProps {
    isAddingLog: boolean,
    setIsAddingLog: React.Dispatch<React.SetStateAction<boolean>>;
    fetchLogs: any
    createLogs: any
}

const AddStudyLogPopup: React.FC<AddStudyLogPopupProps> = ({ isAddingLog, setIsAddingLog, fetchLogs, createLogs }) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Hooks
    const { termData } = useData();
    const { toast } = useToast();
    // States
    const [date, setDate] = useState<string | null>(today.toISOString());
    const [inputFields, setInputFields] = useState<InputField[]>([]);

    // Set the input fields when termData changes
    useEffect(() => {
        if (termData?.courses) {
            const fields = termData.courses.map(course => ({
                course_id: course.id,
                course_title: course.course_title,
                hours_studied: 0
            }));
            setInputFields(fields);
        }
    }, [termData?.courses]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, courseId: number) => {
        const value = Number(e.target.value);
        // Limiting input to positive numbers
        if (value < 0) {
            return;
        }

        // Limited inputs to a total of 24 hours
        const total = inputFields.reduce((acc, field) => {
            if (field.course_id === courseId) {
                return acc + value; // use the new input
            }
            return acc + field.hours_studied;
        }, 0);
        if (total > 24) {
            return;
        }

        setInputFields(prev =>
            prev.map(field =>
                field.course_id === courseId ? { ...field, hours_studied: parseFloat(value.toFixed(2)) } : field
            )
        );
    }

    const handleSubmit = async () => {
        if (termData!.courses.length <= 0) {
            toast({
                variant: "default",
                title: "Unable To Create Logs",
                description: "You need at least one course in this term to create logs.",
                duration: 3000
            })
            return;
        }

        toast({
            variant: "default",
            title: "Creating Logs...",
            duration: 3000
        })

        const result = await createLogs(date!, inputFields);

        if (result.success) {
            toast({
                variant: "success",
                title: "Logs Added",
                description: `Your logs have been successfully added.`,
                duration: 3000
            });
            fetchLogs();
            handleClose();
        } else {
            toast({
                variant: "destructive",
                title: "Error Creating Logs",
                description: result.message,
                duration: 3000
            });
        }
    }

    const handleClose = () => {
        setIsAddingLog(false);
        const fields = termData!.courses.map(course => ({
            course_id: course.id,
            course_title: course.course_title,
            hours_studied: 0
        }));
        setInputFields(fields);
        setDate(today.toISOString());
    }

    return ( 
        <Dialog open={isAddingLog} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Your Study Hours</DialogTitle>
                    <DialogDescription>You can override logs by choosing the same date.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-medium">Hours Studied</h1>
                        {termData!.courses.length <= 0 && <h1>No Courses Found.</h1>} 
                        <div className="ml-0 flex flex-col gap-4">
                            {inputFields.map((field) => (
                                <div key={field.course_id} className="text-sm flex flex-col gap-2">
                                    <h1 className="text-foreground">{field.course_title}</h1>
                                    <Input
                                        type="number"
                                        name={field.course_title}
                                        value={field.hours_studied}
                                        onChange={(e) => handleInputChange(e, field.course_id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-md font-medium">Date</h1>
                        <DateTimePicker enableHours={false} dueDate={date} setLocalDueDate={setDate}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Add Logs</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddStudyLogPopup;