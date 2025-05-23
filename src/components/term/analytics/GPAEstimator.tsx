// UI
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Slider } from "../../ui/slider";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
// Types
import { Course, Term } from "@/types/mainTypes";
// Services
import { CalculationService } from "@/services/calculationService";
// Hooks
import useData from "@/hooks/general/use-data";
import useTermGrade from "@/hooks/term/use-term-grade";
import { Input } from "@/components/ui/input";
const _calculationService = new CalculationService();

const GPAEstimator = () => {
    // Hooks
    const  { termData, data } = useData();
    const termGrade = useTermGrade();
    // State
    //  values
    const [courseOptions, setCourseOptions] = useState<Course[]>(termData!.courses)
    const [estimatedTermGrade, setEstimatedTermGrade] = useState<number>(termGrade);
    const [estimatedOverallGrade, setEstimatedOverallGrade] = useState<number>(_calculationService.getProjectedCumulativeGPA(data));
    const [selectedIds, setSelectedIds] = useState<number[]>(termData!.courses.map((course: Course) => { return course.id }));

    // Listener for termData upgrades
    useEffect(() => {
        setCourseOptions(termData!.courses);
        setSelectedIds(termData!.courses.map((course: Course) => { return course.id }));
        setEstimatedTermGrade(termGrade);
        setEstimatedOverallGrade(_calculationService.getProjectedCumulativeGPA(data));
    }, [data, termData])

    const resetValues = () => {
        setCourseOptions(termData!.courses);
        setEstimatedTermGrade(termGrade);
        setEstimatedOverallGrade(_calculationService.getProjectedCumulativeGPA(data));
        setSelectedIds(termData!.courses.map((course: Course) => { return course.id }));
    }

    // TODO: Implement debouncing so that it doesnt update on every change
    const calculateEstimatedGrades = (ids: number[], courses: Course[]) => {
        const selectedCourses = courses.filter((course: Course) => {
            return ids.includes(course.id);
        })

        // Calculate Estimated Term Grade
        const estimatedTermGrade = _calculationService.getTermAverage({...termData!, courses: selectedCourses});
        setEstimatedTermGrade(estimatedTermGrade);

        // Calculate Estimated Course Grade
        const newData = data.map((term: Term) => {
            if (term.id == termData!.id) {
                return { ...term, courses: selectedCourses };
            }
            return term;
        })
        const estimatedOverallGrade = _calculationService.getProjectedCumulativeGPA(newData);
        setEstimatedOverallGrade(estimatedOverallGrade);
    }   

    // Checkbox change event
    const handleCheckboxChange = (event: any, id: number) => {
        let newSelectedIds = [];
        if(event){
            newSelectedIds = [...selectedIds, id];
            setSelectedIds([...selectedIds, id])
        }else{
            newSelectedIds = selectedIds.filter((selectedId: number) => selectedId !== id);
            setSelectedIds(selectedIds.filter((selectedId: number) => selectedId !== id))
        }

        calculateEstimatedGrades(newSelectedIds, courseOptions);
    }

    // Slider change event
    const handleSliderChange = (e: any, id: number) => {
        if (!Array.isArray(e) && (Number(e) < 0 || Number(e) > 110)) {
            return;
        }
        const newCourseOptions = courseOptions.map((course: Course) => {
            if (course.id == id) {
                return { ...course, highest_grade: Array.isArray(e) ? e[0] : e}
            } 
            return course
        });
        setCourseOptions(newCourseOptions);

        calculateEstimatedGrades(selectedIds, newCourseOptions);
    }

    return ( 
        <Card className="w-full">
            <CardHeader className="flex flex-col items-center sm:items-stretch space-y-0 border-b p-0 pb-2 sm:p-0 sm:flex-row">
                <div className="flex flex-1 flex-col items-center sm:items-start justify-center gap-1 px-4 py-4">
                    <CardTitle className="text-xl">GPA Estimator</CardTitle>
                    <CardDescription className="flex flex-col items-center sm:items-start gap-2">
                        Use the sliders to estimate your gpa's.
                        <Button variant={'outline'} onClick={() => resetValues()} className="!text-xs !w-fit text-black">
                            Reset <RotateCcw />
                        </Button>
                    </CardDescription>
                </div>
                <div className="flex flex-col justify-center items-center gap-1 px-6 sm:border-l sm:border-t-0 sm:px-4 sm:py-6">
                    <span className="text-sm text-center text-muted-foreground">
                        Estimated {termData!.term_name.split(' ')[0].slice(0, 1) + ' ' + termData!.term_name.split(' ')[1].slice(2)} GPA
                    </span>
                    <span className="text-lg text-center font-bold leading-none sm:text-2xl">
                        {estimatedTermGrade.toFixed(2)}%
                    </span>
                </div>
                <div className="flex flex-col justify-center items-center gap-1 px-6 py-4 even:border-l sm:border-l sm:border-t-0 sm:px-4 sm:py-6">
                    <span className="text-sm text-center text-muted-foreground">
                        Estimated Overall GPA
                    </span>
                    <span className="text-lg text-center font-bold leading-none sm:text-2xl">
                        {estimatedOverallGrade.toFixed(2)}%
                    </span>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-4 flex flex-col gap-[22.4px]">
                {courseOptions.length <= 0 && <h1 className="text-center py-5">No courses found.</h1>}
                {courseOptions.map((course: Course) => {
                    return (
                        <div key={course.id} className="flex flex-col gap-2 justify-between">
                            <div className="w-fit whitespace-nowrap flex items-center space-x-2">
                                <Checkbox value={course.id} 
                                          checked={selectedIds.includes(course.id)} 
                                          onCheckedChange={(e) => handleCheckboxChange(e, course.id)}
                                          id={course.id.toString()} />
                                <label htmlFor={course.id.toString()} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    {course.course_title}
                                </label>
                            </div>
                            <div className="flex flex-row justify-between">
                                <Slider className="w-[75%]" onValueChange={(e) => handleSliderChange(e, course.id)} value={[course.highest_grade]} max={100} step={0.1} />
                                {/* <h1 className="text-lg w-[20%] text-center">{course.highest_grade}%</h1> */}
                                <Input className="w-20" type="number" value={course.highest_grade} onChange={(e) => handleSliderChange(Number(e.target.value), course.id)}/>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
     );
}
 
export default GPAEstimator;