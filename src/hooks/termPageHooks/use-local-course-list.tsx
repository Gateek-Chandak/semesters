// Types
import { Course } from "@/types/mainTypes"
// Redux
import { updateTerm } from "@/redux/slices/dataSlice"
// Hooks
import { useEffect, useState } from "react"
import useData from "../generalHooks/use-data"
import { useDispatch } from "react-redux"
import { useToast } from "../generalHooks/use-toast"
import useParsedRouteParams from "../generalHooks/use-parsed-route-params"

const useLocalCourseList = () => {
    // Hoosks
    const { termData } = useData();
    const { parsedTerm } = useParsedRouteParams();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [localTermCourses, setLocalTermCourses] = useState<Course[]>(termData?.courses!)
    const [cannotSave, setCannotSave] = useState<{ value: boolean, reason: string }>({ value: false, reason: ""})

    useEffect(() => {
        setLocalTermCourses(termData?.courses!)
    }, [parsedTerm])

    // IMPLEMENT ALL ERRORS FOR EMPTY FIELDS
    useEffect(() => {
        // Catch courses with the same name
        const coursesSeen = new Set();
        const duplicateCourseName = localTermCourses.some((course: Course) => {
            if (coursesSeen.has(course.courseTitle)) {
                return true;
            }
            coursesSeen.add(course.courseTitle)                
        })
        if (duplicateCourseName) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "This course name already exists",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "This course name already exists"});
            return;
        } 

        // Catch empty course names
        const emptyCourseName = localTermCourses.some((course: Course) => {
            if (course.courseTitle.trim() == "") {
                return true;
            }             
        })
        if (emptyCourseName) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "Course name cannot be empty",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "Course name cannot be empty"});
            return;
        }

        // Catch empty course subtitle
        const emptyCourseSubtitle = localTermCourses.some((course: Course) => {
            if (course.courseSubtitle.trim() == "" && !termData?.isCompleted) {
                return true;
            }             
        })
        if (emptyCourseSubtitle) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "Course subtitle cannot be empty",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "Course subtitle cannot be empty"});
            return;
        }


        setCannotSave( { value: false, reason: "" }); 
    }, [localTermCourses])


    // save action
    const saveTermCoursesChanges = () => {
        if (termData?.courses == localTermCourses) {
            return;
        }
        if (!cannotSave.value) {
            dispatch(updateTerm({
                term: termData!.term,
                courses: localTermCourses
            }))
            toast({
                variant: "success",
                title: "Update Successful",
                description: termData?.term + " was updated successfully",
                duration: 1000
            })
        } else {
            toast({
                variant: "destructive",
                title: "Update Unsuccessful",
                description: cannotSave.reason,
                duration: 1000
            })
        }

    }

    // discard changes action
    const discardTermCoursesChanges = () => {
        setLocalTermCourses(termData!.courses)
        if (termData?.courses == localTermCourses) {
            return;
        }
        toast({
            variant: "success",
            title: "Discard Successful",
            description: "Changes to " + termData?.term + " were discarded",
            duration: 1000
        })
    }

    // sync changes action
    const syncChanges = (courseIndex: number, updatedCourse: Course) => {
        setLocalTermCourses((prevCourses) => prevCourses.map((course, i) => (i === courseIndex ? updatedCourse : course)));
    }

    return { localTermCourses, setLocalTermCourses, saveTermCoursesChanges, discardTermCoursesChanges, syncChanges, cannotSave }
}
 
export default useLocalCourseList;