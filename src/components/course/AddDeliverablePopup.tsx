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
import useData from "@/hooks/general/use-data";
// Libraries
import { DateTimePicker } from "../shared/DateTimePicker";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import FormSubmitService from "@/services/formSubmitService";
import { GradingScheme } from "@/types/mainTypes";

const _inputFieldValidationService = new InputFieldValidationService();

interface AddDeliverablePopupProps {
    isAddingDeliverable: boolean;
    setIsAddingDeliverable: React.Dispatch<React.SetStateAction<boolean>>;
    scheme: GradingScheme
}

const AddDeliverablePopup: React.FC<AddDeliverablePopupProps> = ( {scheme, isAddingDeliverable, setIsAddingDeliverable} ) => {
    // Hooks
    const { courseData } = useData();
    const { createAssessment } = FormSubmitService();
    // States
    //  values
    const [selectedScheme, setSelectedScheme] = useState<string>(courseData!.grading_schemes[0].scheme_name)
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
        setSelectedScheme(courseData!.grading_schemes[0].scheme_name)
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
// NEED TO MODIFY TO ALSO UPDATE GRADE STORED IN GRADING SCHEME DATABASE
    const handleCreateDeliverable = async () => {
        const shouldCreateDeliverable = await createAssessment(scheme.id, assessmentName, assessmentWeight, assessmentGrade, assessmentDate, selectedScheme)
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
                        <DateTimePicker enableHours={true} dueDate={assessmentDate} setLocalDueDate={setAssessmentDate}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Grading Scheme *</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{selectedScheme ? selectedScheme : 'Choose Grading Scheme'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuRadioGroup value={selectedScheme} onValueChange={setSelectedScheme}>
                                    {courseData && courseData.grading_schemes.map((scheme: GradingScheme) => {
                                        return (
                                            <DropdownMenuRadioItem key={scheme.id} value={scheme.scheme_name}>{scheme.scheme_name}</DropdownMenuRadioItem>
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