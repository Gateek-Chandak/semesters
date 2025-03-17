import { Assessment, GradingScheme } from "@/types/mainTypes"
import { useEffect, useState } from "react"
import useData from "../generalHooks/use-data"
import { toast } from "../generalHooks/use-toast";
import { CalculationService } from "@/services/calculationService";
import TermDataService from "@/services/termDataService";
const _calculationService = new CalculationService();

const useLocalScheme = (scheme: GradingScheme, schemeIndex: number) => {
    const { updateGradingScheme } = TermDataService();
    const { courseData, courseIndex } = useData();

    const [localScheme, setLocalScheme] = useState<GradingScheme>(scheme)
    const [cannotSave, setCannotSave] = useState<{ value: boolean, reason: string }>({ value: false, reason: ""})

    useEffect(() => {
        // Catch empty schemes
        if (localScheme.schemeName == "") {
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
        const duplicateSchemeName = courseData?.gradingSchemes.find((scheme: GradingScheme, index) => scheme.schemeName == localScheme.schemeName && index != schemeIndex)
        if (duplicateSchemeName) {
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
        const duplicateAssessmentName = localScheme.assessments.some((assessment: Assessment) => {
            if (assessmentsSeen.has(assessment.assessmentName)) {
                return true;
            }
            assessmentsSeen.add(assessment.assessmentName)                
        })
        if (duplicateAssessmentName) {
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
        const emptyAssessmentName = localScheme.assessments.some((assessment: Assessment) => {
            if (assessment.assessmentName == "") {
                return true;
            }             
        })
        if (emptyAssessmentName) {
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

    const saveSchemeChanges = () => {
        if (scheme == localScheme) {
            return;
        }
        if (!cannotSave.value) {
            // update the grading scheme grade
            const updatedSchemeGrade = _calculationService.updateGradingSchemeGrade(localScheme.assessments)
            updateGradingScheme(schemeIndex, courseIndex!, {...localScheme, grade: updatedSchemeGrade})
            toast({
                variant: "success",
                title: "Update Successful",
                description: localScheme.schemeName + " was updated successfully",
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

    const discardSchemeChanges = () => {
        if (localScheme == scheme) {
            return;
        }
        toast({
            variant: "success",
            title: "Discard Successful",
            description: "Changes to " + localScheme.schemeName + " were discarded",
            duration: 1000
        })
    }


    const setSchemeName = (name: string) => {
        setLocalScheme((prev: GradingScheme) => ({ ...prev, schemeName: name }))
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
    const handleAssessmentDelete = (assessmentName: string) => {
        setLocalScheme((prev: GradingScheme) => {
            const updatedAssessments = prev.assessments.filter((a: Assessment) => a.assessmentName != assessmentName)
            return { ...prev, assessments: updatedAssessments}
        })
    }

    return { setLocalScheme, setCannotSave, localScheme, cannotSave,
        setSchemeName, syncChanges, setAssessmentDate, handleAssessmentDelete, saveSchemeChanges, discardSchemeChanges }
}
 
export default useLocalScheme;