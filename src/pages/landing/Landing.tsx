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
import { Card } from "@/components/ui/card";

import { motion } from 'framer-motion';

const LandingPage = () => {
  // Services
  const _apiService = new APIService();
  // Inits
  const { toast } = useToast();

  const percentage = 85.32;
  const pathLength = percentage / 100; // convert percentage to 0–1

  const pathD = "M0,50 L20,40 L60,20 L90,40 L150,5, L195,55";


  const sparkles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: 0,
    duration: 2 + Math.random() * 8,
    size: 4 + Math.random() * 5, // slightly larger for sparkle shapes
  }));

  const floatingShapes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    xStart: Math.random() * 100,
    yStart: Math.random() * 100,
    xEnd: Math.random() * 100,
    yEnd: Math.random() * 100,
    size: 3 + Math.random() * 2,
    duration: 8 + Math.random() * 4,
    delay: Math.random() * 2,
    type: Math.random() < 0.4 ? "dot" : Math.random() < 0.7 ? "bar" : "triangle",
  }));

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
      <div className="bg-[#f1f0f0] flex flex-col items-center justify-center w-full">
        {/* Top left Logo */}
        {/* <div className="fixed top-4 left-4 flex justify-start items-center gap-2 z-50" onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}>
          <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-5 h-auto"/>
          <h1 className="text-xl font-medium">Semesters</h1>
        </div> */}
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
                      onClick={() => document.getElementById("takeControl")?.scrollIntoView({ behavior: "smooth" })}>
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
        {/* <div id="takeControl" className="pt-20 pb-12 w-full flex justify-start px-6">
          <h1 className="text-4xl font-medium">Take Control of Your Grades.</h1> 
        </div> */}
        <div id="takeControl" className="mt-20 mb-20 grid min-h-screen w-screen grid-cols-10 grid-rows-30 sm:grid-rows-10 gap-4 px-6">
          <div className="bg-blue-300 bg-gradient-to-t from-blue-300 to-blue-500 col-span-10 lg:col-span-3 row-span-5 rounded-3xl py-4 flex flex-col justify-center items-center gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 0, x: -10 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0, duration: 1.8 }}
              className="px-6 text-5xl leading-[1] font-medium text-wrap text-center"
            >
              View your academic journey, term by term.
            </motion.h1>
            {/* <h1 className="px-6 text-[55px] leading-[1] font-medium text-wrap text-center">View your academic journey, term by term.</h1> */}
            <div className="relative w-full h-12 flex items-center justify-between">
              {/* Animated horizontal line */}
              <motion.div
                className="w-full absolute h-1 bg-[#ff8843]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />

              {/* Dots */}
              {["F24", "W25", "S25"].map((term, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 1 + i * 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 17,
                  }}
                  className="mx-8 w-[42px] h-[42px] bg-[#ff8843] rounded-full z-10 flex justify-center items-center"
                >
                  <h1 className="text-sm font-semibold text-[#f1f0f0]">{term}</h1>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative bg-gradient-to-b from-purple-300 to-purple-500 col-span-10 lg:col-span-4 row-span-6 rounded-3xl p-6 flex flex-col justify-center items-center gap-6 min-h-fit overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="text-5xl font-medium text-wrap text-center z-10"
            >
              Analytics that work as hard as you do.
            </motion.h1>

            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none rounded-inherit"
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 2, ease: "circOut" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 0.4 },
              }}
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Spinning concentric circles */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="white"
                strokeWidth="0.6"
                strokeDasharray="250"
                variants={{
                  hidden: { strokeDashoffset: 0 },
                  visible: { strokeDashoffset: [0, 250, 0] },
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="200"
                variants={{
                  hidden: { strokeDashoffset: 0 },
                  visible: { strokeDashoffset: [0, 200, 0] },
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="150"
                variants={{
                  hidden: { strokeDashoffset: 0 },
                  visible: { strokeDashoffset: [0, 150, 0] },
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Orbiting spark */}
              <motion.circle
                cx="50"
                cy="10"
                r="2"
                fill="white"
                variants={{
                  hidden: { rotate: 0 },
                  visible: { rotate: 360 },
                }}
                transform="rotate(0 50 50)"
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />

              {/* Floating analytics shapes */}
              {floatingShapes.map((shape) =>
                shape.type === "dot" ? (
                  <motion.circle
                    key={shape.id}
                    cx={shape.xStart}
                    cy={shape.yStart}
                    r={shape.size / 2}
                    variants={{
                      hidden: { opacity: 0, cx: shape.xStart, cy: shape.yStart },
                      visible: {
                        opacity: [0.3, 0.6, 0.3],
                        cx: shape.xEnd,
                        cy: shape.yEnd,
                      },
                    }}
                    transition={{
                      duration: shape.duration,
                      delay: shape.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ) : shape.type === "bar" ? (
                  <motion.rect
                    key={shape.id}
                    x={shape.xStart}
                    y={shape.yStart}
                    width={shape.size / 3}
                    height={shape.size * 2}
                    variants={{
                      hidden: { opacity: 0, x: shape.xStart, y: shape.yStart },
                      visible: {
                        opacity: [0.3, 0.6, 0.3],
                        x: shape.xEnd,
                        y: shape.yEnd,
                      },
                    }}
                    transition={{
                      duration: shape.duration,
                      delay: shape.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ) : (
                  <motion.polygon
                    key={shape.id}
                    points={`0,${shape.size} ${shape.size / 2},0 ${shape.size},${shape.size}`}
                    transform={`translate(${shape.xStart}, ${shape.yStart})`}
                    variants={{
                      hidden: {
                        opacity: 0,
                        translateX: shape.xStart,
                        translateY: shape.yStart,
                      },
                      visible: {
                        opacity: [0.3, 0.6, 0.3],
                        translateX: shape.xEnd,
                        translateY: shape.yEnd,
                      },
                    }}
                    transition={{
                      duration: shape.duration,
                      delay: shape.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                )
              )}
            </motion.svg>
          </div>

          <div className="text-[#f1f0f0] relative bg-gradient-to-bl from-pink-900 via-pink-800 to-pink-600 col-span-10 lg:col-span-3 row-span-3 rounded-3xl p-6 flex justify-center items-center overflow-hidden">
            {/* Sparkles */}
            {sparkles.map((sparkle) => (
              <motion.svg
                key={sparkle.id}
                initial={{ opacity: 0, rotate: 0 }}
                whileInView={{ opacity: [0, 1, 0], rotate: [0, 360] }}
                transition={{
                  duration: sparkle.duration,
                  delay: sparkle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  width: sparkle.size,
                  height: sparkle.size,
                  pointerEvents: "none",
                }}
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
              </motion.svg>
            ))}

            {/* Text Content */}
            <motion.h1
              initial={{ opacity: 0, y: 0, x: 40 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="text-3xl md:text-4xl font-medium text-wrap text-center z-10">
              Skip the data entry. Just upload your syllabus and go.
              </motion.h1>
          </div>
          <div className="bg-gradient-to-l from-blue-600 to-sky-400 col-span-10 lg:col-span-3 row-span-3 rounded-3xl flex flex-col">
          <motion.h1
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.8 }}
            className="text-xl text-center font-medium text-wrap p-4"
          >
            Know what 43% on that midterm means for different <span className="font-semibold text-white">Grading Schemes.</span>
          </motion.h1>

            <div className="w-full flex items-center justify-center">
              <svg viewBox="0 0 180 70" className="w-full h-full">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f1f0f0" />
                  </linearGradient>
                </defs>

                {/* Animated Path */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  markerEnd=""
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="blue"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  markerEnd=""
                  initial={{ pathLength: 1, opacity: 0 }}
                  whileInView={{ pathLength: 0, opacity: [1,0] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-300 bg-gradient-to-tr from-rose-500 to-yellow-300 col-span-10 lg:col-span-3 row-span-5 rounded-3xl p-6 gap-4 flex flex-col justify-center items-center">
          <motion.h1
              initial={{ opacity: 0, y: 0, x: 0 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0, duration: 2 }}
              className="text-center text-3xl font-medium text-wrap"
          >
            Keep your courses in check, effortlessly.
          </motion.h1>
            <Card className="w-full h-full py-5 px-4 flex flex-col justify-center lg:justify-start items-center !border-none !bg-[#363636]">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-60 h-48 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="120"
                      cy="95"
                      r="70"
                      stroke="black"
                      strokeWidth="7"
                      fill="none"
                      className="text-muted/50"
                    />
                    {/* Animated foreground circle */}
                    <motion.circle
                      cx="120"
                      cy="95"
                      r="70"
                      stroke="orange"
                      strokeWidth="7"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 1.2, ease: "easeOut" },
                        opacity: { duration: 0.3 },
                      }}
                    />
                  </svg>

                  {/* Animated % number */}
                  <motion.span
                    className="bg-yellow-300 bg-gradient-to-tr from-rose-500 to-yellow-300 text-transparent bg-clip-text  absolute text-3xl font-bold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {percentage}%
                  </motion.span>
                </div>
              </div>

              {/* Animated stat */}
              <motion.div
                className="w-full h-full flex flex-row justify-center gap-4 items-center !border-none text-yellow-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h1 className="bg-yellow-300 bg-gradient-to-tr from-rose-500 to-yellow-300 text-transparent bg-clip-text text-4xl font-semibold">4</h1>
                <p className="text-sm">
                  <span className="bg-yellow-300 bg-gradient-to-tr from-rose-500 to-yellow-300 text-transparent bg-clip-text  font-bold">deliverables due in the next 7 days.</span>
                </p>
              </motion.div>
            </Card>
          </div>
          <div className="bg-gradient-to-t from-green-500 to-green-300 col-span-10 lg:col-span-4 row-span-4 rounded-3xl p-9 flex flex-col justify-center items-center leading-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="text-5xl text-center font-normal text-wrap"
            >
              Your transcript, Instantly extracted and{" "}
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent tracking-wider">
                visualized.
              </span>
            </motion.h1>
          </div>
          <div className="bg-[#ff8843] bg-gradient-to-b from-[#ff8843] to-red-500 text-[#f1f0f0] col-span-10 lg:col-span-3 row-span-4 rounded-3xl p-6 flex flex-col justify-center items-center gap-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center text-5xl font-medium"
            >
              Integrate
            </motion.h1>

            <motion.img
              src="/Objects/googleCalIcon.svg"
              alt=""
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-40 h-auto flex justify-center items-center"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center text-5xl font-medium"
            >
              seamlessly.
            </motion.h1>
          </div>
        </div> 

        {/* <div className="h-screen w-full flex flex-col justify-start gap-2 px-4 py-10">
          <h1 className="text-slate-800 text-3xl ml-7 mb-10 font-semibold">Take Control of Your Grades.</h1>  
          <div className="w-full h-[75%] overflow-x-auto overflow-y-hidden whitespace-nowrap flex items-center space-x-4">
            {features.map((feature, index) => (
              <div style={{backgroundColor: feature.colour }} key={index} className={`${feature.title == 'Analytics' ? ' w-[35rem]' : 'w-[20rem]'} h-full bg-white rounded-2xl p-6 flex flex-col justify-start shrink-0`}>
                <h2 className="text-md text-white">{feature.title}</h2>
                <p className="text-white text-xl font-semibold text-wrap">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>  */}


        <Separator />
        
        {/* FAQ */}
        <div className="my-20 flex flex-col items-center justify-center h-fit w-[90%] md:w-[60%] z-50 gap-10">
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
          <p className="w-full "><span className="font-medium">Have another question or a piece of feedback?</span> Reach out at chandakgateek@gmail.com or fill out the feedback form in the footer. We’re happy to help :)</p>
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
          <a href="https://forms.gle/V2twUiUaZUFKaMmMA" target="_blank" className="text-xs md:text-md text-muted-foreground">Feedback</a>
          <h1 className="text-xs md:text-md">
            Made for UW Students, by UW students.
          </h1>
        </div>
      </div>
    );
}
 
export default LandingPage;