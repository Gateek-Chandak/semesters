// Libraries
import { format } from 'date-fns';
// UI
import { Card } from "../../components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UploadIcon, EyeIcon, EyeOffIcon, PencilIcon, CheckIcon, Repeat, InfoIcon, XIcon } from "lucide-react";
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
// Hooks
import { useState, useMemo } from "react";
// Types
import { CalendarEvent, Term } from "@/types/mainTypes";
// Custom Components
import DisplayTermCard from '@/components/dashboard/DisplayTermCard';
import UploadTranscriptPopup from '@/components/dashboard/popups/UploadTranscriptPopup';
import { CircularProgress } from '@/components/dashboard/CircularProgessBar';
import AddTermPopup from '@/components/dashboard/popups/AddTermPopup';
import MainTermCard from "@/components/dashboard/MainTermCard";
import ConfirmDeletePopup from "@/components/shared/ConfirmDeletePopup";
import EditTermCard from '@/components/dashboard/ModifyTermCard';
import RearrangeTermsPopup from '@/components/dashboard/popups/RearrangeTermsPopup';
import MetricCard from '@/components/shared/MetricCard';
import Footer from '@/components/shared/Footer';
import GradeTrendCard from '@/components/dashboard/analytics/GradeTrendGraph';
// Services
import { CalculationService } from '@/services/calculationService';
import DeleteDataService from '@/services/deleteDataService';
import useData from '@/hooks/general/use-data';

const _calculationService = new CalculationService();

const Dashboard = () => {
    // Services 
    const { handleDeleteTerm } = DeleteDataService();
    // Hooks
    const { data } = useData();
    // States
    //  conditionals
    const [IsrearrangingTerms, setIsRearrangingTerms] = useState<boolean>(false)
    const [isManagingTerms, setIsManagingTerms] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [isCreatingTerm, setIsCreatingTerm] = useState<boolean>(false)
    const [isShowingAverage, setIsShowingAverage] = useState<boolean>(false)
    const [isDeletingTerm, setIsDeletingTerm] = useState<boolean>(false)
    const [isShowingGrades, setIsShowingGrades] = useState<boolean>(false)
    const [isShowingBanner, setIsShowingBanner] = useState<boolean>(true);
    //  values
    const [termBeingDeleted, setTermBeingDeleted] = useState<number>(-1)
    // Inits
    const userName = useSelector((state: RootState) => state.auth.user ? state.auth.user.name : '')
    // Get today's date
    const formattedDate = format(new Date(), 'EEEE, MMMM dd');

    // Calculate values associated with current term
    const currentTerm: Term = useMemo(() => data[data.length-1], [data]);
    const currentTermCalendarEvents: CalendarEvent[] = useMemo(() => _calculationService.getTermCalendarEvents(currentTerm), [currentTerm]);
    const numOfEventsInNext7Days: number = useMemo(() => _calculationService.getEventsInTimeFrame(currentTermCalendarEvents, 7), [currentTermCalendarEvents]);

    // Delete a term
    const triggerDeleteTerm = async (id: number) => {
        const shouldDeleteTerm = await handleDeleteTerm(id);
        if (shouldDeleteTerm) {
            setIsDeletingTerm(false);
            setTermBeingDeleted(-1);
        }
    };

    return ( 
        <div className="w-full flex flex-col justify-between items-center gap-6 px-5 lg:px-10 min-h-screen h-full bg-[#f7f7f7]">
            <div className='max-w-[1840px] w-full flex flex-col gap-6'>
                {isShowingBanner && <div className='w-full flex flex-row items-center justify-between bg-blue-100 border-blue-400 border rounded-xl mt-3 mb-1 p-5 gap-2 text-sm font-normal text-blue-600'>
                    <div className='flex flex-row gap-4 items-center'>
                        <InfoIcon /> 
                        <h1>We&apos;d love your feedback to help make Semesters even better!</h1>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <a href="https://forms.gle/V2twUiUaZUFKaMmMA" target='_blank' className="font-medium hover:text-blue-800 transition-colors duration-200 cursor-pointer">Link To Form</a>
                        <Button variant={'ghost'} className='!h-5 !w-5 !p-0 hover:bg-transparent' onClick={() => setIsShowingBanner(false)}><XIcon /></Button>
                    </div>
                </div>}
                {/* Welcome Message and Date */}
                <div className={`flex flex-col lg:flex-row gap-2 lg:gap-6 ${!isShowingBanner ? 'mt-7' : ''}`}>
                    <h1 className="text-3xl text-center lg:text-start font-medium">Welcome, {userName.split(' ')[0]} {userName.split(' ').length > 1 && userName.split(' ').at(-1)?.slice(0)}.</h1>
                    <h1 className="text-2xl text-center lg:ml-auto font-light">Today is {formattedDate}</h1>
                </div>
                {/* Top Row */}
                {/* Cumulative GPA and Deliverables - MOBILE */}
                <div className="grid grid-cols-1 lg:hidden gap-6">
                    <CircularProgress label="" description="" setIsShowingAverage={setIsShowingAverage} isShowingAverage={isShowingAverage} />
                    <MetricCard value={numOfEventsInNext7Days} description_bold="deliverables due in the next 7 days." description_nonbold="Good luck!" />
                </div>
                <div className="w-full mt-2 grid grid-cols-1 lg:grid-cols-[58%_auto] gap-6">
                    {/* Current and Last Term */}
                    <div className="grid grid-cols-1 gap-6">
                        {data.length === 0 
                        ? (<Card className="h-full border flex flex-col justify-between gap-5 lg:gap-0 p-10">
                                <h1>Current Term</h1>
                                <div>
                                    <h1 className="text-4xl font-medium">No term to display</h1>
                                    <p className="pt-3 text-sm">Upload a transcript or create a term using the + icon.</p>
                                </div>
                            </Card>) 
                        : (<MainTermCard name="Current Term" isManagingCourses={isManagingTerms} term={data[data.length - 1]} 
                                isShowingGrades={isShowingGrades} setIsDeletingTerm={setIsDeletingTerm} 
                                isDeletingTerm={isDeletingTerm} setTermBeingDeleted={setTermBeingDeleted} />)}
                        {data.length > 1 && (
                            <MainTermCard name="Last Term" isManagingCourses={isManagingTerms} term={data[data.length - 2]} 
                                isShowingGrades={isShowingGrades} setIsDeletingTerm={setIsDeletingTerm} 
                                isDeletingTerm={isDeletingTerm} setTermBeingDeleted={setTermBeingDeleted} />)}
                    </div>
                    {/* Cumulative GPA and Deliverables - LAPTOP */}
                    <div className="hidden lg:grid grid-cols-1 gap-6">
                        <CircularProgress label="" description="" setIsShowingAverage={setIsShowingAverage} isShowingAverage={isShowingAverage} />
                        <MetricCard value={numOfEventsInNext7Days} description_bold="deliverables due in the next 7 days." description_nonbold="Good luck!" />
                    </div>
                </div>
                <Separator />
                {/* Middle Row */}
                <div className="flex flex-row w-full h-fit gap-6 mb-8">
                    <div className="w-full flex flex-col gap-6"> 
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-7 justify-center lg:justify-between lg:flex-row w-full">
                            <h1 className="lg:text-left text-center text-2xl font-light">Term Archive</h1>
                            <div className={`grid ${!isManagingTerms ? "lg:grid-cols-4 grid-cols-2" : "lg:grid-cols-1" } justify-center lg:justify-end gap-4`}>
                                {!isShowingGrades && !isManagingTerms &&
                                    <Button variant={'default'} onClick={() => setIsShowingGrades(!isShowingGrades)}>
                                        <div className="text-white text-xs md:text-sm font-medium flex flex-row justify-between items-center w-full gap-2">
                                            <h1>Show Grades</h1>
                                            <EyeIcon />
                                        </div>
                                    </Button>}
                                {isShowingGrades && !isManagingTerms &&
                                    <Button variant={'default'} onClick={() => setIsShowingGrades(!isShowingGrades)}>
                                        <div className="text-white text-xs md:text-sm font-medium flex flex-row justify-between items-center w-full gap-2">
                                            <h1>Hide Grades</h1>
                                            <EyeOffIcon />
                                        </div>
                                    </Button>}
                                {!isManagingTerms && 
                                    <Button variant={'outline'} onClick={() => setIsManagingTerms(!isManagingTerms)} className='border-2 border-red-500'>
                                        <div className="text-red-500 text-xs md:text-sm font-medium flex flex-row justify-between items-center w-full gap-2">
                                            <h1>Delete Terms</h1>
                                            <PencilIcon />
                                        </div>
                                    </Button>}
                                {!isManagingTerms && 
                                    <Button variant={'outline'} onClick={() => setIsRearrangingTerms(!IsrearrangingTerms)} className='border-2 border-black'>
                                        <div className="text-xs md:text-sm font-medium flex flex-row justify-between items-center w-full gap-2">
                                            <h1>Rearrange Order</h1>
                                            <Repeat />
                                        </div>
                                    </Button>}
                                {isManagingTerms && 
                                    <Button variant={'outline'} onClick={() => setIsManagingTerms(!isManagingTerms)} className='text-green-500 border-2 border-green-500 hover:text-green-500 text-xs md:text-sm font-medium '>
                                        <div className="flex flex-row justify-between items-center w-full gap-2">
                                            <h1>Save</h1>
                                            <CheckIcon />
                                        </div>
                                    </Button>}
                                {!isManagingTerms && 
                                    <Button variant={'outline'} onClick={() => setIsActive(!isActive)} className='border-2 border-black'>
                                        <div className="text-black text-xs md:text-sm font-medium flex flex-row justify-between w-full gap-2">
                                            <h1>Upload Transcript</h1>
                                            <UploadIcon />
                                        </div>
                                    </Button>}
                            </div>
                        </div>
                        {/* Displaying Term Cards */}
                        <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-6 h-fit">
                            {/* Regular Term Cards */}
                            {!isManagingTerms 
                                ? data.slice(0).reverse().slice(2).map((term) => (
                                    <DisplayTermCard key={term.id} term={term} isShowingGrades={isShowingGrades} />
                                ))
                                : data.slice(0).reverse().slice(2).map((term) => (
                                    <EditTermCard key={term.id} term={term} isDeleting={isDeletingTerm} 
                                    setIsDeleting={setIsDeletingTerm} setTermBeingDeleted={setTermBeingDeleted} />
                                ))}
                            <Card onClick={() => setIsCreatingTerm(!isCreatingTerm)} className="custom-card transform transition-all duration-200 hover:scale-[1.04] hover:border-gray-300">
                                <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                                    <h1 className='text-7xl font-extralight'>+</h1>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <Separator />
                {/* Bottom Row */}
                <div className="flex flex-col w-full h-fit gap-6 mb-8">
                    <h1 className="lg:text-left text-center text-2xl font-light">Analytics</h1>
                    <div className='w-full grid md:grid-cols-2'>
                        <GradeTrendCard />
                    </div>
                </div>
            </div>
            <Footer />
            {/* Popup form for upload transcript */}
            <UploadTranscriptPopup isActive={isActive} setIsActive={setIsActive} />
            {/* Popup form for regular term add */}
            <AddTermPopup isCreatingTerm={isCreatingTerm} setIsCreatingTerm={setIsCreatingTerm}/>
            {/* Popup for deleting a term */}
            <ConfirmDeletePopup id={termBeingDeleted} deleteItem={triggerDeleteTerm}
                                isDeleting={isDeletingTerm} setIsDeleting={setIsDeletingTerm}/>
            {/* Popup for rearranging terms */}
            <RearrangeTermsPopup isRearrangingTerms={IsrearrangingTerms} setIsRearrangingTerms={setIsRearrangingTerms}/>
    </div>
     );
}
 
export default Dashboard;