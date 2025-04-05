import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useMemo } from "react"
import useData from "@/hooks/general/use-data"
import { CalculationService } from "@/services/calculationService"
import { Card } from "../ui/card"

const _calculationService = new CalculationService();

interface CircularProgressProps {
  label: string;
  description: string;
  isShowingAverage: boolean;
  setIsShowingAverage: React.Dispatch<React.SetStateAction<boolean>>;
}
  
export function CircularProgress({ isShowingAverage, setIsShowingAverage }: CircularProgressProps) {
    const { data } = useData();
    // Get user's cumulative GPA
    const percentage: number = useMemo(() => _calculationService.getCumulativeGPA(data), [data]);

  const circumference = 2 * Math.PI * 70
  const strokeDasharray = circumference
  let strokeDashoffset = circumference - (percentage / 100) * circumference
  if (percentage >= 100) {
    strokeDashoffset = circumference - (100 / 100) * circumference
  } 

  return (
    <Card className="flex flex-col lg:flex-row items-center justify-center py-2">
        <div className="mt-3 lg:mt-0 flex flex-col items-center text-center">
          <div className="relative inline-flex items-center justify-center">
            {isShowingAverage && 
              <svg className="w-60 h-40 transform -rotate-90 ">
                <circle
                  cx="120"
                  cy="79"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  className="text-muted/50"
                />
                <circle
                  cx="120"
                  cy="79"
                  r="70"
                  stroke="currentColor"
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
              <svg className="w-60 h-40 transform -rotate-90 ">
                <circle
                  cx="120"
                  cy="79"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="120"
                  cy="79"
                  r="70"
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
            {isShowingAverage && <span className="absolute text-4xl font-bold" >{percentage.toFixed(2)}%</span>}
            {!isShowingAverage && <span className="absolute text-6xl font-bold" >{'--'}</span>}
          </div>
        </div> 
        <div className="-mt-5 flex flex-col justify-center items-center h-full py-8 lg:pr-8 text-center gap-2 lg:gap-4 text-md">
            <h1 className="font-bold text-xl text-center">Cumulative GPA</h1>
            <Button onClick={() => {setIsShowingAverage(!isShowingAverage)}}
                      variant={"ghost"} className="!w-18 !h-10">
              {isShowingAverage &&<EyeOffIcon className='!w-6 !h-6'/>}
              {!isShowingAverage &&<EyeIcon className='!w-6 !h-6'/>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">*Does not include current term</p>
        </div>
    </Card>
  )
}
