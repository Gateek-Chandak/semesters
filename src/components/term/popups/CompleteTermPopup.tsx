// UI
import { Dialog,
    DialogHeader,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogDescription
   } from "../../ui/dialog";
import { Button } from "../../ui/button";
// Redux
import { updateTerm } from "@/redux/slices/dataSlice";
// Hooks
import { useToast } from "@/hooks/general/use-toast";
import useData from "@/hooks/general/use-data";
import { useDispatch } from "react-redux";
import useUser from "@/hooks/general/use-user";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

interface CompleteTermPopupPopupProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompleteTermPopup: React.FC<CompleteTermPopupPopupProps> = ( {visible, setVisible} ) => {
    // inits
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { termData } = useData();
    const { user } = useUser();

    const deleteSchemesAndAssessments = async () => {
        await _apiService.deleteStudyLogs(termData!.id);
        await _apiService.deleteAllGradingSchemes(termData!.id)
    }

    const completeTerm = async (is_completed: boolean) => {
        const updatedTerm = { ...termData!, is_completed }

        try {
            toast({
                variant: "default",
                title: "Updating...",
                duration: 3000
            })
            const response = await _apiService.updateTerm(user!.id, updatedTerm);
            toast({
                variant: "success",
                title: "Update Successful!",
                description: response.term_name + ' was updated',
                duration: 3000
            })
            await deleteSchemesAndAssessments();
            dispatch(updateTerm({
                term_id: termData!.id,
                term: updatedTerm
            }))
        } catch {
            toast({
                variant: "destructive",
                title: "Update Unsuccessful",
                description: termData!.term_name + ' was unable to be updated.',
                duration: 3000
            })
        } finally {
            setVisible(false);
        }
    }

    return ( 
    <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-lg">Complete Term?</DialogTitle>
                <DialogDescription className="text-md text-red-500">This action is irreversible and all Grading Schemes, Deliverables, and Study Hour Logs will be deleted. Only your course names and grades will remain.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5 !w-full !flex !flex-row !justify-between">
                <Button className="bg-red-600 hover:bg-red-700 text-white flex-1" onClick={() => setVisible(false)}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={() => completeTerm(true)}>Confirm</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    );
}

export default CompleteTermPopup;