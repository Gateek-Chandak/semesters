// UI
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// Custom Components
import AddStudyLogPopup from "../popups/AddStudyLogPopup"
// Hooks
import { useState } from "react"
import useData from "@/hooks/general/use-data"
import { Course } from "@/types/mainTypes"
import { Button } from "@/components/ui/button"
import useHoursStudiedLogs from "@/hooks/term/use-hours-studied-logs"
import { Separator } from "@/components/ui/separator"

const StudyHoursChart = () => {
    // Hooks
    const { termData } = useData();
    const { 
        fetchLogs, 
        createLogs, 
        setView, 
        logsToShow, 
        goToNext, 
        goToPrevious, 
        dateRange, 
        view, 
        hoursStudied, 
        avgHoursStudied,
        calculateHoursStudiedByCourse
    } = useHoursStudiedLogs();
    // States
    //  conditionals
    const [isAddingLog, setIsAddingLog] = useState<boolean>(false);

    const OPACITY_VALUE = 0.9

    // Statics
    const metricLabels = ['Total Hours Studied', 'Avg. Hours Studied'];
    const metricValues = [hoursStudied.toFixed(2), avgHoursStudied.toFixed(2)];

    // Init Chart Config
    const chartConfig = termData!.courses.reduce((config, course) => {
        const courseKey = course.course_title;
        
        config[courseKey] = {
            label: `${course.course_title}`,
            color: `${course.colour}`
        };
        
        return config;
    }, {} as Record<string, { label: string, color: string }>) satisfies ChartConfig;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col items-center sm:items-stretch space-y-0 border-b p-0 pb-4 sm:p-0 sm:flex-row">
                <div className="flex flex-1 flex-col items-center sm:items-start justify-center gap-0 px-4 py-4">
                    <CardTitle className="text-xl">Study Logs</CardTitle>
                    <CardDescription className="flex flex-col items-center sm:items-start">Track and view how many hours you've studied this term.</CardDescription>
                    <Button onClick={() => setIsAddingLog(true)} variant={"outline"} className="mt-3 !text-xs !w-fit border">Add Log <PlusIcon /></Button>
                </div>
                <div className="flex flex-col justify-center items-center gap-4 px-6 sm:border-l sm:border-t-0 sm:px-4 sm:py-4">
                    <Tabs className="!w-full justify-center flex" defaultValue="weekly" onValueChange={(view: any) => setView(view)}>
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full hover:bg-[#4c4c4c0e]" value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger className="w-full hover:bg-[#4c4c4c0e]" value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger className="w-full hover:bg-[#4c4c4c0e]" value="term">Term</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="w-full min-w-56 flex flex-row justify-between items-center gap-2 rounded-lg p-1 bg-muted">
                        <Button disabled={view == 'term'} variant={'ghost'} className="hover:bg-[#4c4c4c0e] !w-10 !h-10" onClick={goToPrevious}><ChevronLeft /></Button>
                        <h1 className="text-sm">{dateRange}</h1>
                        <Button disabled={view == 'term'} variant={'ghost'} className="hover:bg-[#4c4c4c0e] !w-10 !h-10" onClick={goToNext}><ChevronRight /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-4 sm:py-4 sm:px-4">
                {termData!.courses.length <= 0 && <h1 className="text-center py-5">Add at least one course to view chart.</h1>}
                {termData!.courses.length > 0 && <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full" >
                    <BarChart accessibilityLayer data={logsToShow} margin={{ left: 7, right: 7, }} >
                        <CartesianGrid vertical={false} />
                        <YAxis width={17}/>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8}
                            minTickGap={32} tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }}  />
                        <ChartTooltip content={
                                <ChartTooltipContent className="w-[175px]" nameKey={"views"} indicatorOpacity={OPACITY_VALUE} valueAddOn="hours"
                                                    labelFormatter={(value) => {
                                                        return new Date(value).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })
                                                    }} />}/>
                        { termData!.courses.map((course: Course) => {
                            return (<Bar className={`fill${course.colour}`} key={course.id} dataKey={course.course_title} stackId="a" fill={course.colour} opacity={OPACITY_VALUE}/>)
                        })}
                    </BarChart>
                </ChartContainer>}
            </CardContent>
            {termData!.courses.length > 0 && <Separator />}
            {termData!.courses.length > 0 &&
                <CardFooter className="p-0 flex flex-col justify-center items-center">
                    <div className="w-full flex flex-row justify-between items-stretch">
                        {termData!.courses.map((course, index) => {
                            return (
                                <div key={course.id} className={`py-3 w-full flex flex-col justify-center items-center gap-0 ${index < termData!.courses.length -1 ? 'border-r' : '' }`}>
                                    <div className="flex flex-row gap-[6px] items-center">
                                        <div style={{opacity: OPACITY_VALUE}} className={`bg${course.colour} rounded-sm h-[10px] w-[10px]`}></div>
                                        <h1 className="text-xs md:text-sm text-center text-muted-foreground">{course.course_title}</h1>
                                    </div>
                                    <h1 className="font-semibold text-md">{calculateHoursStudiedByCourse(course.course_title).toFixed(2)}</h1>
                                </div>
                            )
                        })}
                    </div>
                    <Separator />
                    <div className="w-full flex flex-row justify-between items-stretch">
                        {metricLabels.map((metric: string, index: number) => {
                            return (
                                <div key={index} className={`py-3 w-full flex flex-col justify-center items-center gap-1 ${index < metricLabels.length -1 ? 'border-r' : '' }`}>
                                    <span className="text-xs md:text-sm text-center text-muted-foreground">
                                        {metric}
                                    </span>
                                    <span className="text-lg text-center font-semibold leading-none">
                                        {metricValues.at(index)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </CardFooter> }
            <AddStudyLogPopup isAddingLog={isAddingLog} setIsAddingLog={setIsAddingLog} fetchLogs={fetchLogs} createLogs={createLogs}/>
        </Card>
    )
}

export default StudyHoursChart;