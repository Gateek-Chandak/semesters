// UI
import { CheckIcon, EyeIcon, EyeOffIcon, PencilIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
// Custom Components
import MetricCard from "../sharedHooks/MetricCard";
import { CircularProgress } from "./CircularProgessBar";
import EventsInProximity from "./EventsInProximity";
import DisplayCourseCard from "./DisplayCourseCard";
import EditCourseCard from "./EditCourseCard";
import { Calendar } from "../sharedHooks/Calendar";
import CreateCoursePopup from "./CreateCoursePopup";
import ExportGoogleCalPopup from "./ExportGoogleCalPopup";
// Types
import { CalendarEvent } from "../sharedHooks/Calendar";
// Hooks
import useData from "@/hooks/generalHooks/use-data";
import useTermCalendarEvents from "@/hooks/termPageHooks/use-term-calendar-events";
import { useState } from "react";
import useLocalCourseList from "@/hooks/termPageHooks/use-local-course-list";

const RegularTermPage = () => {
    // Hooks
    const { termData } = useData();
    const { calendarEvents, numOfEventsInNext7Days, deliverablesRemaining } = useTermCalendarEvents();
    const { localTermCourses, saveTermCoursesChanges, discardTermCoursesChanges, syncChanges, cannotSave } = useLocalCourseList();
    // States
    //   conditionals
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isManagingCourses, setIsManagingCourses] = useState<boolean>(false)
    const [isGradesShowing, setIsGradesShowing] = useState<boolean>(false);

    const handleSaveChanges = () => {
        saveTermCoursesChanges();
        if (!cannotSave.value) {
            setIsManagingCourses(false)
        }
    }

    const handleDiscardChanges = () => {
        setIsManagingCourses(false)
        discardTermCoursesChanges();
    }

    return ( 
        <div className="max-w-[1840px] h-fit w-full flex flex-col gap-6 min-h-dvh items-center overflow-visible">
            {/* Top Row */}
            <div className="w-full lg:h-[25rem] grid grid-cols-1 lg:grid-cols-5 grid-rows-[auto_1fr] gap-6">
                {/* Title */}
                <div className="col-span-1 lg:col-span-3 lg:text-left text-center">
                    <h1 className="text-3xl font-medium">{termData?.term}</h1>
                </div>
                {/* Upcoming Deliverables Title - Large Screens */}
                <div className="hidden lg:col-span-2 lg:block">
                    <h1 className="text-2xl font-light">Upcoming Deliverables</h1>
                </div>
                {/* Left Section: Progress Bar (60%) + Metrics (40%) */}
                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-[35%_auto] gap-6">
                    {/* Progress Bar*/}
                    <Card className="h-full flex flex-row items-center justify-center py-5 lg:py-0 px-6">
                        <CircularProgress />
                    </Card>
                    {/* Metrics*/}
                    <div className="flex flex-col gap-6">
                        <MetricCard value={numOfEventsInNext7Days} description_bold="deliverables due in the next 7 days." description_nonbold="Good luck!" />
                        <MetricCard value={deliverablesRemaining} description_bold="deliverables remaining to complete the term." description_nonbold="Keep it up!" />
                    </div>
                </div>
                {/* Upcoming Deliverables Title - Medium-Small Screens */}
                <div className="lg:hidden mt-4 col-span-1 block lg:text-left text-center">
                    <h1 className="text-2xl font-light">Upcoming Deliverables</h1>
                </div>
                
                {/* Upcoming Deliverables */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-6 min-h-[10rem]">
                    {calendarEvents && <EventsInProximity proximityInDays={7} />}
                </div>
            </div>
            {/* Bottom Row */}
            <div className="w-full h-fit mt-6 grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto_1fr] gap-8">
                {/* Course List */}
                <div className="col-span-1 flex flex-col gap-8">
                    {/* Header and Buttons */}
                    <div className="flex gap-6 lg:gap-0 flex-col items-center lg:flex-row w-full">
                        <h1 className="lg:mr-auto text-2xl font-light">Current Courses</h1>
                        <div className="lg:ml-auto flex flex-row gap-4">
                            {isManagingCourses && <Button variant="outline" className='!w-[132px] text-xs !h-10 text-red-500 border-red-500 border-2 hover:text-red-500' onClick={handleDiscardChanges}>Discard<XIcon/></Button>}
                            {isManagingCourses && <Button variant="outline" className='!w-[132px] text-xs !h-10 border-green-500 text-green-500 hover:text-green-500 border-2' onClick={handleSaveChanges}>Save<CheckIcon/></Button>}
                            {!isManagingCourses && !isGradesShowing && <Button className='!w-[132px] !h-10 !text-xs' onClick={() => setIsGradesShowing(true)}>Show Grades <EyeIcon /></Button>}
                            {!isManagingCourses && isGradesShowing && <Button className='!w-[132px] text-xs !h-10' onClick={() => setIsGradesShowing(false)}>Hide Grades <EyeOffIcon /></Button>}
                            {!isManagingCourses && <Button className='!w-[132px] !h-10 border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs' onClick={() => setIsManagingCourses(true)}>Manage Courses <PencilIcon/></Button>}
                        </div>
                    </div>
                    {/* Course Cards */}
                    <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-6 h-fit">
                        {!isManagingCourses && localTermCourses && localTermCourses.map((course) => { return ( <DisplayCourseCard key={course.courseTitle} course={course} gradesShown={isGradesShowing} isCompleted={false}/> ); })}
                        {isManagingCourses && localTermCourses && localTermCourses.map((course, index) => { return ( <EditCourseCard key={course.courseTitle} course={course} courseIndex={index} isCompleted={false} syncChanges={syncChanges}/> ); })}
                        <Card onClick={() => setIsCreatingCourse(true)} 
                            className="h-40 w-40 custom-card flex justify-center items-center custom-card transform transition-all duration-200 hover:scale-[1.04] hover:border-slate-300"
                            role="button" 
                            tabIndex={0}>
                            <h1 className="text-7xl font-extralight">+</h1>
                        </Card>
                    </div>
                </div>
                {/* Calendar Component */}
                <div className="mt-4 lg:mt-0 col-span-1 flex flex-col items-center justify-start gap-8 rounded-xl">
                    <h1 className="lg:mr-auto text-2xl font-light lg:text-left text-center">Term Calendar</h1>
                    <Calendar events={calendarEvents as CalendarEvent[]}>
                        <div className="w-full pt-1 px-6">
                            <Button variant={'outline'} className="border border-blue-500 text-blue-500 hover:text-blue-600" onClick={() => setIsExporting(!isExporting)}>
                                Export to Google Calendar
                            </Button>
                        </div>  
                    </Calendar>
                </div>
            </div>
            {/* Popup when creating a incomplete course */}
            <CreateCoursePopup isCreatingCourse={isCreatingCourse} setIsCreatingCourse={setIsCreatingCourse}/>
            {/* Popup when exporting to google calendar */}
            <ExportGoogleCalPopup isExporting={isExporting} setIsExporting={setIsExporting}/>
        </div>
     );
}
 
export default RegularTermPage;