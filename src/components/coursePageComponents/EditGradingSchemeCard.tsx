// UI
import { CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table,
         TableHeader,
         TableRow,
         TableHead,
         TableBody,
} from "../ui/table";
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";
// Custom Components
import EditAssessmentRow from "./EditAssessmentRow";
import ConfirmDeletePopup from "../ConfirmDeletePopup";
// Types
import { GradingScheme } from "@/types/mainTypes";
// Hooks
import { ChangeEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import useLocalScheme from "@/hooks/coursePageHooks/use-local-scheme";
// Services
import TermDataService from "@/services/termDataService";
import { InputFieldValidationService } from "@/services/inputFieldValidationService";

const _inputFieldValidationService = new InputFieldValidationService();

interface DisplayGradingSchemeCardProps {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    scheme: GradingScheme;
    schemeIndex: number;
}

const EditGradingSchemeCard: React.FC<DisplayGradingSchemeCardProps> = ( { setIsEditing, scheme, schemeIndex } ) => {
    // Services
    const { deleteScheme } = TermDataService();
    // Hooks
    const { toast } = useToast();
    const { localScheme, cannotSave, setSchemeName, saveSchemeChanges, syncChanges, setAssessmentDate, handleAssessmentDelete, setLocalScheme, discardSchemeChanges } = useLocalScheme(scheme, schemeIndex);
    // States
    //  conditionals
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    // Saves a scheme
    const handleSaveChanges = () => {
        saveSchemeChanges()
        if (!cannotSave.value) {
            setIsEditing(false)
        }
    }
    // discards changes
    const handleDiscardChanges = () => {
        setIsEditing(false);
        discardSchemeChanges();
    }

    // deletes a scheme
    const handleDeleteScheme = (name: string) => {
        deleteScheme(name)
        toast({
            variant: "success",
            title: "Delete Successful",
            description: name + " has been successfully deleted!",
            duration: 2000
        });
        setIsEditing(false)
    };
    
    // Manage Input Contraints
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "schemeName":
                const validatedName = _inputFieldValidationService.inputGradingSchemeName(value)
                setSchemeName(validatedName)
                return;
            default:
                return false
        }
    }

    return ( 
        <CarouselItem className="pt-5 custom-card flex flex-col gap-8">
            <div className='w-full pr-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                <Input className="text-left h-10 max-w-72 !text-lg font-medium" value={localScheme.schemeName} name="schemeName" onChange={validateFields}/>
                <div className="flex flex-row gap-3">
                    <Button variant="outline" className="md:ml-auto bg-white border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" onClick={() => setIsDeleting(!isDeleting)}>
                        <Trash2Icon className="" />
                    </Button>
                    <Button variant="outline" className='text-red-500 border-2 border-red-500 hover:text-red-500' onClick={handleDiscardChanges}>Discard<XIcon/> </Button>
                    <Button variant="outline" className=' border-2 border-green-500 text-green-500 hover:text-green-500' onClick={handleSaveChanges}>Save<CheckIcon/></Button>
                </div>

            </div>
            <div className="h-[33.5rem] overflow-y-auto" >
                <Table className="mb-4">
                    <TableHeader>
                        <TableRow> 
                            <TableHead className="text-center"></TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Due Date</TableHead>
                            <TableHead className="text-center">Weight</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {localScheme.assessments.map((assessment, index) => {
                            return ( <EditAssessmentRow  key={assessment.assessmentName} assessmentIndex={index} assessment={assessment} scheme={scheme} schemeIndex={schemeIndex}
                                                         syncChanges={syncChanges} setAssessmentDate={setAssessmentDate} handleAssessmentDelete={handleAssessmentDelete} setLocalScheme={setLocalScheme}/> )})}
                    </TableBody> 
                </Table>
            </div>
            <ConfirmDeletePopup name={scheme.schemeName} deleteItem={handleDeleteScheme}
                                isDeleting={isDeleting} setIsDeleting={setIsDeleting}/>
        </CarouselItem>
     );
}
 
export default EditGradingSchemeCard;