// UI
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDown } from "lucide-react";
// Hooks
import { useToast } from "@/hooks/general/use-toast";
// Custom Components
import FacultyCard from "@/components/landing/FacultyCard";
// Services
import { APIService } from "@/services/apiService";

const LandingPage = () => {
  // Services
  const _apiService = new APIService();
  // Inits
  const { toast } = useToast();

  // Handles log-in logic for API request and routing
  const handleLogin = async () => {
      try {
          const googleAuthUrl = await _apiService.handleLogin()
          window.location.href = googleAuthUrl;
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Log-in Error",
          description: "An unknown error occurred.",
      });
      }
  }

  return ( 
      <div className="lg:bg-[#f1f0f0] flex flex-col items-center justify-center w-full">
        {/* Top left Logo */}
        <div className="fixed top-4 left-4 flex justify-start items-center gap-2 z-50" onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}>
          <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 h-auto"/>
          <h1 className="text-xl font-medium">Semesters</h1>
        </div>
        {/* Main Hero Section */}
        <div id="top" className="flex items-center justify-center h-dvh w-full">
          <div className="w-[80%] lg:w-[68%] flex flex-col gap-10 z-50">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-start gap-6 items-center">
                <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-8 md:w-12 lg:w-14 h-auto"/>
                <h1 className="text-xl md:text-3xl lg:text-[2.8rem] font-medium">Helping students keep it together.</h1>
              </div>
              <h1 className="text-sm md:text-md lg:text-xl">Stay on top of assignments, track your grades, and be ahead of every deadline.</h1>
            </div>
            <div className="flex flex-row gap-8 w-full justify-between">
              <Button className="w-full flex flex-row justify-between text-xs md:text-sm" onClick={handleLogin}>
                Get Started <ArrowUpRight />
              </Button>
              <Button className="w-full flex flex-row justify-between text-xs md:text-sm" variant={"outline"}
                      onClick={() => document.getElementById("infoPage")?.scrollIntoView({ behavior: "smooth" })}>
                Learn More <ArrowDown />
              </Button>
            </div>
          </div>

          {/* Background Cards */}
          <FacultyCard colour="#270D63" title="Assignment Due @ 11:59" position="top-8 left-[30%]"/>
          <FacultyCard colour="#334FC0" title="22% Needed to Pass" position="top-44 right-[25%]"/>
          <FacultyCard colour="#59BFC7" title="92% Predicted cGPA" position="bottom-40 left-[38%]"/>
          <FacultyCard colour="#629315" title="Upcoming Quiz on Tuesday" position="bottom-14 left-[7%]"/>
          <FacultyCard colour="#883116" title="5 Deliverables Due This Week" position="top-20 right-[7%]"/>
          <FacultyCard colour="purple" title="Export to Google Calendar" position="top-32 left-[4%]"/>
          <FacultyCard colour="#8A0D0F" title="85% Max. Grade Possible " position=" bottom-28 right-[8%]"/>
        </ div>

        <Separator />
        {/* TODO: Create a component for each video card */}

        {/* Upload Transcript Page */}
        <div className="flex items-center justify-center h-dvh w-[80%] px-4" id="infoPage">
          <div className="py-[120px] flex flex-col lg:flex-row items-center justify-center gap-[72px]">
            {/* <video width="640" height="360" className="rounded-xl border border-gray-800" autoPlay loop muted>
                <source src="/Videos/LandingPageUploadTranscript.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                Preview Currently Unavailiable
            </video> */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex px-4">
              <h1 className="self-stretch text-black text-3xl lg:text-5xl font-medium">Upload your Transcript.</h1>
              <h1 className="self-stretch text-black text-md lg:text-xl">We use your transcript to store your courses and grades for your entire academic career.</h1>
              <h1 className="self-stretch">
                <span className="text-zinc-500">If you are a Waterloo student, you can view and download your transcript in Quest. </span>
              </h1>
            </div>
          </div>
        </div>

        <Separator />

        {/* Upload Schedule Page */}
        <div className="flex items-center justify-center h-dvh w-[80%] px-4">
          <div className="py-[120px] flex flex-col lg:flex-row items-center justify-center gap-[72px]">
            {/* <video width="640" height="360" className="rounded-xl border border-gray-800" autoPlay loop muted>
                <source src="/Videos/LandingPageUploadSyllabus.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                 Preview Currently Unavailiable
            </video> */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex px-4">
              <h1 className="self-stretch text-black text-3xl lg:text-5xl font-medium">Upload your syllabus.</h1>
              <h1 className="self-stretch text-black text-md lg:text-xl">We use your syllabus to gather deliverable due dates, class times and the grading scheme.</h1>
              <h1 className="self-stretch">
                <span className="text-zinc-500">If you are a Waterloo student, you can view and download your syllabuses on </span>
                <a href="https://outline.uwaterloo.ca/browse/" target="_blank" className="text-zinc-500 underline">outline.uwaterloo.ca</a>
              </h1>
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Calendar Page */}
        <div className="flex items-center justify-center h-dvh w-[80%]">
          <div className="py-[120px] flex flex-col lg:flex-row items-center justify-center gap-[72px]">
            {/* <video width="640" height="360" className="rounded-xl border border-gray-800" autoPlay loop muted>
              <source src="/Videos/LandingPageGoogleCalendar.mp4" type="video/mp4" />
              Your browser does not support the video tag.
              Preview Currently Unavailiable
            </video> */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex px-4">
              <h1 className="self-stretch text-black text-3xl lg:text-5xl font-medium">Export Your Calendar.</h1>
              <h1 className="self-stretch text-black text-md lg:text-xl">
                After adding your classes, export your schedule to Google Calendar with all your assessment data.
              </h1>
              <h1 className="self-stretch">
                <span className="text-zinc-500">
                  After importing and creating all your courses for the term, use the automatic export feature
                  to export your calendar to your Google account.
                </span>
              </h1>
            </div>
          </div>
        </div>

        <Separator />

        {/* Track Your Grades Page */}
        <div className="flex items-center justify-center h-dvh w-[80%]">
          <div className="py-[120px] flex flex-col lg:flex-row items-center justify-center gap-[72px]">
            {/* <video width="640" height="360" className="rounded-xl border border-gray-800" autoPlay loop muted>
                <source src="/Videos/LandingPageGradingSchemes.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                Preview Currently Unavailiable
            </video> */}
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex px-4">
              <h1 className="self-stretch text-black text-3xl lg:text-5xl font-medium">Track Your Grades.</h1>
              <h1 className="self-stretch text-black text-md lg:text-xl">
                Use grading schemes to track your grades in real-time and see how assignments impact your GPA.
              </h1>
              <h1 className="self-stretch">
                <span className="text-zinc-500">
                  Upload your transcript to import previous terms and calculate your undergraduate GPA.
                </span>
              </h1>
            </div>
          </div>
        </div>

        <Separator />
        
        {/* FAQ */}
        <div className="flex flex-col items-center justify-center h-[100dvh] w-[90%] md:w-[60%] z-50 gap-10">
          <h1 className="flex w-full justify-start text-2xl md:text-3xl font-medium">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="w-[95%]">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg md:text-xl">What's the point of Semesters?</AccordionTrigger>
              <AccordionContent className="text-md md:text-lg">
                This app helps students manage their grades, schedules, and academic progress in an organized and efficient way.
                You can track everything from individual grading schemes to overall cGPA in order to stay on top of your academic 
                journey!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg md:text-xl">Why should I use Semesters?</AccordionTrigger>
              <AccordionContent className="text-md md:text-lg">
                Unlike general tools like notes apps or Notion, this app is purpose-built for students. 
                It automatically organizes your grades, schedules, and deliverables by term and course, 
                saving you time and effort. Features like transcript and syllabus parsing, grade projections, 
                and Google Calendar integration provide a streamlined experience that general apps can't match.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3 flex">
              <AccordionTrigger className="text-lg md:text-xl">Can I use this if I'm not a UW student?</AccordionTrigger>
              <AccordionContent className="text-md md:text-lg">
                Yes! You can use this app if you’re not a Waterloo student. However, the app is optimized for 
                University of Waterloo documentation and as a result, other school's transcripts and syllabus' may
                not be accurate.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="w-full "><span className="font-medium">Have another question or a piece of feedback?</span> Reach out to us on LinkedIn. We’re happy to chat.</p>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-around pt-10 pb-14 w-[90%] z-50 gap-4 md:gap-10">
          <div onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })} className="flex justify-start gap-2 hover:cursor-pointer">
            <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 md:w-6 h-auto"/>
            <h1 className="text-lg md:text-xl font-medium">Semesters</h1>
          </div>
          <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Privacy Policy</a>
          <a href="/privacy-policy-and-terms-conditions" className="text-xs md:text-md text-muted-foreground">Terms & Conditions</a>
          <h1 className="text-xs md:text-md">
            Made by <a href="https://www.linkedin.com/in/gateek-chandak/" target="_blank" className="underline">Gateek Chandak</a> & <a href="https://www.davidstirling.me/" target="_blank" className="underline">David Stirling</a>
          </h1>
        </div>
      </div>
    );
}
 
export default LandingPage;