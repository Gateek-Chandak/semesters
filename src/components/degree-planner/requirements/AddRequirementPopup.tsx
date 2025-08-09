import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface AddRequirementPopupProps {
    isAddingRequirement: boolean;
    setIsAddingRequirement: (isAddingRequirement: boolean) => void;
    addRequirement: (name: string, credits: number) => boolean;
}

const AddRequirementPopup: React.FC<AddRequirementPopupProps> = ({ 
    isAddingRequirement, 
    setIsAddingRequirement, 
    addRequirement, 
}) => {
    const [requirementName, setRequirementName] = useState("");
    const [requiredCredits, setRequiredCredits] = useState("");

    const resetForm = () => {
        setRequirementName("");
        setRequiredCredits("");
    }

    const handleAddRequirement = () => {

        // Use the hook's addRequirement function
        const success = addRequirement(requirementName, parseFloat(requiredCredits));

        if (!success) {
            return;
        }
        
        // Reset form
        resetForm();
    }

    const handleCancel = () => {
        // Reset form and close dialog using hook
        resetForm();
        setIsAddingRequirement(false);
    }

    return (
        <Dialog open={isAddingRequirement} onOpenChange={setIsAddingRequirement}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">Add Requirement <PlusIcon className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Requirement</DialogTitle>
                    <DialogDescription>
                        Add a new requirement to your degree plan.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="requirement-name">Requirement Name</Label>
                        <Input
                            id="requirement-name"
                            placeholder="e.g., Core Computer Science, Mathematics, Electives"
                            value={requirementName}
                            onChange={(e) => setRequirementName(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="required-credits">Required Credits</Label>
                        <Input
                            id="required-credits"
                            type="number"
                            placeholder="e.g., 15"
                            min="0"
                            step="0.5"
                            value={requiredCredits}
                            onChange={(e) => setRequiredCredits(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddRequirement}>
                        Add Requirement
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default AddRequirementPopup;