// UI
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
// Hooks
import { useState, useEffect } from "react"
import useTermGrade from "@/hooks/termPageHooks/use-term-grade";

  export function CircularProgress({ }) {
    // Hooks
    const termGrade = useTermGrade();
    // States
    //  conditionals
    const [isShowingAverage, setIsShowingAverage] = useState<boolean>(false)

    const circumference = 2 * Math.PI * 75
    const strokeDasharray = circumference
    let strokeDashoffset = circumference - (termGrade / 100) * circumference
    if (termGrade >= 100) {
      strokeDashoffset = circumference - (100 / 100) * circumference
    }

    const [strokeColour, setStrokeColour] = useState<string>('currentColor')

    useEffect(() => {
      if (termGrade <= 0) {
        setStrokeColour('currentColor')
      } else if (termGrade < 50) {
        setStrokeColour('red')
      } else if (termGrade >= 50 && termGrade < 65) {
        setStrokeColour('orange')
      } else if (termGrade >= 65) {
        setStrokeColour('green')
      }
    }, [termGrade])
  
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative inline-flex items-center justify-center">
          {isShowingAverage && 
            <svg className="w-60 h-48 transform -rotate-90 ">
              <circle
                cx="120"
                cy="95"
                r="75"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-muted/50"
              />
              <circle
                cx="120"
                cy="95"
                r="75"
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
            </svg>}
          {!isShowingAverage &&
            <svg className="w-60 h-48 transform -rotate-90 ">
              <circle
                cx="120"
                cy="95"
                r="75"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="120"
                cy="95"
                r="75"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDashoffset,
                }}
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>}
          {isShowingAverage && <span className="absolute text-4xl font-bold" style={{color: strokeColour}}>{termGrade.toFixed(2)}%</span>}
          {!isShowingAverage && <span className="absolute text-6xl font-bold" style={{color: 'black'}}>{'--'}</span>}
        </div>
        <Separator className="!w-[70%]" />
        <div className="flex flex-row justify-center items-center gap-6">
          <h3 className="text-sm font-medium">Term Average</h3>
          <Button onClick={() => {setIsShowingAverage(!isShowingAverage)}}
                    variant={"ghost"}>
            {isShowingAverage &&<EyeOffIcon className='!w-6 !h-6'/>}
            {!isShowingAverage &&<EyeIcon className='!w-6 !h-6'/>}
          </Button>
        </div>
      </div> 
    )
  }
  