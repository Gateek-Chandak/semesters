import { Card } from "../ui/card";
import useCourseGradeCalculations from "@/hooks/course/use-course-grade-calculations";

const MaxMinCard = ( ) => {
    const { minGradePossible, maxGradePossible } = useCourseGradeCalculations();
    return ( 
        <Card className="w-[100%] py-8 px-6 flex flex-col justify-between items-start gap-4 md:gap-10 col-span-1">
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h1 className="mr-auto text-md font-bold">Minimum</h1>
                    <h1 className="ml-auto text-md font-bold">{minGradePossible}%</h1>
                </div>
                <p className="text-sm font-light">Assuming that you uninstall LEARN and doom scroll for the rest of the term.</p>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h1 className="mr-auto text-md font-bold">Maximum</h1>
                    <h1 className="ml-auto text-md font-bold">{maxGradePossible}%</h1>
                </div>
                <p className="text-sm font-light">Given that you score 100% on everything remaining.</p>
            </div>
            <p className="text-xs text-muted-foreground">
                *if multiple grading schemes are availble, metrics will be estimated using worst/best case possibilities respectively.
            </p>
        </Card>
     );
}
 
export default MaxMinCard;