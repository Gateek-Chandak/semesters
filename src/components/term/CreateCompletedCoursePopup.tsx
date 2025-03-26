import { ChangeEvent, useState } from "react";
// UI
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// Services
import FormSubmitService from "@/services/formSubmitService";
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
// Hooks
import useData from "@/hooks/general/use-data";

const _inputFieldValidationService = new InputFieldValidationService();

interface CreateCoursePopupProps {
    isCreatingCourse: boolean;
    setIsCreatingCourse: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCompletedCoursePopup: React.FC<CreateCoursePopupProps> = ({ isCreatingCourse, setIsCreatingCourse }) => {
    // Services
    const { createCompletedCourse } = FormSubmitService();
    // Hooks
    const { termData } = useData();
    // States
    //   values
    const [courseCode, setCourseCode] = useState<string>("");
    const [courseNumber, setCourseNumber] = useState<string>("");
    const [courseGrade, setCourseGrade] = useState<number | null>(0);

    // Handle close states
    const handleClose = () => {
        setIsCreatingCourse(false)
        setCourseGrade(0)
        setCourseCode("")
        setCourseNumber("")
    }

    // Manage Input Contraints
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "courseGrade":
                const validatedValue = _inputFieldValidationService.inputNumber(value)
                if (validatedValue === undefined) {
                    return;
                }
                setCourseGrade(validatedValue);
                return;
            case "courseCode":
                setCourseCode(_inputFieldValidationService.inputCourseCode(value));
                return;
            case "courseNumber":
                setCourseNumber(_inputFieldValidationService.inputCourseNumber(value));
                return;
            default:
                return false
        }
    }


    const handleCreateCourse = async (): Promise<void> => {
        setIsCreatingCourse(true);
        const shouldCreateCourse = await createCompletedCourse(termData!, courseCode, courseNumber, courseGrade);

        if (shouldCreateCourse) {
            handleClose();
        }
    };

    return ( 
        <Dialog open={isCreatingCourse} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Completed Course</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 text-sm">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-medium">Course Code *</h1>
                        <Input placeholder="CFM" name="courseCode" value={courseCode} onChange={validateFields}></Input>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="font-medium">Course Number *</h1>
                        <Input placeholder="101" name="courseNumber" value={courseNumber} onChange={validateFields}></Input>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="font-medium">Course Grade *</h1>
                        <Input placeholder="75" type="number" name="courseGrade" value={courseGrade || courseGrade == 0 ? courseGrade : ""} onChange={validateFields}></Input>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateCourse}>Add Course</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default CreateCompletedCoursePopup;