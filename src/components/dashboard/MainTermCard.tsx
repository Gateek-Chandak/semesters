// Hooks
import { useMemo } from "react";
// UI
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Trash2Icon, ChevronRight } from "lucide-react";
// Libraries
import { Link } from "react-router-dom";
// Types
import { Term } from "@/types/mainTypes";
// Services
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

interface MainTermCardProps {
    name: string,
    isManagingCourses: boolean;
    term: Term;
    isShowingGrades: boolean;
    setIsDeletingTerm: React.Dispatch<React.SetStateAction<boolean>>;
    isDeletingTerm: boolean;
    setTermBeingDeleted: React.Dispatch<React.SetStateAction<string>>;
}

const MainTermCard: React.FC<MainTermCardProps> = ({
    name,
    isManagingCourses,
    term,
    isShowingGrades,
    setIsDeletingTerm,
    isDeletingTerm,
    setTermBeingDeleted
}) => {
    // Term GPA
    const gpa: number = useMemo(() => _calculationService.getTermAverage(term), [term]);

    // Handle deletion of term
    const handleDelete = () => {
        setTermBeingDeleted(term.term_name)
        setIsDeletingTerm(!isDeletingTerm)
    }

    return ( 
        <Card className={`p-5 px-7 h-full ${isManagingCourses ? '' : 'transform transition-all duration-200 hover:scale-[1.015] custom-card hover:border-slate-300'}`}>
            {/* Default State */}
            {!isManagingCourses &&
                <Link to={`/home/${term.term_name.replace(' ', '-')}`} className="h-full flex flex-col justify-between gap-4">
                    <div className="flex flex-row justify-between mb-2">
                        <h1>{name}</h1>
                    </div>

                    <div className="w-full flex flex-row justify-between">
                        <h1 className="text-4xl font-medium">{term.term_name}</h1>
                        {isShowingGrades && <h1 className={`ml-0 ${(gpa === null || term.courses.length <= 0) ? "text-muted-foreground text-3xl" : "text-4xl font-medium"}`}>{(gpa === null || term.courses.length <= 0) ? 'N/A' : gpa + '%'}</h1>}
                    </div>
                    <Separator />
                    <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                </Link>}
            {/* Is Managing Courses */}
            {isManagingCourses &&
                <div className="h-full flex flex-col justify-between gap-4">
                    <div className="flex flex-row justify-between">
                        <h1>Current Term</h1>
                        {isManagingCourses && 
                        <Button variant="outline" className="ml-auto h-8 border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" onClick={handleDelete}>
                            Delete <Trash2Icon className="" />
                        </Button>}
                    </div>

                    <div className="w-full flex flex-row justify-between">
                        <h1 className="text-4xl font-medium">{term.term_name}</h1>
                    </div>
                    <Separator />
                    <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                </div>}
        </Card>
     );
}
 
export default MainTermCard;