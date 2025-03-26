// UI
import { Calendar, CalendarEvent } from '../../components/shared/Calendar'
import { CircularProgress } from '@/components/course/CircularProgessBar';
import Footer from '@/components/shared/Footer';
// Hooks
import useData from '@/hooks/general/use-data';
// Custom Components
import DeliverablesCard from '@/components/course/DeliverablesCard';
import GradeEstimatorCard from '@/components/course/GradeEstimatorCard';
import MaxMinCard from '@/components/course/MaxMinCard';
// Services
import useCalendarEvents from '@/hooks/course/use-course-calendar-events';

const CoursePage = () => {
    // Hooks
    const { courseData } = useData();
    const calendarEvents = useCalendarEvents();

    return ( 
        <div className="w-full min-h-screen h-fit px-5 lg:px-10 pt-7 bg-[#f7f7f7] flex flex-col justify-start items-center overflow-visible">
            <div className='max-w-[1840px] min-h-screen w-full flex flex-col justify-start items-center'>
                {/* Top Row */}
                <div className='w-full'>   
                    {/* Title */}
                    <div className="w-[100%] flex flex-row items-center justify-center lg:justify-start gap-6 text-2xl">
                        <h1 className={`font-medium text-3xl text-${courseData?.colour}-600`}>{courseData?.course_title}</h1>
                        <h1 className="font-extralight text-3xl">{courseData?.course_subtitle}</h1>
                    </div>
                    {/* Metric Cards */}
                    <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-[70%_auto] gap-6">
                        <div className='grid gap-6 grid-cols-1 lg:grid-cols-[40%_auto]'>
                            <CircularProgress/>
                            <GradeEstimatorCard />
                        </div>
                        <MaxMinCard/>
                    </div>
                </div>
                {/* Bottom Row */}
                <div className="h-fit w-full mt-8 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
                    {/* Schemes */}
                    <div className="col-span-1 flex flex-col items-center justify-start gap-8 rounded-2xl">
                        <h1 className="mt-3 lg:mt-0 lg:mr-auto text-2xl font-light">Deliverables</h1>
                        <DeliverablesCard/>
                    </div>
                    {/* Calendar Component */}
                    <div className="col-span-1 flex flex-col items-center justify-start overflow-auto gap-8 rounded-xl">
                        <h1 className="mt-3 lg:mt-0 lg:mr-auto text-2xl font-light">Course Calendar</h1>
                        <Calendar events={calendarEvents as CalendarEvent[]} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
     );
}
 
export default CoursePage;