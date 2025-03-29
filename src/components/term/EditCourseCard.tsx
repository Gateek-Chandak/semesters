// UI
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
// Types
import { Course } from "@/types/mainTypes";
// Custom Components
import ConfirmDeletePopup from "@/components/shared/ConfirmDeletePopup";
// Hooks
import { ChangeEvent, useState } from "react";
import useData from "@/hooks/general/use-data";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import DeleteDataService from "@/services/deleteDataService";

const _inputFieldValidationService = new InputFieldValidationService();

interface EditCourseCardProps {
  course: Course;
  isCompleted: boolean;
  courseIndex: number
  syncChanges: (courseIndex: number, updatedCourse: Course) => void;
}

const EditCourseCard: React.FC<EditCourseCardProps> = ({ course, courseIndex, isCompleted, syncChanges }) => {
    // Service
    const { handleDeleteCourse } = DeleteDataService();
    // Hooks
    const { termData } = useData();
    // States
    //  values
    const [localCourse, setLocalCourse] = useState<Course>(course)
    //  conditionals
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    // Validates Input Fields
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let updatedLocalCourse = {...localCourse};
        switch (name) {
            case "courseGrade":
                const validatedValue = _inputFieldValidationService.inputNumber(value)
                if (validatedValue === undefined) {
                    return;
                }
                updatedLocalCourse.highest_grade = validatedValue || 0;
                break;
            case "courseCode":
                updatedLocalCourse.course_title = _inputFieldValidationService.inputCourseCode(value) + " " + updatedLocalCourse.course_title.split(' ')[1]
                setLocalCourse(updatedLocalCourse);
                return;
            case "courseSubtitle":
                updatedLocalCourse.course_subtitle = _inputFieldValidationService.inputCourseSubtitle(value)
                setLocalCourse(updatedLocalCourse)
                return;
            case "courseNumber":
                updatedLocalCourse.course_title = updatedLocalCourse.course_title.split(' ')[0] + " " + _inputFieldValidationService.inputCourseNumber(value);
                setLocalCourse(updatedLocalCourse);
                return;
            default:
                return false
        }

        setLocalCourse(updatedLocalCourse)
        syncChanges(courseIndex, updatedLocalCourse)
    }

    const triggerDeleteCourse = async () => {
        if (termData && courseIndex !== -1) {
            const shouldDeleteCourse = await handleDeleteCourse(termData.id, course.id);
            if (shouldDeleteCourse) {
                setIsDeleting(false);
            }
        }
    };

    return (
        <Card className="h-40 w-40 bg-card rounded-2xl "> 
            <div className="h-40 w-40 flex flex-col justify-between gap-2 items-center p-4">
                <div className={`flex flex-row justify-between gap-2 w-full`}>
                    <Input className="!text-sm" value={localCourse.course_title.split(' ')[0]} onChange={validateFields} name="courseCode" onBlur={() => syncChanges(courseIndex, localCourse)}/>
                    <Input className="!text-sm" value={localCourse.course_title.split(' ')[1]} onChange={validateFields} name="courseNumber" onBlur={() => syncChanges(courseIndex, localCourse)}/>
                </div>
                {isCompleted && 
                    <Input className="text-lg" type="number" name="courseGrade" 
                        value={localCourse.highest_grade || 0}
                        onChange={validateFields}/>}
                {!isCompleted &&
                    <Input className="!text-sm" value={localCourse.course_subtitle} onChange={validateFields} name="courseSubtitle" onBlur={() => syncChanges(courseIndex, localCourse)}/>}
                <Button variant="outline" className="h-8 w-full mt-1 border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" 
                        onClick={() => setIsDeleting(!isDeleting)} disabled={(localCourse.course_title.split(' ')[0].trim() == "" && localCourse.course_title.split(' ')[1].trim() == "") || (localCourse.course_subtitle.trim() == "" && !isCompleted)}>
                    <Trash2Icon className="" />
                </Button>
            </div>
            <ConfirmDeletePopup name={course.course_title}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                                deleteItem={triggerDeleteCourse}/>
        </Card>
    );
};

export default EditCourseCard;
