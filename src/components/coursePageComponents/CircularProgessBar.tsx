import { useEffect, useState } from "react"
import useCourseGradeCalculations from "@/hooks/coursePageHooks/use-course-grade-calculations"
import { Card } from "../ui/card";

export function CircularProgress() {
  const { highestCourseGrade: percentage } = useCourseGradeCalculations();

  const circumference = 2 * Math.PI * 70
  const strokeDasharray = circumference
  let strokeDashoffset = circumference - (percentage / 100) * circumference
  if (percentage >= 100) {
    strokeDashoffset = circumference - (100 / 100) * circumference
  } 

  const [strokeColour, setStrokeColour] = useState<string>('currentColor')

  useEffect(() => {
    if (percentage == 0) {
      setStrokeColour('currentColor')
    } else if (percentage < 50) {
      setStrokeColour('red')
    } else if (percentage >= 50 && percentage < 65) {
      setStrokeColour('orange')
    } else if (percentage >= 65) {
      setStrokeColour('green')
    }
  }, [percentage])

  return (
    <Card className="w-[100%] lg:py-4 py-6 flex flex-col h-full justify-center items-center px-6">
      <div className="flex flex-col items-center text-center p-0 gap-2">
        <h3 className="text-xl font-bold">Overall Average</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-60 h-48 transform -rotate-90 ">
            <circle
              cx="120"
              cy="95"
              r="70"
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              className="text-muted/50"
            />
            <circle
              cx="120"
              cy="95"
              r="70"
              stroke={strokeColour}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray,
                strokeDashoffset,
              }}
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-4xl font-bold" style={{color: strokeColour}}>{percentage.toFixed(2)}%</span>
        </div>
        <p className='text-xs text-center mb-4 text-muted-foreground'>*note that this is an approximation, users must consult official school sources.</p>

      </div>
    </Card>

  )
}
