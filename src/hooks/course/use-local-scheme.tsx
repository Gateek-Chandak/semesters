// Types
import { Assessment, GradingScheme } from "@/types/mainTypes"
// Hooks
import { useEffect, useState } from "react"
import useData from "../general/use-data"
import { useToast } from "../general/use-toast";

const useLocalScheme = (scheme: GradingScheme, schemeIndex: number) => {
    const { courseData } = useData();
    const { toast } = useToast();

    const [localScheme, setLocalScheme] = useState<GradingScheme>(scheme)
    const [cannotSave, setCannotSave] = useState<{ value: boolean, reason: string }>({ value: false, reason: ""})

    useEffect(() => {
        // Catch empty schemes
        if (localScheme.scheme_name == "") {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "Grading scheme name cannot be empty",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "Grading scheme name cannot be empty"});
            return;
        }
        // Catch schemes with the same name
        const duplicatescheme_name = courseData?.grading_schemes.find((scheme: GradingScheme, index: number) => scheme.scheme_name == localScheme.scheme_name && index != schemeIndex)
        if (duplicatescheme_name) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "This grading scheme name already exists",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "This grading scheme name already exists"});
            return;
        } 

        // Catch assessments with the same name
        const assessmentsSeen = new Set();
        const duplicateassessment_name = localScheme.assessments.some((assessment: Assessment) => {
            if (assessmentsSeen.has(assessment.assessment_name)) {
                return true;
            }
            assessmentsSeen.add(assessment.assessment_name)                
        })
        if (duplicateassessment_name) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "This assessment name already exists",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "This assessment name already exists"});
            return;
        } 

        // Catch empty assessment names
        const emptyassessment_name = localScheme.assessments.some((assessment: Assessment) => {
            if (assessment.assessment_name == "") {
                return true;
            }             
        })
        if (emptyassessment_name) {
            toast({
                variant: "destructive",
                title: "Warning",
                description: "Assessment name cannot be empty",
                duration: 2000
            })
            setCannotSave({ value: true, reason: "Assessment name cannot be empty"});
            return;
        }
        setCannotSave( { value: false, reason: "" }); 
    }, [localScheme])

    const discardSchemeChanges = () => {
        if (localScheme == scheme) {
            return;
        }
        toast({
            variant: "success",
            title: "Discard Successful",
            description: "Changes to " + localScheme.scheme_name + " were discarded",
            duration: 1000
        })
    }

    const setSchemeName = (name: string) => {
        setLocalScheme((prev: GradingScheme) => ({ ...prev, scheme_name: name }))
    }

    const syncChanges = (assessmentIndex: number, localAssessment: Assessment) => {
        setLocalScheme((prevScheme) => {
            const updatedAssessments = [...prevScheme.assessments];
            updatedAssessments[assessmentIndex] = localAssessment;
            return { ...prevScheme, assessments: updatedAssessments };
        });
    }

    // Handles when the user changes a date
    const setAssessmentDate = (assessmentIndex: number, updatedAssessment: Assessment) => {
        setLocalScheme((prevScheme) => {
            const updatedAssessments = [...prevScheme.assessments];
            updatedAssessments[assessmentIndex] = updatedAssessment;
            return { ...prevScheme, assessments: updatedAssessments };
        });
    }

    // Handles deleting an assessment
    const handleAssessmentDelete = (assessment_id: number) => {
        setLocalScheme((prev: GradingScheme) => {
            const updatedAssessments = prev.assessments.filter((a: Assessment) => a.id != assessment_id)
            return { ...prev, assessments: updatedAssessments}
        })
    }

    return { setLocalScheme, setCannotSave, localScheme, cannotSave,
        setSchemeName, syncChanges, setAssessmentDate, handleAssessmentDelete, discardSchemeChanges }
}
 
export default useLocalScheme;