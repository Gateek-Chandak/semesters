// UI
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
// Hooks
import { useState, ChangeEvent } from "react";
import useData from "@/hooks/use-data";
// Libraries
import { DateTimePicker } from "./DateTimePicker";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import FormSubmitService from "@/services/formSubmitService";

const _inputFieldValidationService = new InputFieldValidationService();

interface AddDeliverablePopupProps {
    isAddingDeliverable: boolean;
    setIsAddingDeliverable: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDeliverablePopup: React.FC<AddDeliverablePopupProps> = ( {isAddingDeliverable, setIsAddingDeliverable} ) => {
    // Hooks
    const { courseData } = useData();
    const { createDeliverable } = FormSubmitService();
    // States
    //  values
    const [selectedScheme, setSelectedScheme] = useState<string>(courseData!.gradingSchemes[0].schemeName)
    const [assessmentName, setAssessmentName] = useState<string>('')
    const [assessmentWeight, setAssessmentWeight] = useState<number>(0)
    const [assessmentGrade, setAssessmentGrade] = useState<number | null>(null)
    const [assessmentDate, setAssessmentDate] = useState<string | null>(null)

    // Resets all values
    const handleClose = () => {
        setIsAddingDeliverable(false)
        setAssessmentName('')
        setAssessmentWeight(0)
        setAssessmentGrade(null)
        setAssessmentDate(null)
        setSelectedScheme(courseData!.gradingSchemes[0].schemeName)
    }

    // Manage Input Contraints
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "assessmentName":
                setAssessmentName(_inputFieldValidationService.inputAssessmentName(value));
                return;
            case "assessmentGrade":
                const validatedGrade = _inputFieldValidationService.inputNumber(value)
                if (validatedGrade === undefined) {
                    return;
                }
                setAssessmentGrade(validatedGrade);
                return;
            case "assessmentWeight":
                const validatedWeight = _inputFieldValidationService.inputAssessmentWeight(value)
                if (validatedWeight === undefined) {
                    return;
                }
                if (validatedWeight == null) {
                    setAssessmentWeight(0)
                    return;
                }
                setAssessmentWeight(validatedWeight);
                return;
            default:
                return false
        }
    }

    const handleCreateDeliverable = () => {
        const shouldCreateDeliverable = createDeliverable(assessmentName, assessmentWeight, assessmentGrade, assessmentDate, selectedScheme)
        if (shouldCreateDeliverable) {
            handleClose();
        }
    };
    

    return ( 
        <Dialog open={isAddingDeliverable} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Deliverable</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Name *</h1>
                        <Input placeholder="ex. Quiz 1" name="assessmentName" value={assessmentName} onChange={validateFields}></Input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Weight</h1>
                        <Input type="number" placeholder="ex. 10" name="assessmentWeight" value={assessmentWeight || assessmentWeight == 0 ? assessmentWeight : ""} onChange={validateFields}></Input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Grade</h1>
                        <Input type="number" placeholder="ex. 85" name="assessmentGrade" value={assessmentGrade || assessmentGrade == 0 ? assessmentGrade : ""} onChange={validateFields}></Input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Due Date</h1>
                        <DateTimePicker dueDate={assessmentDate} setLocalDueDate={setAssessmentDate}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Grading Scheme *</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{selectedScheme ? selectedScheme : 'Choose Grading Scheme'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuRadioGroup value={selectedScheme} onValueChange={setSelectedScheme}>
                                    {courseData && courseData.gradingSchemes.map((scheme) => {
                                        return (
                                            <DropdownMenuRadioItem key={scheme.schemeName} value={scheme.schemeName}>{scheme.schemeName}</DropdownMenuRadioItem>
                                        )
                                    })}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateDeliverable}>+ Add Deliverable</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddDeliverablePopup;