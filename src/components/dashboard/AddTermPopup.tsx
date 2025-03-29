// UI
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
// Hooks
import { useState } from "react";
// Services
import FormSubmitService from "@/services/formSubmitService";

interface AddTermPopupProps {
    isCreatingTerm: boolean;
    setIsCreatingTerm: React.Dispatch<React.SetStateAction<boolean>>;
}
  
const AddTermPopup: React.FC<AddTermPopupProps> = ({isCreatingTerm, setIsCreatingTerm,}) => {
    // Services
    const { createTerm } = FormSubmitService();
    // States
    //   values
    const [termName, setTermName] = useState<string>("Fall")
    const [selectedYear, setSelectedYear] = useState<number>(2025)
    const [isTermComplete, setIsTermComplete] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    // list of years to choose from
    const years = Array.from({ length: 30 }, (_, i) => 2015 + i);
        
    // reset all form values on close
    const handleClose = () => {
        setIsTermComplete(false)
        setTermName('Fall')
        setSelectedYear(2025)
        setIsCreatingTerm(!isCreatingTerm)
        setError("")
    }

    const handleCreate = async () => {
        const shouldCreateTerm = await createTerm(termName, selectedYear, isTermComplete);
        if (!shouldCreateTerm) {
            setError('This term already exists');
            return;
        }

        handleClose();
    };

    return ( 
        <Dialog open={isCreatingTerm} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Term?</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center w-full gap-6 text-sm">
                    <div className="w-full flex flex-col gap-3 font-medium text-md">
                        <h1>Term</h1>
                        <Select defaultValue="Fall" onValueChange={(value) => setTermName(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Fall" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fall">Fall</SelectItem>
                                <SelectItem value="Winter">Winter</SelectItem>
                                <SelectItem value="Spring">Spring</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full flex flex-col gap-3 font-medium text-md">
                        <h1>Year</h1>
                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-4">
                                {years.map((year) => (
                                <div key={year} >
                                    <div onClick={() => setSelectedYear(year)} className={`cursor-pointer ${selectedYear === year ? 'text-md transition-all transform scale-[1.04] pl-4 font-medium text-blue-500' : ''}`}>
                                        {year}
                                    </div>
                                    <Separator className="my-2" />
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex items-center space-x-2 mr-auto mt-5">
                        <Checkbox id="terms" onCheckedChange={() => setIsTermComplete(!isTermComplete)}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Is Term Completed?
                        </label>
                    </div>
                </div>
                <p className="text-left mt-2 text-red-600">{error}</p>
                <DialogFooter>
                    <Button onClick={handleCreate}>Add Term</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddTermPopup