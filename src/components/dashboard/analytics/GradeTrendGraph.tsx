// UI
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// Types
import { Term } from "@/types/mainTypes"
// Services
import { CalculationService } from "@/services/calculationService"
// Hooks
import useData from "@/hooks/general/use-data"
import { useEffect, useState } from "react"

const _calculationService = new CalculationService();

const chartConfig = {
  termGrade: {
    label: "termGrade",
    color: "blue",
  },
  overall: {
    label: "overall",
    color: "purple"
  }
} satisfies ChartConfig

function createChartData(data: Term[]) {
    let termList: Term[] = [];
    const chartData = data.map((term: Term) => {
        const termGrade = parseFloat(_calculationService.getTermAverage(term).toFixed(2));

        termList.push(term);
        const overallAverage = parseFloat(_calculationService.getProjectedCumulativeGPA(termList).toFixed(2));

        return { term: term.term_name, overall: overallAverage, termGrade: termGrade };
    })

    return chartData;
}

function calculateLatestTrend(data: Term[]) {
    const currentGPA = _calculationService.getCumulativeGPA(data); // gets all except curr term
    const newGPA = _calculationService.getProjectedCumulativeGPA(data); // gets all including curr term

    const change = ((newGPA - currentGPA) / currentGPA) * 100;
    return parseFloat(change.toFixed(2));
}

const GradeTrendGraph = () => {
    // Hooks
    const { data } = useData();
    // States
    const [chartData, setChartData] = useState<any>(createChartData(data))
    const [latestTrend, setLatestTrend] = useState<number>(calculateLatestTrend(data));

    useEffect(() => {
        const newChartData = createChartData(data);
        setChartData(newChartData);

        const newTrend = calculateLatestTrend(data);
        setLatestTrend(newTrend);
    }, [data])

      
    return (
        <Card >
            <CardHeader>
            <CardTitle>GPA Trend</CardTitle>
            <CardDescription>
                Displays the trends in your overall grades over time
            </CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={chartData} margin={{left: 4,right: 4,}}>
                    <ChartLegend content={<ChartLegendContent className="!text-sm"/>} />
                    <CartesianGrid vertical={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent className="w-[150px]"  indicator="dot" hideLabel />} />
                    <XAxis dataKey="term" tickLine={false} axisLine={false}
                        tickMargin={8} tickFormatter={(value) => value.split(' ')[0].slice(0,1) + value.split(' ')[1].slice(2)}/>
                    <YAxis width={27} domain={[50, 100]}/>
                    <Area dataKey="termGrade" type="linear" fill="blue"
                          fillOpacity={0.4} stroke="blue"/>
                    <Area dataKey="overall" type="linear" fill="purple"
                          fillOpacity={0.4} stroke="purple"/>
                </AreaChart>
            </ChartContainer>
            </CardContent>
            <CardFooter>
            <div className="w-full flex items-center justify-center gap-2 font-medium text-base">
                
                {latestTrend > 0 && <div className="flex items-center gap-2">Trending up by {latestTrend}% this term <TrendingUp className="text-green-600 h-4 w-4" /></div>}
                {latestTrend < 0 && <div className="flex items-center gap-2">Trending down by {latestTrend}% this term <TrendingDown className="text-red-600 h-4 w-4" /></div>}
            </div>
            </CardFooter>
        </Card>
    )
}

export default GradeTrendGraph;
