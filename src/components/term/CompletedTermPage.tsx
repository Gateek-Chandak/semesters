// UI
import { Button } from "../ui/button";
import { Check, EyeIcon, EyeOffIcon, PencilIcon } from "lucide-react";
// Custom Components
import { CircularProgress } from "./CircularProgessBar";
import DisplayCourseCard from "./DisplayCourseCard";
import EditCourseCard from "./EditCourseCard";
import CreateCompletedCoursePopup from "./CreateCompletedCoursePopup";
// Hooks
import useData from "@/hooks/general/use-data";
import { useState } from "react";
import useLocalCourseList from "@/hooks/term/use-local-course-list";
import useUser from "@/hooks/general/use-user";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

const CompletedTermPage = () => {
    // Hooks
    const { termData } = useData();
    const { user } = useUser();
    const { localTermCourses, saveTermCoursesChanges, syncChanges, cannotSave } = useLocalCourseList();
    // States
    //  conditionals
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false)
    const [isManagingCourses, setIsManagingCourses] = useState<boolean>(false)
    const [isGradesShowing, setIsGradesShowing] = useState<boolean>(false)

    const handleSaveChanges = async () => {
        saveTermCoursesChanges();
        if (!cannotSave.value) {
            setIsManagingCourses(false)
            if (localTermCourses != termData?.courses) {
                await Promise.all(localTermCourses.map(course => _apiService.updateCourse(user!.id, course)));
            }
        }
    }

    // const handleDiscardChanges = () => {
    //     setIsManagingCourses(false)
    //     discardTermCoursesChanges();
    // }

    return ( 
        <div className="min-h-dvh h-fit max-w-[1840px] w-full flex flex-col gap-6 overflow-auto">
            <div className="w-full flex flex-row items-center justify-center md:justify-start gap-4">
                <h1 className="text-3xl font-bold">{termData!.term_name}</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-start gap-6">
                {/* Overall Average */}
                <div className="custom-card flex items-center justify-center h-[22rem] px-6">
                    <CircularProgress />
                </div>
                {/* Course List */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center items-center md:items-start md:justify-start">
                    <div className="w-full items-center md:w-40 md:h-40 text-xs text-muted-foreground md:hidden flex flex-col justify-between gap-6">
                        <p className="text-sm md:text-xs">This term is complete. You may view your grades.</p>
                        <div className="flex flex-row justify-center items-center gap-4 md:flex-col">
                        {!isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs w-[100%]' onClick={() => setIsManagingCourses(true)}>Manage Courses <PencilIcon/></Button>}
                                {/* {isManagingCourses && <Button variant={"outline"} className='text-red-500 border-2 border-red-500 hover:text-red-500 !text-xs w-[100%]' onClick={handleDiscardChanges}>Discard Changes <Check/></Button>} */}
                                {isManagingCourses && <Button variant={"outline"} className='border-black text-black border-2 !text-xs w-[100%]' onClick={handleSaveChanges}>Confirm Changes <Check/></Button>}
                                {!isManagingCourses && !isGradesShowing && <Button className='!text-xs lg:!w-40 w-[100%]' onClick={() => setIsGradesShowing(true)}>Show Grades <EyeIcon /></Button>}
                                {!isManagingCourses && isGradesShowing && <Button className='!text-xs lg:!w-40 w-[100%]' onClick={() => setIsGradesShowing(false)}>Hide Grades <EyeOffIcon /></Button>}
                        </div>
                    </div>
                       
                    <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-6 h-fit">
                        <div className="hidden w-full items-center md:w-40 md:h-40 text-xs text-muted-foreground md:flex flex-col justify-between gap-6">
                            <p className="text-sm md:text-xs">This term is complete. You may view your grades.</p>
                            <div className="flex flex-row justify-center items-center gap-4 md:flex-col">
                                {!isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs w-[100%]' onClick={() => setIsManagingCourses(true)}>Manage Courses <PencilIcon/></Button>}
                                {/* {isManagingCourses && <Button variant={"outline"} className='text-red-500 border-2 border-red-500 hover:text-red-500 !text-xs w-[100%]' onClick={handleDiscardChanges}>Discard Changes <Check/></Button>} */}
                                {isManagingCourses && <Button variant={"outline"} className='border-black text-black border-2 !text-xs w-[100%]' onClick={handleSaveChanges}>Confirm Changes <Check/></Button>}
                                {!isManagingCourses && !isGradesShowing && <Button className='!text-xs lg:!w-40 w-[100%]' onClick={() => setIsGradesShowing(true)}>Show Grades <EyeIcon /></Button>}
                                {!isManagingCourses && isGradesShowing && <Button className='!text-xs lg:!w-40 w-[100%]' onClick={() => setIsGradesShowing(false)}>Hide Grades <EyeOffIcon /></Button>}
                            </div>
                        </div>
                        {!isManagingCourses && localTermCourses && localTermCourses.map((course) => { return ( <DisplayCourseCard key={course.course_title} course={course} gradesShown={isGradesShowing} isCompleted={true}/> ); })}
                        {isManagingCourses && localTermCourses && localTermCourses.map((course, index) => { return ( <EditCourseCard key={course.course_title} course={course} courseIndex={index} syncChanges={syncChanges} isCompleted={true} /> ); })}
                        <div onClick={() => setIsCreatingCourse(true)} 
                            className="h-40 w-40 flex flex-col justify-center items-center custom-card hover:border-slate-300 transform md:transition-all duration-200 hover:scale-[1.04]"
                            role="button" 
                            tabIndex={0}>
                            <h1 className="text-7xl font-extralight">+</h1>
                        </div>      
                    </div>

                </div>
            </div>   
            {/* Popup when creating a completed course */}
            <CreateCompletedCoursePopup isCreatingCourse={isCreatingCourse} setIsCreatingCourse={setIsCreatingCourse}/>     
        </div>
     );
}
 
export default CompletedTermPage;