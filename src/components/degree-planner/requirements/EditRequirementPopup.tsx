import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCategory } from "@/types/degreePlanningTypes";
import { useState, useEffect } from "react";

interface EditRequirementPopupProps {
    editingRequirement: CreditCategory | null;
    isEditingRequirement: boolean;
    setIsEditingRequirement: (isEditingRequirement: boolean) => void;
    editRequirement: (updatedRequirement: CreditCategory) => boolean;
    cancelEdit: () => void;
}

const EditRequirementPopup: React.FC<EditRequirementPopupProps> = ({
    editingRequirement,
    isEditingRequirement,
    setIsEditingRequirement,
    editRequirement,
    cancelEdit
}) => {

    const [requirementName, setRequirementName] = useState("");
    const [requiredCredits, setRequiredCredits] = useState("");

    // Update form when editing requirement changes
    useEffect(() => {
        if (editingRequirement) {
            setRequirementName(editingRequirement.name);
            setRequiredCredits(editingRequirement.requiredCredits.toString());
        }
    }, [editingRequirement]);

    const resetForm = () => {
        setRequirementName("");
        setRequiredCredits("");
    }

    const handleEditRequirement = () => {
        if (!editingRequirement) return;

        // Use the hook's editRequirement function
        const success = editRequirement({
            ...editingRequirement,
            name: requirementName.trim(),
            requiredCredits: parseFloat(requiredCredits),
        });

        if (!success) {
            return;
        }

        // Reset form
        resetForm();
    }

    const handleCancel = () => {
        // Reset form and close dialog using hook
        resetForm();
        cancelEdit();
    }

    return (
        <Dialog open={isEditingRequirement} onOpenChange={setIsEditingRequirement}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Requirement</DialogTitle>
                    <DialogDescription>
                        Update the details of this degree requirement.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-requirement-name">Requirement Name</Label>
                        <Input
                            id="edit-requirement-name"
                            placeholder="e.g., Core Computer Science, Mathematics, Electives"
                            value={requirementName}
                            onChange={(e) => setRequirementName(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="edit-required-credits">Required Credits</Label>
                        <Input
                            id="edit-required-credits"
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
                    <Button onClick={handleEditRequirement}>
                        Update Requirement
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditRequirementPopup;
