// UI
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
// Other
import { ChangeEvent, useState } from "react";
// Custom Components
import ColourPicker from "./ColourPicker";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import FormSubmitService from "@/services/formSubmitService";
// Hooks
import useData from "@/hooks/general/use-data";
import { useToast } from "@/hooks/general/use-toast";

const _inputFieldValidationService = new InputFieldValidationService();

interface CreateCoursePopupProps {
    isCreatingCourse: boolean;
    setIsCreatingCourse: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCoursePopup: React.FC<CreateCoursePopupProps> = ({ isCreatingCourse, setIsCreatingCourse }) => {
    // Services
    const { createCourse } = FormSubmitService();
    // Hooks
    const { termData } = useData();
    const { toast } = useToast();
    // States
    //  values
    const [courseCode, setCourseCode] = useState<string>("");
    const [courseNumber, setCourseNumber] = useState<string>("");
    const [courseSubtitle, setCourseSubtitle] = useState<string>("");
    const [selectedColour, setSelectedColour] = useState<"green" | "black" | "blue" | "pink" | "purple" | "orange" | "red">("black")
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    // conditionals
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // handle reset values on close
    const handleClose = () => {
        setIsUploading(false)
        setIsCreatingCourse(false)
        setCourseSubtitle("")
        setCourseCode("")
        setCourseNumber("")
        setSelectedColour("black")
        setUploadedFile(null);
    }

    // Manage Input Contraints
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "courseCode":
                setCourseCode(_inputFieldValidationService.inputCourseCode(value));
                return;
            case "courseNumber":
                setCourseNumber(_inputFieldValidationService.inputCourseNumber(value));
                return;
            case "courseSubtitle":
                setCourseSubtitle(_inputFieldValidationService.inputCourseSubtitle(value))
                return;
            default:
                return false
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const MAX_FILE_SIZE = 1 * 1024 * 1024;
        let file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast({
                    variant: "destructive",
                    title: "File Too Large",
                    description: "Your file must be smaller than 1MB",
                    duration: 2000
                });
                event.target.value = ""
                return;
            }

            toast({
                variant: "success",
                title: "File Upload Successful",
                description: "Your syllabus is ready to be uploaded",
                duration: 1000
            });
            setUploadedFile(file);
        }
    };

    // Create a new course
    const handleCreateCourse = async (): Promise<void> => {
        setIsUploading(true)
        const shouldCreateCourse = await createCourse(termData!, courseCode, courseNumber, courseSubtitle,selectedColour, uploadedFile);

        if (shouldCreateCourse) {
            handleClose();
            setIsCreatingCourse(false);
        }
        setIsUploading(false)
    };
    

    return (
        <Dialog open={isCreatingCourse || isUploading} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    {!isUploading && <DialogTitle>Add Course</DialogTitle>}
                    {!isUploading && <DialogDescription>Add a new course by entering its name and uploading the syllabus. Although the upload is optional, we'll use this information to st up your calendar and grading system</DialogDescription>}
                </DialogHeader>
                {!isUploading &&
                    <div className="flex flex-col gap-6 text-sm">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-medium">Course Code *</h1>
                            <Input placeholder="CFM" name="courseCode" value={courseCode} onChange={validateFields}></Input>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-medium">Course Number *</h1>
                            <Input placeholder="101" name="courseNumber" value={courseNumber} onChange={validateFields}></Input>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-medium">Course Name *</h1>
                            <Input placeholder="Financial Markets and Data Analytics" name="courseSubtitle" value={courseSubtitle} onChange={validateFields}></Input>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-medium">Course Colour *</h1>
                            <ColourPicker selectedColour={selectedColour} setSelectedColour={setSelectedColour} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-medium">Syllabus Upload</h1>
                            <Input
                                type="file" // Accept only PDF files
                                accept=".pdf"
                                onChange={handleFileChange} // Handle file change
                                className="hover:border-gray-200 hover:bg-gray-50 border-gray-100"
                            />
                            <p>Currently working on improving syllabus upload!</p>
                        </div>
                    </div>}
                {isUploading &&
                    <div className="py-10">
                        <h1 className="text-center text-xl">Creating Your Class</h1>
                        <div className="flex flex-col justify-center items-center gap-4">
                            <p>This may take a few seconds...</p>
                            <p className="text-center">You may close this popup while you wait, your new course will appear shortly.</p>
                        </div>
                    </div>}
                {!isUploading && 
                <DialogFooter>
                    <Button onClick={handleCreateCourse}>Add Course</Button>
                </DialogFooter>}
            </DialogContent>
        </Dialog>

    );
}

export default CreateCoursePopup;