// This service handles all Term Data modifications and all other associated data retrieval

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setData, updateCourse, deleteCourse } from "@/redux/slices/dataSlice";
// Hooks
import useData from "@/hooks/general/use-data";
import { useToast } from "@/hooks/general/use-toast";
// Services
import { APIService } from "./apiService";
import { CalculationService } from "./calculationService";

const _apiService = new APIService();
const _calculationService = new CalculationService();

const DeleteDataService = () => {
    // Hooks
    const { courseData, courseIndex, termData, data } = useData();
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const { toast } = useToast();

    // deleteTerm(name, termBeingDeleted)
    async function handleDeleteTerm(termName: string, termBeingDeleted: string): Promise<boolean> {
        try {
            // Call the API to delete the term
            const term = data.find((t) => t.term_name == termName);
            const response = await _apiService.deleteTerm(user!.id, term!.id);
    
            // Update local state
            const updatedTerms = data.filter((t) => t.term_name !== termName);
            dispatch(setData(updatedTerms));

            // Show success toast
            toast({
                variant: "success",
                title: "Delete Successful",
                description: `${response.term_name} has been successfully deleted!`,
                duration: 2000
            });

            return true;
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

    // deleteCourse(termName, courseIndex)
    async function handleDeleteCourse(termId: number, courseId: number) {
        try {
            // Call the API to delete the term
            const response = await _apiService.deleteCourse(user!.id, courseId);
    
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
    
    // deleteScheme(schemeName)
    async function handleDeleteScheme(scheme_id: number) {
        try {
            // Delete scheme
            const response = await _apiService.deleteGradingScheme(user!.id, scheme_id);

            // Gather updated schemes and set update local state
            const updatedSchemes = courseData?.grading_schemes.filter((s) => s.id !== scheme_id ) || [];
            dispatch(
                updateCourse({
                    term: termData!.term_name,
                    courseIndex: courseIndex!,
                    course: { ...courseData!, grading_schemes: updatedSchemes || [] },
                })
            );

            // Set highest_grade for course
            if (updatedSchemes.length > 0) {
                const newHighestGrade = _calculationService.getHighestCourseGrade(updatedSchemes);
                if (newHighestGrade !== courseData?.highest_grade) {
                    await _apiService.updateCourse(user!.id, { ...courseData!, highest_grade: newHighestGrade });
                }
            } else {
                await _apiService.updateCourse(user!.id, { ...courseData!, highest_grade: 0 });
            }
        
            toast({
                variant: "success",
                title: "Delete Successful",
                description: `${response.scheme_name} has been successfully deleted!`,
                duration: 2000
            });

            return true;
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



    return { handleDeleteTerm, handleDeleteScheme, handleDeleteCourse };
}
 
export default DeleteDataService;