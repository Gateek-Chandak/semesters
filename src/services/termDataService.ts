// This service handles all Term Data modifications and all other associated data retrieval

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setData, updateScheme, updateCourse, deleteCourse } from "@/redux/slices/dataSlice";
// Hooks
import useData from "@/hooks/general/use-data";
import { Course, GradingScheme } from "@/types/mainTypes";
import { useToast } from "@/hooks/general/use-toast";
// Services
import { APIService } from "./apiService";

const _apiService = new APIService();

const TermDataService = () => {
    // Hooks
    const { courseData, courseIndex, termData } = useData();
    const data = useSelector((state: RootState) => state.data.data);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const { toast } = useToast();

    // deleteTerm(name, termBeingDeleted)
    async function deleteTerm(termName: string, termBeingDeleted: string): Promise<boolean> {
        try {
            // Call the API to delete the term
            const term = data.find((t) => t.term_name == termName);
            const response = await _apiService.deleteTerm(user!.id, term!.id);
    
            if (response.success) {
                // Update local state
                const updatedTerms = data.filter((t) => t.term_name !== termName);
                dispatch(setData(updatedTerms));
    
                // Show success toast
                toast({
                    variant: "success",
                    title: "Delete Successful",
                    description: `${termBeingDeleted} has been successfully deleted!`,
                    duration: 2000
                });
    
                return true;
            } else {
                // Show error toast if API response is unsuccessful
                toast({
                    variant: "destructive",
                    title: "Delete Unsuccessful",
                    description: `${termBeingDeleted} could not be deleted`,
                    duration: 2000
                });
                return false;
            }
        } catch (error) {
            console.error('Error deleting term:', error);
    
            // Show error toast on failure
            toast({
                variant: "destructive",
                title: "Delete Unsuccessful",
                description: `${termBeingDeleted} could not be deleted`,
                duration: 2000
            });
    
            return false;
        }
    }
    

    // deleteScheme(schemeName)
    function deleteScheme(schemeName: string) {
        const updatedSchemes = courseData?.grading_schemes.filter((s) => 
            s.scheme_name !== schemeName // Ensure this returns a boolean
        );
        const updatedCourse = {
            ...courseData,
            grading_schemes: updatedSchemes || [],
        };
        dispatch(
            updateCourse({
                term: termData!.term_name,
                courseIndex: courseIndex!,
                course: updatedCourse as Course,
            })
        );
    }

    // updateScheme(schemeName, newScheme)
    function updateGradingScheme(schemeIndex: number, courseIndex: number, newScheme: GradingScheme): boolean {
        dispatch(updateScheme({
            term: termData!.term_name,
            courseIndex: courseIndex,
            schemeIndex: schemeIndex,
            scheme: newScheme
        }))
        return true;
    }

    // deleteCourse(termName, courseIndex)
    async function handleDeleteCourse(termId: number, courseId: number) {
        try {
            // Call the API to delete the term
            const response = await _apiService.deleteCourse(user!.id, courseId);
    
            if (response.success) {
                // Update local state
                dispatch(deleteCourse({ term_id: termId, courseId: courseId }));
    
                // Show success toast
                toast({
                    variant: "success",
                    title: "Delete Successful",
                    description: `${response.course_title} has been successfully deleted!`,
                    duration: 2000
                });
    
                return true;
            } else {
                // Show error toast if API response is unsuccessful
                toast({
                    variant: "destructive",
                    title: "Delete Unsuccessful",
                    description: `Could not delete`,
                    duration: 2000
                });
                return false;
            }
        } catch (error) {
            console.error('Error deleting term:', error);
    
            // Show error toast on failure
            toast({
                variant: "destructive",
                title: "Delete Unsuccessful",
                description: `Could not delete`,
                duration: 2000
            });
    
            return false;
        }
    }

    return { deleteTerm, deleteScheme, updateGradingScheme, handleDeleteCourse };
}
 
export default TermDataService;