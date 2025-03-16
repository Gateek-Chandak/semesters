import { ChangeEvent, useState } from "react";
// UI
import { TableRow, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
// Types
import { Assessment, GradingScheme } from "@/types/mainTypes";
// Custom Components
import ConfirmDeletePopup from "../ConfirmDeletePopup";
import { DateTimePicker } from "./DateTimePicker";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";

const _inputFieldValidationService = new InputFieldValidationService();

interface EditAssessmentRowProps {
    assessment: Assessment;
    assessmentIndex: number;
    scheme: GradingScheme;
    schemeIndex: number;
    syncChanges: any;
    setAssessmentDate: any;
    handleAssessmentDelete: any;
    setLocalScheme: any;
}

const EditAssessmentRow: React.FC<EditAssessmentRowProps> = ( { assessment, assessmentIndex, syncChanges, setAssessmentDate, handleAssessmentDelete, setLocalScheme } ) => {
    // States
    //  conditionals
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    //  values
    const [localAssessment, setLocalAssessment] = useState<Assessment>(assessment)

    // Validates input fields
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let updatedAssessment = { ...localAssessment };
    
        switch (name) {
            case "assessmentName": // weird logic to handle updating name
                updatedAssessment.assessmentName = _inputFieldValidationService.inputAssessmentName(value);
                setLocalAssessment(updatedAssessment);
                return;
            case "assessmentGrade":
                const validatedGrade = _inputFieldValidationService.inputNumber(value);
                if (validatedGrade === undefined) {
                    return
                }
                updatedAssessment.grade = validatedGrade;
                break;
            case "assessmentWeight":
                const validatedWeight = _inputFieldValidationService.inputAssessmentWeight(value);
                if (validatedWeight === undefined) {
                    return
                }
                updatedAssessment.weight = validatedWeight ?? 0; 
                break;
            default:
                return;
        }
        // Update both the local assessment and the parent grading scheme
        setLocalAssessment(updatedAssessment);
        setLocalScheme((prevScheme: GradingScheme) => {
            const updatedAssessments = [...prevScheme.assessments];
            updatedAssessments[assessmentIndex] = updatedAssessment;
            return { ...prevScheme, assessments: updatedAssessments };
        });
        // syncChanges(assessmentIndex, updatedAssessment)
    };

    // Handles when the user changes a date
    const handleDateChange = (selectedDate: string) => {
        const updatedAssessment = {...localAssessment, dueDate: selectedDate}
        setLocalAssessment(updatedAssessment)
        setAssessmentDate(assessmentIndex, updatedAssessment)
    }

    return ( 
        <TableRow key={assessmentIndex}>
            <TableCell className="text-center w-[5%]">
                <Button className="w-5 h-8 hover:text-red-500" variant={'ghost'} onClick={() => setIsDeleting(true)}>
                    <XIcon className="!w-3 !h-3"/>
                </Button>
            </TableCell>
            <TableCell className="text-center w-[25%]">
                <Input type="text" name="assessmentName" value={localAssessment.assessmentName} onChange={validateFields} 
                       onBlur={() => syncChanges(assessmentIndex, localAssessment)}/>
            </TableCell>
            <TableCell className="text-center w-[25%]">
                <DateTimePicker dueDate={localAssessment.dueDate} syncLocalAssessmentChanges={handleDateChange}/>
            </TableCell>
            <TableCell className="w-[10%]">
                <Input type="number" name="assessmentWeight" value={localAssessment.weight} onChange={validateFields}/>
            </TableCell>
            <TableCell className="text-center w-[15%]"> 
                <Input
                    type="number"
                    name="assessmentGrade"
                    value={(localAssessment.grade || localAssessment.grade == 0) ? localAssessment.grade : ""}
                    onChange={validateFields}
                    placeholder="00"
                    className="w-[60%] p-2 my-3 inline"/>
                    {" "}%
            </TableCell>
            <ConfirmDeletePopup name={localAssessment.assessmentName}
                                deleteItem={handleAssessmentDelete}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}/>
        </TableRow>
     );
}
 
export default EditAssessmentRow;