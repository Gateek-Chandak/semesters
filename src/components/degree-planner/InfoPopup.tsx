import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

interface InfoPopupProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, setIsOpen }) => {
    return ( 
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="!max-w-none w-[370px] md:w-[700px] lg:w-[900px]">
                <DialogHeader>
                    <DialogTitle>Instructions</DialogTitle>
                    <DialogDescription>Use this page to track and plan the credits you need for your program!</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                   
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default InfoPopup;