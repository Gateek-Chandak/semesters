// This service handles all Term Data modifications and all other associated data retrieval

// Hooks
import { useToast } from "@/hooks/general/use-toast";
// Redux
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setData, updateScheme, updateCourse, deleteCourse } from "@/redux/slices/dataSlice";
// Hooks
import useData from "@/hooks/general/use-data";
import { Course, GradingScheme } from "@/types/mainTypes";

const TermDataService = () => {
    // Hooks
    const { courseData, courseIndex, termData } = useData();
    const data = useSelector((state: RootState) => state.data.data)
    const dispatch = useDispatch();
    const { toast } = useToast();

    // deleteTerm(name, termBeingDeleted)
    function deleteTerm(name: string, termBeingDeleted: string): boolean {
        const updatedTerms = data.filter((t) => t.term !== name)
        dispatch(setData(updatedTerms))
        toast({
            variant: "success",
            title: "Delete Successful",
            description: termBeingDeleted + " has been successfully deleted!",
            duration: 2000
        });
        return true;
    }

    // deleteScheme(schemeName)
    function deleteScheme(schemeName: string) {
        const updatedSchemes = courseData?.gradingSchemes.filter((s) => 
            s.schemeName !== schemeName // Ensure this returns a boolean
        );
        const updatedCourse = {
            ...courseData,
            gradingSchemes: updatedSchemes!.length > 0 ? updatedSchemes : [],
        };
        dispatch(
            updateCourse({
                term: termData!.term,
                courseIndex: courseIndex!,
                course: updatedCourse as Course,
            })
        );
    }

    // updateScheme(schemeName, newScheme)
    function updateGradingScheme(schemeIndex: number, courseIndex: number, newScheme: GradingScheme): boolean {
        dispatch(updateScheme({
            term: termData!.term,
            courseIndex: courseIndex,
            schemeIndex: schemeIndex,
            scheme: newScheme
        }))
        return true;
    }

    // deleteCourse(termName, courseIndex)
    function handleDeleteCourse(termName: string, courseIndex: number) {
        dispatch(deleteCourse({ term: termName, courseIndex }));
    }

    return { deleteTerm, deleteScheme, updateGradingScheme, handleDeleteCourse };
}
 
export default TermDataService;