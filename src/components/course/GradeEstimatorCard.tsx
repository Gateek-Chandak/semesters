import { ChangeEvent, useEffect, useState } from "react";
// UI
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
// Hooks
import useData from "@/hooks/general/use-data";
// Services
import { CalculationService } from "@/services/calculationService";
const _calculationService = new CalculationService();

const GradeEstimatorCard = () => {
    // Hooks
    const { courseData } = useData();
    // States
    //  values
    const [targetGrade, setTargetGrade] = useState<number | null>(null)
    const [gradeNeeded, setGradeNeeded] = useState<number | null>(null)
    const grades = [100, 90, 80, 70, 60, 50]

    // Used to update the desired grade component
    const updateTargetGrade = (e: ChangeEvent<HTMLInputElement>) => {
        // Parse input
        const parsedValue = parseFloat(parseFloat(e.target.value).toFixed(2)); 
        // Validate input: must be a number between 0 and 1000
        if (parsedValue < 0 || parsedValue > 1000) {
            return;
        }
        setTargetGrade(isNaN(parsedValue) ? null : parsedValue);
    
        handleSetGradeNeeded(parsedValue);
    };    
    

    // Used to update target grade and grade needed UI card
    const gradeButtonAction = (grade: number) => {
        setTargetGrade(grade)
        if (courseData && courseData.grading_schemes.length <= 0) {
            return;
        }

        handleSetGradeNeeded(grade);
    }

    useEffect(() => {
        handleSetGradeNeeded(targetGrade)
    }, [courseData])

    const handleSetGradeNeeded = (grade: any) => {
        let minGradeNeeded: number | null = _calculationService.calculateMinGradeNeeded(grade, courseData);
        if (minGradeNeeded == null) {
            setGradeNeeded(null);
            return;
        } 
        setGradeNeeded(isNaN(minGradeNeeded) ? null : Math.max(0, parseFloat(minGradeNeeded.toFixed(2))));
    }

    return ( 
        <Card className="w-[100%] px-6 py-4">
            <div className="flex flex-col h-full gap-3 justify-center">
                <div className="flex flex-col gap-2 justify-center">
                    <label className="text-sm font-bold">Enter Specific Grade (%)</label>
                    <Input  type="number"
                            value={targetGrade || targetGrade == 0 ? targetGrade : ""} 
                            onChange={updateTargetGrade}
                            placeholder="%" 
                            className="w-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {grades.map((grade) => (
                    <Button
                        key={grade}
                        className={`!text-md text-center rounded-md border ${grade == targetGrade ? 'bg-black text-white' : 'bg-white  text-black'} hover:bg-black hover:text-white active:bg-gray-700`}
                        onClick={() => gradeButtonAction(grade)}
                    >
                        {grade}%
                    </Button>
                    ))}
                </div>
                <h3 className="font-bold text-sm">Desired Average</h3>
                <p className="text-xs">To get <span className="font-bold">{targetGrade}%</span> in this class, you need to average of <span className='font-bold'>{gradeNeeded}%</span> on everything that's left.</p>
                <p className='text-xs text-muted-foreground'>
                    *note that this value is an approximation using best case scenario
                </p>
            </div>
        </Card>
     );
}
 
export default GradeEstimatorCard;