// This service handles all form submit logic for term data and incoming data related to forms

// Hooks
import { useToast } from "@/hooks/general/use-toast";
import useData from "@/hooks/general/use-data";
// Redux
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addTerm, addCourse, updateCourse } from "@/redux/slices/dataSlice";
// Types
import { Course, GradingScheme, IncomingCourseInfo, Term } from "@/types/mainTypes";
import { AxiosError } from "axios";
// Services
import { APIService } from "./apiService";
import { CalculationService } from "./calculationService";
const _apiService = new APIService();
const _calculationService = new CalculationService();

const FormSubmitService = () => {
    // redux inits
    const data = useSelector((state: RootState) => state.data.data);
    const dispatch = useDispatch();
    // hooks
    const { toast } = useToast();
    const { courseData, courseIndex, termData } = useData();
    // services
    const _formValidationService = new FormValidationService();

    // createNewTerm(termName, selectedYear, isCompleted) creates a new term and dispatches the action
    function createNewTerm(termName: string, selectedYear: number, isCompleted: boolean): boolean {
        const isTermValid = _formValidationService.validateNewTerm(data, termName, selectedYear)

        const assembledName = termName + ' ' + selectedYear.toString()
        if (isTermValid) {
            dispatch(addTerm({term: {term: assembledName, isCompleted: isCompleted, courses: []}}))
            toast({
                variant: "success",
                title: "Create Successful",
                description: assembledName + " has been successfully created!",
                duration: 2000
            });
            return true;
        } else {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: assembledName + " could not be created",
                duration: 2000
            });
            return false;
        }
    }

    // createCompletedCourse(termData, courseCode, courseNumber, grade) creates a new completed course
    function createCompletedCourse(termData: Term, courseCode: string, courseNumber: string, grade: number | null): boolean {
        const { isValid, error } = _formValidationService.validateNewCompletedCourse(termData, courseCode, courseNumber, grade);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 2000
            });
            return false;
        }

        const newCourse: Course = {
            courseTitle: courseCode + ' ' + courseNumber,
            courseSubtitle: "",
            colour: "black",
            highestGrade: grade!,
            gradingSchemes: []
        }
        dispatch(addCourse({ term: termData.term, course: newCourse }));
        toast({
            variant: "success",
            title: "Create Successful",
            description: newCourse.courseTitle + " has been successfully created!",
            duration: 2000
        });
        return true;
    }

    // formatNewGradingScheme(courseInfo) takes in incoming course info from api and returns it as formatted
    function formatNewGradingScheme(courseInfo: IncomingCourseInfo) {
        console.log(courseInfo)
        const response =  courseInfo.gradingSchemes.map((scheme) => ({
            schemeName: scheme.schemeName,
            grade: 0,
            assessments: scheme.assessments.map((assessment) => ({
                assessmentName: assessment.assessmentName,
                dueDate: assessment.dueDate ? new Date(assessment.dueDate).toISOString() : null,
                weight: assessment.weight,
                grade: null,
            })),
        }));
        console.log(response)
        return response;
    };

    // createCompletedCourse(termData, courseCode, courseNumber, courseSubtitle)
    async function createCourse(termData: Term, courseCode: string, courseNumber: string, courseSubtitle: string, colour: string, file: File | null): Promise<boolean> {
        const { isValid, error } = _formValidationService.validateNewCourse(courseCode, courseNumber, courseSubtitle);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 2000
            });
            return false;
        }

        if (!file) {
            const newCourse = {
                courseTitle: courseCode + ' ' + courseNumber,
                courseSubtitle: courseSubtitle,
                colour: colour,
                highestGrade: 0,
                gradingSchemes: []
            }
            dispatch(addCourse({ term: termData.term, course: newCourse as Course }));
            return true;
        } else if (file) {
            const formData = new FormData()
            formData.append("pdf", file);
            try {
                const response = await _apiService.uploadSchedule(formData);
                const gradingSchemes = formatNewGradingScheme(response);
                const newCourse = {
                    courseTitle: courseCode + ' ' + courseNumber,
                    courseSubtitle: courseSubtitle,
                    colour: colour,
                    highestGrade: 0,
                    gradingSchemes: gradingSchemes
                };
                dispatch(addCourse({ term: termData ? termData.term : "", course: newCourse as Course }));
                return true;
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const errorMsg = error.response?.data?.error;
                    toast({
                        variant: "destructive",
                        title: "File Upload Unsuccessful",
                        description: errorMsg === "no assessment schedule found"
                            ? "Your file is not a syllabus."
                            : "There was an error uploading your file. Please try again.",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Unknown Error",
                        description: "An unknown error occurred.",
                    });
                }
                return false;
            }
        }
        return false;
    }

    // createDeliverable(name, weight, grade, date, scheme) creates a new deliverable
    function createDeliverable(name: string, weight: number, grade: number | null, date: string | null, schemeName: string): boolean {
        const { isValid, error } = _formValidationService.vaildateNewAssessment(name, courseData, schemeName);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 2000
            });
            return false;
        }

        const newAssessment = {
            assessmentName: name,
            weight: weight,
            grade: grade,
            dueDate: date,
        };
        let updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
            if (scheme.schemeName === schemeName) {
                return { ...scheme, assessments: [...scheme.assessments, newAssessment]};
            }
            return scheme;
        });
        updatedSchemes = _calculationService.updateSchemes(updatedSchemes as GradingScheme[], newAssessment.grade, newAssessment.assessmentName)    
        const newHighestGrade = _calculationService.getHighestCourseGrade(updatedSchemes as GradingScheme[]);
        dispatch(
            updateCourse({
                term: termData!.term,
                courseIndex: courseIndex!,
                course: {
                    ...courseData as Course,
                    highestGrade: newHighestGrade ||  0,
                    gradingSchemes: updatedSchemes,
                },
            })
        );
        return true;
    }

    // createScheme(name) creates a new grading scheme
    function createScheme(name: string): boolean {
        const { isValid, error } = _formValidationService.validateNewScheme(courseData!, name)
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 2000
            });
            return false;
        }

        const newScheme = { schemeName: name, grade: 0, assessments: []};
        dispatch( updateCourse({
            term: termData!.term,
            courseIndex: courseIndex!,
            course: {
                ...courseData as Course,
                gradingSchemes: [...courseData!.gradingSchemes, newScheme],
            },
        }));
        return true;
    }

    return { createNewTerm, createCompletedCourse, createCourse, formatNewGradingScheme, createDeliverable, createScheme };
}
 
export default FormSubmitService;



// This service validates the data in the forms to ensure they are okay to submit

export class FormValidationService {

    // validateNewTerm(data, termName, selectedYear)
    //  * termName must be one of (Fall, Spring, Winter)
    //  * termName must not exist already
    validateNewTerm(data: Term[], termName: string, selectedYear: number): boolean {
        // validate termName
        const validTermNames = ["Fall", "Spring", "Winter"];
        if (!validTermNames.includes(termName)) {
            return false;
        }
        // check if term exists already
        const assembledName = termName + ' ' + selectedYear.toString()
        const isTermRepeated = data.find((t) => t.term.toLowerCase() === assembledName.toLowerCase())
        if (isTermRepeated) {
            return false;
        }

        return true;
    }

    // validateNewCompletedCourse(termData, code, number, grade)
    //  * name, code, and grade must not be null
    //  * must not be any duplicates
    validateNewCompletedCourse(termData: Term, code: string, number: string, grade: number | null): { isValid: boolean, error: string } {
        if (!code || code.trim() === "") {
            return { isValid: false, error: "Course code is required" };
        }
        if (!number || number.trim() === "") {
            return { isValid: false, error: "Course number is required" };
        }
        if (!grade && grade != 0) {
            return { isValid: false, error: "Course grade is required" };
        }
        const assembledName = code + ' ' + number
        const isDuplicate = termData?.courses.find((c) => c.courseTitle.toLowerCase() === assembledName.toLowerCase())
        if (isDuplicate) {
            return { isValid: false, error: "A course with this name has already been created" };
        }

        return { isValid: true, error: "" };
    }

    // validateNewCourse(code, number, subtitle)
    //  * code, number, and subtitle must have a value
    validateNewCourse(code: string, number: string, subtitle: string): { isValid: boolean, error: string } {
        if (!code || code.trim() === "") {
            return { isValid: false, error: "Course code is required"};
        }
        if (!number || number.trim() === "") {
            return { isValid: false, error: "Course number is required"};
        }
        if (!subtitle || subtitle.trim() === "") {
            return { isValid: false, error: "Course name is required"};
        }

        return { isValid: true, error: "" };
    }

    // validateNewAssessment(name, weight, grade, scheme)
    //  * name must not be null or repeated
    vaildateNewAssessment(name: string, courseData: Course | undefined, schemeName: string): { isValid: boolean, error: string } {
        if (!name || name.trim() == "") {
            return { isValid: false, error: "Name is required" };
        }
        const repeatedName = courseData?.gradingSchemes.find((scheme) =>
            scheme.assessments.some((assessment) => (assessment.assessmentName === name && scheme.schemeName === schemeName))
        );
        if (repeatedName) {
            return { isValid: false, error: "A deliverable with this name already exists" }
        }

        return { isValid: true, error: "" }
    }

    // validateNewScheme(name)
    //  * name must not be null or repeated
    validateNewScheme(courseData: Course, name: string): { isValid: boolean, error: string} {
        if (name.trim() === '' || name.length === 0) {
            return { isValid: false, error: "Name is required"}
        }
        const repeatedName = courseData?.gradingSchemes.find((s) => s.schemeName === name);
        if (repeatedName) {
            return { isValid: false, error: "A scheme with this name already exists" }
        }

        return { isValid: true, error: ""}
    }
}

