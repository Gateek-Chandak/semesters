import { ChangeEvent } from "react";
// UI
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
// Hooks
import { useState } from "react";
// Services
import { InputFieldValidationService } from "@/services/inputFieldValidationService";
import FormSubmitService from "@/services/formSubmitService";
const _inputFieldValidationService = new InputFieldValidationService();

interface AddSchemePopupProps {
    isAddingScheme: boolean;
    setIsAddingScheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSchemePopup: React.FC<AddSchemePopupProps> = ( {isAddingScheme, setIsAddingScheme } ) => {
    // Services
    const { createScheme } = FormSubmitService();
    // States
    //  values
    const [schemeName, setSchemeName] = useState<string>('')

    // Resets all fields
    const handleClose = ()=> {
        setIsAddingScheme(false);
        setSchemeName('')
    }

    // Manage Input Contraints
    const validateFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "schemeName":
                setSchemeName(_inputFieldValidationService.inputGradingSchemeName(value));
                return;
            default:
                return false
        }
    }

    const handleSchemeAdd = () => {
        const shouldCreateScheme = createScheme(schemeName)
        if (shouldCreateScheme) {
            handleClose();
        }
    };
    
    return ( 
        <Dialog open={isAddingScheme} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Grading Scheme</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Name *</h1>
                        <Input placeholder="ex. Grading Scheme 1" name="schemeName" value={schemeName} onChange={validateFields}></Input>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSchemeAdd}>+ Add Scheme</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default AddSchemePopup;