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
// Hooks
import { useToast } from "@/hooks/general/use-toast";
import { useState } from "react";
import useUser from "@/hooks/general/use-user";
import useData from "@/hooks/general/use-data";
// Redux
import { useDispatch } from "react-redux";
import { addCourse, addTerm } from "@/redux/slices/dataSlice";
// Types
import { Term } from "@/types/mainTypes";
// Services
import { APIService } from "@/services/apiService";
import { AxiosError } from "axios";

interface UploadTranscriptPopupProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadTranscriptPopup: React.FC<UploadTranscriptPopupProps> = ({ isActive, setIsActive }) => {

    // Services
    const _apiService = new APIService();    
    // Inits
    const { data } = useData();
    const { toast } = useToast();
    const dispatch = useDispatch()
    const { user } = useUser();
    // States
    //  conditionals
    const [isUploading, setIsUploading] = useState<boolean>(false);
    //  values
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // Handles the file change in the frontend
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const MAX_FILE_SIZE = 0.2 * 1024 * 1024;

        let file = null;
        if (event.target.files) {
            file = event.target.files[0];
        } else {
            file = null;
        }

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast({
                    variant: "destructive",
                    title: "File Too Large",
                    description: "Your file must be smaller than 200KB",
                    duration: 3000
                });
                event.target.value = ""
                return;
            }

            toast({
                variant: "success",
                title: "File Upload Successful",
                description: "Your syllabus is ready to be uploaded",
                duration: 3000
            });
            setUploadedFile(file);
        }
    };

    const createCourse = async (course: any, term_id: number) => {
        const createdCourse = await _apiService.createCourse(term_id, course.course_title, course.course_subtitle, course.colour, course.highest_grade, course.is_completed);
        dispatch(addCourse({term_id: term_id, newCourse: createdCourse}));
    }

    const createTerm = async (term: any) => {
        const duplicateTerm = data.find((t: Term) => t.term_name == term.term_name)
        if (duplicateTerm) {
            return;
        }
        const createdTerm = await _apiService.createTerm(user!.id, term.term_name, term.is_completed);
        dispatch(addTerm({newTerm: createdTerm}))
        for (let i = 0; i < term.courses.length; i++) {
            await createCourse(term.courses[i], createdTerm.id)
        }
    }

    // Upload a transcript to the API
    const uploadTranscript = async () => {
        if (uploadedFile) {
            setIsActive(false)
            setIsUploading(true)
            const formData = new FormData();
            formData.append("pdf", uploadedFile);

            // API request
            try {
                toast({
                    variant: "default",
                    title: "Processing Transcript...",
                    description: '',
                    duration: 3000
                });
                const response = await _apiService.uploadTranscript(formData);
                for (let i = 0; i < response.length; i++) {
                    await createTerm(response[i]);
                }
                setIsUploading(false)
                setIsActive(false)
                setUploadedFile(null)
                toast({
                    variant: "success",
                    title: "Transcript Processed...",
                    description: '',
                    duration: 3000
                });
            } catch (error: unknown) {
                setIsUploading(false);
                setIsActive(true);
                if (error instanceof AxiosError) {
                    const errorMsg = error.response?.data?.error;
                    toast({
                        variant: "destructive",
                        title: "Transcript Upload Unsuccessful",
                        description: errorMsg === "no transcript found"
                        ? "Your file is not a transcript."
                        : "There was an error uploading your file. Please try again.",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Unknown Error",
                        description: "An unknown error occurred.",
                    });
                }
            }
        }
    }

    return (
        <Dialog open={isActive || isUploading} onOpenChange={setIsActive}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Transcript</DialogTitle>
                    <DialogDescription>
                        By uploading your transcript, you'll be able to view all your terms, courses, and respective grades.
                        <br />
                        <span className="text-red-600">transcript parsing is optimized for percentage grades, and may not work accurately for letter grades.</span>
                    </DialogDescription>
                </DialogHeader>
                {isActive && !isUploading &&
                    <div className="flex flex-col gap-4">
                        <h1 className="font-medium">File</h1>
                        <Input
                            type="file" // Accept only PDF files
                            accept=".pdf"
                            onChange={handleFileChange} // Handle file change
                            className="hover:border-gray-200 hover:bg-gray-50 border-gray-100" />
                        {/* <p>Currently working on improving this feature!</p> */}
                    </div>}
                {isUploading && !isActive && <p className="text-center w-full mb-4">Parsing...</p>}
                {isActive && 
                    <DialogFooter>
                        <Button onClick={() => uploadTranscript()}>Upload</Button>
                    </DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

export default UploadTranscriptPopup;