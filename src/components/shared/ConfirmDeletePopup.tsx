// UI
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";

interface ConfirmDeletePopupProps {
    name?: string;
    isDeleting: boolean;
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    deleteItem: (name: any) => any;
    id?: number
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
    name,
    isDeleting,
    setIsDeleting,
    deleteItem,
    id
}) => {

    return ( 
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-2">Delete {name}?</DialogTitle>
                    <DialogDescription>Confirm delete below</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={"outline"} onClick={() => setIsDeleting(false)} className="w-full">Cancel</Button>
                    <Button variant={"destructive"} onClick={() => deleteItem(id ? id : name)} className="w-full">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default ConfirmDeletePopup;