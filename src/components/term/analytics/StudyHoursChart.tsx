// UI
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { PlusIcon } from "lucide-react"
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

const chartData = [
    { date: "2024-04-01", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-04-02", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-04-03", "AFM 191": 3, "CFM 101": 7 },
    { date: "2024-04-04", "AFM 191": 11, "CFM 101": 9 },
    { date: "2024-04-05", "AFM 191": 6, "CFM 101": 12 },
    { date: "2024-04-06", "AFM 191": 7, "CFM 101": 11 },
    { date: "2024-04-07", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-04-08", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-04-09", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-04-10", "AFM 191": 7, "CFM 101": 6 },
    { date: "2024-04-11", "AFM 191": 8, "CFM 101": 12 },
    { date: "2024-04-12", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-04-13", "AFM 191": 9, "CFM 101": 12 },
    { date: "2024-04-14", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-04-15", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-04-16", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-04-17", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-04-18", "AFM 191": 9, "CFM 101": 12 },
    { date: "2024-04-19", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-04-20", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-04-21", "AFM 191": 4, "CFM 101": 7 },
    { date: "2024-04-22", "AFM 191": 6, "CFM 101": 5 },
    { date: "2024-04-23", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-04-24", "AFM 191": 12, "CFM 101": 7 },
    { date: "2024-04-25", "AFM 191": 5, "CFM 101": 9 },
    { date: "2024-04-26", "AFM 191": 2, "CFM 101": 4 },
    { date: "2024-04-27", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-04-28", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-04-29", "AFM 191": 7, "CFM 101": 6 },
    { date: "2024-04-30", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-01", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-05-02", "AFM 191": 9, "CFM 101": 10 },
    { date: "2024-05-03", "AFM 191": 7, "CFM 101": 6 },
    { date: "2024-05-04", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-05", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-05-06", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-07", "AFM 191": 10, "CFM 101": 7 },
    { date: "2024-05-08", "AFM 191": 4, "CFM 101": 6 },
    { date: "2024-05-09", "AFM 191": 6, "CFM 101": 5 },
    { date: "2024-05-10", "AFM 191": 9, "CFM 101": 11 },
    { date: "2024-05-11", "AFM 191": 9, "CFM 101": 7 },
    { date: "2024-05-12", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-05-13", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-05-14", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-15", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-05-16", "AFM 191": 9, "CFM 101": 12 },
    { date: "2024-05-17", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-18", "AFM 191": 7, "CFM 101": 8 },
    { date: "2024-05-19", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-05-20", "AFM 191": 4, "CFM 101": 7 },
    { date: "2024-05-21", "AFM 191": 2, "CFM 101": 4 },
    { date: "2024-05-22", "AFM 191": 2, "CFM 101": 3 },
    { date: "2024-05-23", "AFM 191": 7, "CFM 101": 9 },
    { date: "2024-05-24", "AFM 191": 9, "CFM 101": 6 },
    { date: "2024-05-25", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-05-26", "AFM 191": 5, "CFM 101": 4 },
    { date: "2024-05-27", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-05-28", "AFM 191": 6, "CFM 101": 5 },
    { date: "2024-05-29", "AFM 191": 2, "CFM 101": 3 },
    { date: "2024-05-30", "AFM 191": 9, "CFM 101": 7 },
    { date: "2024-05-31", "AFM 191": 4, "CFM 101": 7 },
    { date: "2024-06-01", "AFM 191": 4, "CFM 101": 6 },
    { date: "2024-06-02", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-06-03", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-06-04", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-06-05", "AFM 191": 2, "CFM 101": 4 },
    { date: "2024-06-06", "AFM 191": 9, "CFM 101": 7 },
    { date: "2024-06-07", "AFM 191": 10, "CFM 101": 9 },
    { date: "2024-06-08", "AFM 191": 12, "CFM 101": 8 },
    { date: "2024-06-09", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-06-10", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-06-11", "AFM 191": 2, "CFM 101": 4 },
    { date: "2024-06-12", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-06-13", "AFM 191": 2, "CFM 101": 3 },
    { date: "2024-06-14", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-06-15", "AFM 191": 8, "CFM 101": 8 },
    { date: "2024-06-16", "AFM 191": 9, "CFM 101": 7 },
    { date: "2024-06-17", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-06-18", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-06-19", "AFM 191": 9, "CFM 101": 6 },
    { date: "2024-06-20", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-06-21", "AFM 191": 4, "CFM 101": 6 },
    { date: "2024-06-22", "AFM 191": 7, "CFM 101": 5 },
    { date: "2024-06-23", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-06-24", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-06-25", "AFM 191": 4, "CFM 101": 6 },
    { date: "2024-06-26", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-06-27", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-06-28", "AFM 191": 4, "CFM 101": 6 },
    { date: "2024-06-29", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-06-30", "AFM 191": 12, "CFM 101": 10 },
    { date: "2024-07-01", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-07-02", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-07-03", "AFM 191": 3, "CFM 101": 7 },
    { date: "2024-07-04", "AFM 191": 11, "CFM 101": 9 },
    { date: "2024-07-05", "AFM 191": 6, "CFM 101": 7 },
    { date: "2024-07-06", "AFM 191": 7, "CFM 101": 8 },
    { date: "2024-07-07", "AFM 191": 4, "CFM 101": 5 },
    { date: "2024-07-08", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-07-09", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-07-10", "AFM 191": 7, "CFM 101": 6 },
    { date: "2024-07-11", "AFM 191": 8, "CFM 101": 12 },
    { date: "2024-07-12", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-07-13", "AFM 191": 9, "CFM 101": 12 },
    { date: "2024-07-14", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-07-15", "AFM 191": 5, "CFM 101": 7 },
    { date: "2024-07-16", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-07-17", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-07-18", "AFM 191": 9, "CFM 101": 12 },
    { date: "2024-07-19", "AFM 191": 5, "CFM 101": 6 },
    { date: "2024-07-20", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-07-21", "AFM 191": 4, "CFM 101": 7 },
    { date: "2024-07-22", "AFM 191": 6, "CFM 101": 5 },
    { date: "2024-07-23", "AFM 191": 4, "CFM 101": 8 },
    { date: "2024-07-24", "AFM 191": 12, "CFM 101": 7 },
    { date: "2024-07-25", "AFM 191": 5, "CFM 101": 9 },
    { date: "2024-07-26", "AFM 191": 2, "CFM 101": 4 },
    { date: "2024-07-27", "AFM 191": 12, "CFM 101": 12 },
    { date: "2024-07-28", "AFM 191": 3, "CFM 101": 5 },
    { date: "2024-07-29", "AFM 191": 7, "CFM 101": 6 },
    { date: "2024-07-30", "AFM 191": 12, "CFM 101": 9 },
    { date: "2024-07-31", "AFM 191": 3, "CFM 101": 7 },
  ]  

const StudyHoursChart = () => {
    // Hooks
    const { termData } = useData();
    // States
    //  conditionals
    const [isAddingLog, setIsAddingLog] = useState<boolean>(false);

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
        <Card>
            <CardHeader className="flex flex-col items-center sm:items-stretch space-y-0 border-b p-0 pb-2 sm:p-0 sm:flex-row">
                <div className="flex flex-1 flex-col items-center sm:items-start justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Study Hours Log</CardTitle>
                    <CardDescription>example text here</CardDescription>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 px-6 sm:border-l sm:border-t-0 sm:px-4 sm:py-6">
                    <span className="text-sm text-center text-muted-foreground">
                        Total Hours Studied
                    </span>
                    <span className="text-lg text-center font-bold leading-none sm:text-2xl">
                        692
                    </span>
                    <Tabs defaultValue="weekly">
                        <TabsList>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger className="hidden sm:block" value="term">Term</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>

            <CardContent className="px-2 py-4 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full" >
                    <BarChart accessibilityLayer data={chartData} margin={{ left: 7, right: 7, }} >
                        <CartesianGrid vertical={false} />
                        <YAxis width={27}/>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8}
                            minTickGap={32} tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }}  />
                        <ChartTooltip content={
                                <ChartTooltipContent className="w-[150px]" nameKey="views"
                                                    labelFormatter={(value) => {
                                                        return new Date(value).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })
                                                    }} />}/>
                        { termData!.courses.map((course: Course) => {
                            return (<Bar key={course.id} dataKey={course.course_title} stackId="a" fill={course.colour}/>)
                        })}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <Button onClick={() => setIsAddingLog(true)} variant={"outline"} className="border-2 border-black">Add Log <PlusIcon /></Button>
            </CardFooter>
            <AddStudyLogPopup isAddingLog={isAddingLog} setIsAddingLog={setIsAddingLog}/>
        </Card>
    )
}

export default StudyHoursChart;