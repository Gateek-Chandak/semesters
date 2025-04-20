// UI
import { CheckIcon, EyeIcon, EyeOffIcon, PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
// Custom Components
import MetricCard from "../shared/MetricCard";
import { CircularProgress } from "./CircularProgessBar";
import EventsInProximity from "./EventsInProximity";
import DisplayCourseCard from "./DisplayCourseCard";
import EditCourseCard from "./EditCourseCard";
import { Calendar } from "../shared/Calendar";
import CreateCoursePopup from "./popups/CreateCoursePopup";
import ExportGoogleCalPopup from "./popups/ExportGoogleCalPopup";
import GPAEstimator from "./analytics/GPAEstimator";
import StudyHoursChart from "./analytics/StudyHoursChart";
// Types
import { CalendarEvent } from "../shared/Calendar";
// Hooks
import useData from "@/hooks/general/use-data";
import useTermCalendarEvents from "@/hooks/term/use-term-calendar-events";
import { useState } from "react";
import useLocalCourseList from "@/hooks/term/use-local-course-list";
import useUser from "@/hooks/general/use-user";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

const RegularTermPage = () => {
    // Hooks
    const { termData } = useData();
    const { user } = useUser();
    const { calendarEvents, numOfEventsInNext7Days, deliverablesRemaining } = useTermCalendarEvents();
    const { localTermCourses, saveTermCoursesChanges, syncChanges, cannotSave } = useLocalCourseList();
    // States
    //   conditionals
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isManagingCourses, setIsManagingCourses] = useState<boolean>(false)
    const [isGradesShowing, setIsGradesShowing] = useState<boolean>(false);

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
        <div className="max-w-[1840px] h-fit w-full flex flex-col gap-6 min-h-dvh items-center overflow-visible">
            {/* Top Row */}
            <div className="w-full lg:h-[25rem] grid grid-cols-1 lg:grid-cols-5 grid-rows-[auto_1fr] gap-6">
                {/* Title */}
                <div className="col-span-1 lg:col-span-3 lg:text-left text-center">
                    <h1 className="text-3xl font-medium">{termData?.term_name}</h1>
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
                            {/* {isManagingCourses && <Button variant="outline" className='!w-[132px] text-xs !h-10 text-red-500 border-red-500 border-2 hover:text-red-500' onClick={handleDiscardChanges}>Discard<XIcon/></Button>} */}
                            {isManagingCourses && <Button variant="outline" className='text-xs !h-10 border-black text-black border-2' onClick={handleSaveChanges}>Confirm Changes<CheckIcon/></Button>}
                            {!isManagingCourses && <Button className='!h-10 border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs' onClick={() => setIsManagingCourses(true)}>Manage Courses<PencilIcon/></Button>}
                            {!isManagingCourses && !isGradesShowing && <Button className='!h-10 !text-xs' onClick={() => setIsGradesShowing(true)}>Show Grades <EyeIcon /></Button>}
                            {!isManagingCourses && isGradesShowing && <Button className='text-xs !h-10' onClick={() => setIsGradesShowing(false)}>Hide Grades <EyeOffIcon /></Button>}
                        </div>
                    </div>
                    {/* Course Cards */}
                    <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-6 h-fit">
                        {!isManagingCourses && localTermCourses && localTermCourses.map((course) => { return ( <DisplayCourseCard key={course.id} course={course} gradesShown={isGradesShowing} isCompleted={false}/> ); })}
                        {isManagingCourses && localTermCourses && localTermCourses.map((course, index) => { return ( <EditCourseCard key={course.id} course={course} courseIndex={index} isCompleted={false} syncChanges={syncChanges}/> ); })}
                        <Card onClick={() => setIsCreatingCourse(true)} 
                            className="h-40 w-40 custom-card flex justify-center items-center custom-card transform transition-all duration-200 hover:scale-[1.04] hover:border-slate-300"
                            role="button" 
                            tabIndex={0}>
                            <h1 className="text-7xl font-extralight">+</h1>
                        </Card>
                    </div>
                    {/* Analytics */}
                    <h1 className="lg:mr-auto text-2xl font-light text-center lg:text-start">Analytics</h1>
                    <div className="w-full flex flex-col gap-6">
                        <GPAEstimator />
                        <StudyHoursChart />
                    </div>
                </div>
                {/* Calendar Component */}
                <div className="mt-4 lg:mt-0 col-span-1 flex flex-col items-center justify-start gap-8 rounded-xl">
                    <h1 className="lg:mr-auto text-2xl font-light lg:text-left text-center">Term Calendar</h1>
                    <Calendar events={calendarEvents as CalendarEvent[]} setIsExporting={setIsExporting} termView={true} />
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