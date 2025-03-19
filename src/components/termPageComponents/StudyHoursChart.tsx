// UI
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "../ui/button"
// Hooks
import { useState, useMemo } from "react"
import useParsedRouteParams from "@/hooks/generalHooks/use-parsed-route-params"
import { Separator } from "../ui/separator"

// Generates Study Data from the start date to current day.
function generateStudyData() {
    const startDate = new Date("2025-01-01");
    const today = new Date();
    const data = [];
    
    while (startDate <= today) {
      data.push({
        date: startDate.toISOString().split("T")[0],
        hoursStudied: Math.floor(Math.random() * 15),
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    
    return data;
}

const chartConfig = {
  views: {
    label: "Hours Studied",
  },
  hoursStudied: {
    label: "Hours Studied",
    color: "#FED34C",
  }
} satisfies ChartConfig

const StudyHoursChart = () => {
    // Hooks
    const { parsedTerm } = useParsedRouteParams();
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("hoursStudied")

    const chartData = generateStudyData();
    const chart = "hoursStudied" as keyof typeof chartConfig
    const total = useMemo(() => ({hoursStudied: chartData.reduce((acc, curr) => acc + curr.hoursStudied, 0)}),[])

    return (
    <Card className="w-full">
        <CardHeader className="flex flex-col items-center sm:items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col items-center sm:items-start justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Study Hours</CardTitle>
                <CardDescription>
                Showing total study hours for {parsedTerm}
                </CardDescription>
            </div>
            <div className="flex">
                    <button data-active={activeChart === chart}
                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            onClick={() => setActiveChart(chart)}>
                    <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                    </span>
                    <span className="text-lg text-center text-[#EAAB00] font-bold leading-none sm:text-3xl">
                        {total["hoursStudied"].toLocaleString()}
                    </span>
                    </button>
            </div>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:p-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full" >
                <BarChart accessibilityLayer data={chartData} onClick={(item: any) => console.log(item.activePayload ? item.activePayload[0].payload : "")}>
                    <CartesianGrid vertical={true}/>
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value: any) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })
                        }}/>
                    <YAxis 
                        dataKey="hoursStudied"   // The key from your data to be plotted on Y-axis
                        domain={[0, 'auto']} // Set the range (0 to auto)
                        tick={{ fill: 'grey' }} // Customize tick styles
                        axisLine={{ stroke: 'grey' }} // Customize axis line
                        width={25}
                        />
                    <ChartTooltip
                        content={
                        <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="views"
                            labelFormatter={(value: any) => {
                            return new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })
                            }}
                        />
                        }
                    />
                    <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} stroke={`var(--color-${activeChart})`} type="linear"  fillOpacity={0.8}/>
                </BarChart>
            </ChartContainer>
        </CardContent>
        <Separator />
        <CardFooter className="pt-6 flex flex-row gap-4 justify-start items-center">
            <Button variant={'default'} className="!px-6">Add Today's Log</Button>
            <Button variant={'outline'} className="border-2 border-black !px-6">Add Log</Button>
        </CardFooter>
    </Card>
    )
}

export default StudyHoursChart;