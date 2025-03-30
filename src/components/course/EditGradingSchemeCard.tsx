// UI
import { CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "../ui/table";
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";
// Custom Components
import EditAssessmentRow from "./EditAssessmentRow";
import ConfirmDeletePopup from "../shared/ConfirmDeletePopup";
// Types
import { GradingScheme } from "@/types/mainTypes";
// Hooks
import { ChangeEvent, useState } from "react";
import useLocalScheme from "@/hooks/course/use-local-scheme";
import useUser from "@/hooks/general/use-user";
import useData from "@/hooks/general/use-data";
import { useToast } from "@/hooks/general/use-toast";
// Redux
import { useDispatch } from "react-redux";
import { updateCourse, updateScheme } from "@/redux/slices/dataSlice";
// Services
import DeleteDataService from "@/services/deleteDataService";
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import { APIService } from "@/services/apiService";
import { CalculationService } from "@/services/calculationService";

const _inputFieldValidationService = new InputFieldValidationService();
const _apiService = new APIService();
const _calculationService = new CalculationService();

interface DisplayGradingSchemeCardProps {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    scheme: GradingScheme;
    schemeIndex: number;
}

const EditGradingSchemeCard: React.FC<DisplayGradingSchemeCardProps> = ( { setIsEditing, scheme, schemeIndex } ) => {
    // Services
    const { handleDeleteScheme } = DeleteDataService();
    // Hooks
    const { courseData, termData } = useData();
    const { user } = useUser();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { localScheme, cannotSave, setSchemeName, syncChanges, setAssessmentDate, handleAssessmentDelete, setLocalScheme, discardSchemeChanges } = useLocalScheme(scheme, schemeIndex);
    // States
    //  conditionals
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const cachedScheme = scheme;;
    const cachedCourseGrade = courseData!.highest_grade;

    const updateSchemeInState = (updatedScheme: GradingScheme, newHighestGrade: number) => {
        dispatch(updateCourse({
            term_id: termData!.id,
            course_id: courseData!.id,
            updatedCourse: {...courseData!, highest_grade: newHighestGrade}
        }))
        dispatch(updateScheme({
            term_id: termData!.id,
            course_id: courseData!.id,
            scheme_id: scheme.id,
            updatedScheme: updatedScheme
        }));
    };
    
    const handleAssessmentChanges = async () => {
        const assessmentIdsRemaining = localScheme.assessments.map(a => a.id);
        const assessmentsToDelete = scheme.assessments.filter(a => !assessmentIdsRemaining.includes(a.id));
    
        // Delete assessments that no longer exist
        await Promise.all(assessmentsToDelete.map(a => _apiService.deleteAssessment(user!.id, a.id)));
    
        // Update remaining assessments
        await Promise.all(localScheme.assessments.map(a => _apiService.updateAssessment(user!.id, a)));
    };
    
    const updateCourseHighestGrade = (updatedSchemeGrade: number) => {
        const otherSchemes = courseData?.grading_schemes.filter(s => s.id !== localScheme.id) || [];
        let newHighestGrade = updatedSchemeGrade;
    
        if (otherSchemes.length > 0) {
            const currentHighestGrade = _calculationService.getHighestCourseGrade(otherSchemes);
            newHighestGrade = Math.max(updatedSchemeGrade, currentHighestGrade);
        }

        return newHighestGrade;
    };

    // Finalizes changes on a scheme. This includes updating/deleting assessments, updating scheme grade, and 
    // updating course highest_grade
    const handleSaveChanges = async () => {
        
        if (cannotSave.value) {
            toast({
                variant: "destructive",
                title: "Update Unsuccessful",
                description: cannotSave.reason,
                duration: 3000
            })
            return;
        }
    

        if (localScheme != scheme) {
            toast({
                variant: "default",
                title: "Saving...",
                description: '',
                duration: 3000
            });
            const updatedSchemeGrade = _calculationService.updateGradingSchemeGrade(localScheme.assessments);
            const updatedScheme = {...localScheme, grade: updatedSchemeGrade}
            const newHighestGrade = updateCourseHighestGrade(updatedSchemeGrade);

            updateSchemeInState(updatedScheme, newHighestGrade);
            setIsEditing(false)

            try {
                if (newHighestGrade !== courseData?.highest_grade) {
                    await _apiService.updateCourse(user!.id, { ...courseData!, highest_grade: newHighestGrade });
                }
                const updatedGradingScheme = await _apiService.updateGradingScheme(user!.id, updatedScheme);
                await handleAssessmentChanges();

                toast({
                    variant: "success",
                    title: "Update Successful",
                    description: `${updatedGradingScheme.scheme_name} was updated successfully`,
                    duration: 3000
                });
            } catch {
                updateSchemeInState(cachedScheme, cachedCourseGrade);
            }
        } else {
            setIsEditing(false)
        }
    }
    // discards changes
    const handleDiscardChanges = () => {
        setIsEditing(false);
        discardSchemeChanges();
    }

    // deletes a scheme
    const deleteScheme = async (id: number) => {
        const shouldDeleteScheme = await handleDeleteScheme(id)
        if (shouldDeleteScheme) {
            setIsEditing(false)
        }
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
                <Input className="text-left h-10 max-w-72 !text-lg font-medium" value={localScheme.scheme_name} name="schemeName" onChange={validateFields}/>
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
                            return ( <EditAssessmentRow  key={assessment.id} assessmentIndex={index} assessment={assessment} schemeIndex={schemeIndex}
                                                         syncChanges={syncChanges} setAssessmentDate={setAssessmentDate} handleAssessmentDelete={handleAssessmentDelete} 
                                                         setLocalScheme={setLocalScheme}/> )})}
                    </TableBody> 
                </Table>
            </div>
            <ConfirmDeletePopup name={scheme.scheme_name} id={scheme.id} deleteItem={deleteScheme}
                                isDeleting={isDeleting} setIsDeleting={setIsDeleting}/>
        </CarouselItem>
     );
}
 
export default EditGradingSchemeCard;