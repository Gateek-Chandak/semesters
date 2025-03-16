// UI
import { PencilIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CarouselItem } from "../ui/carousel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AddDeliverablePopup from "./AddDeliverablePopup";
import AddSchemePopup from "./AddSchemePopup";
// Hooks
import { useState } from "react";
import useData from "@/hooks/use-data";
// Types
import { GradingScheme } from "@/types/mainTypes";
import { format } from "date-fns";

interface DisplayGradingSchemeCardProps {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    scheme: GradingScheme;
}

const DisplayGradingSchemeCard: React.FC<DisplayGradingSchemeCardProps> = ( { setIsEditing, scheme } ) => {

    const { courseData } = useData();

    const [isAddingScheme, setIsAddingScheme] = useState<boolean>(false)
    const [isAddingDeliverable, setIsAddingDeliverable] = useState<boolean>(false)

    return ( 
        <CarouselItem className="pt-5 custom-card flex flex-col gap-8">
            <div className='w-full pr-7 flex flex-row justify-between items-center gap-3'>
                <h1 className={`mr-auto text-left ${courseData!.gradingSchemes.length > 1 ? "relative left-20 top-1" : "ml-3" } text-lg font-medium`}>{scheme.schemeName}</h1>
                <Button className='bg-white text-black border-2 border-black hover:bg-gray-100' onClick={() => setIsEditing((prev: boolean) => !prev)}>
                        Edit<PencilIcon/>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default">+ Add</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 flex flex-col gap-1">
                        <DropdownMenuItem>
                            <Button variant={'ghost'} className='w-full' onClick={() => setIsAddingDeliverable(true)}><h1 className='w-full text-left'>+ Add New Deliverable</h1></Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Button variant={'ghost'} className='w-full' onClick={() => setIsAddingScheme(true)}><h1 className='w-full text-left'>+ Add New Grading Scheme</h1></Button>
                        </DropdownMenuItem>                                                  
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="h-[33.5rem] overflow-y-auto" >
                <Table className="mb-4">
                    <TableHeader className=''>
                        <TableRow className=''> 
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Due Date</TableHead>
                            <TableHead className="text-center">Weight</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=''>
                        {scheme.assessments.map((assessment, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="text-center w-[25%]">{assessment.assessmentName}</TableCell>
                                    <TableCell className="text-center w-[25%]">{assessment.dueDate ? format(assessment.dueDate, `MMMM dd, yyyy '@' hh:mma`) : 'TBD'}</TableCell>
                                    <TableCell className="text-center w-[25%]">{assessment.weight}</TableCell>
                                    <TableCell className="text-center w-[25%]">{(assessment.grade === 0 || assessment.grade) ? assessment.grade : ""}</TableCell>
                                </TableRow>)})}
                    </TableBody> 
                </Table>
            </div>
            {/* Popups */}
            <AddDeliverablePopup isAddingDeliverable={isAddingDeliverable} setIsAddingDeliverable={setIsAddingDeliverable} />
            <AddSchemePopup isAddingScheme={isAddingScheme} setIsAddingScheme={setIsAddingScheme} />
        </CarouselItem>
     );
}
 
export default DisplayGradingSchemeCard;