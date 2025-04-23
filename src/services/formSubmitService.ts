// This service handles all form submit logic for term data and incoming data related to forms

// Hooks
import { useToast } from "@/hooks/general/use-toast";
import useData from "@/hooks/general/use-data";
// Redux
import { useDispatch } from "react-redux";
import { addTerm, addCourse, updateCourse } from "@/redux/slices/dataSlice";
// Types
import { Assessment, Course, GradingScheme, IncomingCourseInfo, Term } from "@/types/mainTypes";
import { AxiosError } from "axios";
// Services
import { APIService } from "./apiService";
import { CalculationService } from "./calculationService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const _apiService = new APIService();
const _calculationService = new CalculationService();

const FormSubmitService = () => {
    // redux inits
    const { data } = useData();
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    // hooks
    const { toast } = useToast();
    const { courseData, termData } = useData();
    // services
    const _formValidationService = new FormValidationService();

    // createNewTerm(termName, selectedYear, is_completed) creates a new term and dispatches the action
    async function createTerm(termName: string, selectedYear: number, is_completed: boolean): Promise<boolean> {
        const isTermValid = _formValidationService.validateNewTerm(data, termName, selectedYear);
        const assembledName = termName + ' ' + selectedYear.toString();
    
        if (isTermValid) {
            try {
                toast({
                    variant: "default",
                    title: "Creating...",
                    description: '',
                    duration: 3000
                });
                const newTerm: Term = await _apiService.createTerm(user!.id, assembledName, is_completed, selectedYear);
                dispatch(addTerm({ newTerm: { ...newTerm } }));
                toast({
                    variant: "success",
                    title: "Create Successful",
                    description: `${assembledName} has been successfully created!`,
                    duration: 3000
                });
                return true;
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Create Unsuccessful",
                    description: `${assembledName} could not be created`,
                    duration: 3000
                });
                return false;
            }
        } else {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: `${assembledName} could not be created`,
                duration: 3000
            });
            return false;
        }
    }

    // createCompletedCourse(termData, courseCode, courseNumber, courseSubtitle)
    async function createCourse(termData: any, courseCode: string, courseNumber: string, courseSubtitle: string, colour: string, file: File | null) {
        const { isValid, error } = _formValidationService.validateNewCourse(termData, courseCode, courseNumber, courseSubtitle, colour);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 3000
            });
            return false;
        }

        if (!file) {
            try {
                toast({
                    variant: "default",
                    title: "Creating...",
                    description: '',
                    duration: 3000
                });
                const createdCourse: Course = await _apiService.createCourse(termData.id, courseCode + ' ' + courseNumber, courseSubtitle, colour, 0, false);
                dispatch(addCourse({ term_id: createdCourse.term_id, newCourse: createdCourse }));
                toast({
                    variant: "success",
                    title: "Create Successful",
                    description: `${createdCourse.course_title} has been successfully created!`,
                    duration: 3000
                });
                return true;
            } catch (error: any) {
                console.log(error)
                toast({
                    variant: "destructive",
                    title: "Create Unsuccessful",
                    description: error.error,
                    duration: 3000
                });
                return false;
            }
        } else {
            const formData = new FormData()
            formData.append("pdf", file);
            try {
                toast({
                    variant: "default",
                    title: "Creating...",
                    description: '',
                    duration: 3000
                });
                const response = await _apiService.uploadSchedule(formData);
                const gradingSchemes = formatNewGradingScheme(response);
                const createdCourse = await _apiService.createCourse(termData.id, courseCode + ' ' + courseNumber, courseSubtitle, colour, 0, false);
                dispatch(addCourse({ term_id: createdCourse.term_id, newCourse: {...createdCourse, grading_schemes: gradingSchemes} }));
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
    }

    // createCompletedCourse(termData, courseCode, courseNumber, grade) creates a new completed course
    async function createCompletedCourse(termData: any, courseCode: string, courseNumber: string, grade: number | null) {
        const { isValid, error } = _formValidationService.validateNewCompletedCourse(termData, courseCode, courseNumber, grade);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 3000
            });
            return false;
        }

        try {
            toast({
                variant: "default",
                title: "Creating...",
                description: '',
                duration: 3000
            });
            const createdCourse: Course = await _apiService.createCourse(termData.id, courseCode + ' ' + courseNumber, "", "black", grade || 0, true);
            dispatch(addCourse({ term_id: createdCourse.term_id, newCourse: createdCourse }));
            toast({
                variant: "success",
                title: "Create Successful",
                description: `${createdCourse.course_title} has been successfully created!`,
                duration: 3000
            });
            return true;
        } catch (error: any) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error.error,
                duration: 3000
            });
            return false;
        }
    }

    // createScheme(name) creates a new grading scheme
    async function createScheme(schemeName: string) {
        const { isValid, error } = _formValidationService.validateNewScheme(courseData!, schemeName)
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 3000
            });
            return false;
        }

        try {
            toast({
                variant: "default",
                title: "Creating...",
                description: '',
                duration: 3000
            });
            const newScheme: GradingScheme = await _apiService.createGradingScheme(user!.id, courseData!.id, schemeName)
            dispatch(updateCourse({
                term_id: termData!.id,
                course_id: courseData!.id,
                updatedCourse: {
                    ...courseData as Course,
                    grading_schemes: [...courseData!.grading_schemes, newScheme],
                },
            }));
            toast({
                variant: "success",
                title: "Create Successful",
                description: `${newScheme.scheme_name} has been successfully created!`,
                duration: 3000
            });
            return true;
        } catch (error: any) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error.error,
                duration: 3000
            });
            return false;
        }
    }

    // createDeliverable(scheme_id, name, weight, grade, date, schemeName) creates a new deliverable
    async function createAssessment(scheme_id: number, name: string, weight: number, grade: number | null, date: string | null, schemeName: string) {
        const { isValid, error } = _formValidationService.vaildateNewAssessment(name, courseData, schemeName);
        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error,
                duration: 3000
            });
            return false;
        }

        try {
            toast({
                variant: "default",
                title: "Creating...",
                description: '',
                duration: 3000
            });
            // Create assessment
            const newAssessment: Assessment = await _apiService.createAssessment(user!.id, scheme_id, name, date, weight, grade)
            // Add new assessment to schemes
            let updatedSchemes: GradingScheme[] = courseData!.grading_schemes.map((scheme) => {
                if (scheme.id === scheme_id) {
                    return { ...scheme, assessments: [...scheme.assessments, newAssessment]};
                }
                return scheme;
            });
            // Get schemes with updated grades
            updatedSchemes = _calculationService.updateSchemeGrades(updatedSchemes, newAssessment.grade, newAssessment.id)    
            // Update grading schemes with new updatedSchemes
            for(let i = 0; i < updatedSchemes.length; i++) {
                await _apiService.updateGradingScheme(user!.id, updatedSchemes[i]);
            }
            // Get highest grade between schemes
            const newHighestGrade = _calculationService.getHighestCourseGrade(updatedSchemes as GradingScheme[]);
            // Update course in database with new highest grade
            const updatedCourse: Course = await _apiService.updateCourse(user!.id, { ...courseData!, highest_grade: newHighestGrade })
            dispatch(updateCourse({
                term_id: termData!.id,
                course_id: courseData!.id,
                updatedCourse: {...updatedCourse, highest_grade: newHighestGrade, grading_schemes: updatedSchemes},
            }));
            toast({
                variant: "success",
                title: "Create Successful",
                description: `${newAssessment.assessment_name} has been successfully created!`,
                duration: 3000
            });
            return true;
        } catch (error: any) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Create Unsuccessful",
                description: error.error,
                duration: 3000
            });
            return false;
        }
    }

    function createStudyLog(date: string | null, lowerLimit: string, upperLimit: string) {
        if (!date) {
            toast({
                variant: "destructive",
                title: "No Date Selected",
                description: "Please select a date.",
                duration: 3000
            });
            return false;
        }
        toast({
            variant: "default",
            title: "Creating...",
            description: '',
            duration: 3000
        });
        const dateToAdd = new Date(date);
        const lower = new Date(lowerLimit);
        const upper = new Date(upperLimit);
        console.log(dateToAdd, lower)
        if (dateToAdd < lower || dateToAdd > upper) {
            toast({
                variant: "destructive",
                title: "Date Out Of Range",
                description: "The date selected is out of range for this term.",
                duration: 3000
            });
            return false;
        }

        return true;
    }

    return { createTerm, createCompletedCourse, createCourse, createAssessment, createScheme, createStudyLog };
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
        const isTermRepeated = data.find((t) => t.term_name.toLowerCase() === assembledName.toLowerCase())
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
        const isDuplicate = termData?.courses.find((c) => c.course_title.toLowerCase() === assembledName.toLowerCase())
        if (isDuplicate) {
            return { isValid: false, error: "A course with this name has already been created" };
        }

        return { isValid: true, error: "" };
    }

    // validateNewCourse(code, number, subtitle)
    //  * code, number, and subtitle must have a value
    validateNewCourse(termData: Term, code: string, number: string, subtitle: string, colour: string): { isValid: boolean, error: string } {
        if (!code || code.trim() === "") {
            return { isValid: false, error: "Course code is required"};
        }
        if (!number || number.trim() === "") {
            return { isValid: false, error: "Course number is required"};
        }
        if (!subtitle || subtitle.trim() === "") {
            console.log(subtitle)
            return { isValid: false, error: "Course name is required"};
        }
        const assembledName = code + ' ' + number
        const isDuplicate = termData?.courses.find((c) => c.course_title.toLowerCase() === assembledName.toLowerCase())
        if (isDuplicate) {
            return { isValid: false, error: "A course with this name has already been created" };
        }

        const duplicateColour = termData?.courses.find((c) => c.colour == colour);
        if (duplicateColour) {
            return { isValid: false, error: "A course with this colour already exists" };
        }
        return { isValid: true, error: "" };
    }

    // validateNewAssessment(name, weight, grade, scheme)
    //  * name must not be null or repeated
    vaildateNewAssessment(name: string, courseData: Course | undefined, schemeName: string): { isValid: boolean, error: string } {
        if (!name || name.trim() == "") {
            return { isValid: false, error: "Name is required" };
        }
        const repeatedName = courseData?.grading_schemes.find((scheme) =>
            scheme.assessments.some((assessment) => (assessment.assessment_name === name && scheme.scheme_name === schemeName))
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
        const repeatedName = courseData?.grading_schemes.find((s) => s.scheme_name === name);
        if (repeatedName) {
            return { isValid: false, error: "A scheme with this name already exists" }
        }

        return { isValid: true, error: ""}
    }
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