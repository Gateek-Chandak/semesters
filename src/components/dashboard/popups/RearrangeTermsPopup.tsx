// Libraries
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
// UI
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
// Redux
import { useDispatch } from "react-redux";
import { setData } from "@/redux/slices/dataSlice";
// Custom Components
import DisplayTermCard from "../DisplayTermCard";
import { useEffect, useMemo, useState } from "react";
import { Term } from "@/types/mainTypes";
import { createPortal } from "react-dom";
// Hooks
import useData from "@/hooks/general/use-data";
import useUser from "@/hooks/general/use-user";
import { useToast } from "@/hooks/general/use-toast";
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

interface RearrangeTermsPopupProps {
    isRearrangingTerms: boolean;
    setIsRearrangingTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

const RearrangeTermsPopup: React.FC<RearrangeTermsPopupProps> = ({ isRearrangingTerms, setIsRearrangingTerms }) => {
    // Inits
    const dispatch = useDispatch();
    // Hooks
    const { data } = useData();
    const { user } = useUser();
    const { toast } = useToast();
    // States
    //  values
    const [rearrangedTerms, setRearrangedTerms] = useState<Term[]>(data);
    const [movingTerm, setMovingTerm] = useState<Term | null>(null)
    
    const cachedData = data

    // Ids for sortable property
    const termIds = useMemo(() => rearrangedTerms.map((term: Term) => term.id), [rearrangedTerms]);

    useEffect(() => {
        setRearrangedTerms(data)
    }, [data])

    // Sets MovingTerm to the term that is being moved
    function onDragStart(e: DragStartEvent) {
        if (e.active.data.current?.type === "Term") {
            setMovingTerm(e.active.data.current.term)
            return;
        }
    }

    // Handles functionality when a term is placed
    function onDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        if (!over) return;
    
        // Get dragged term ID
        const activeTermId = active.id;
        const overTermId = over.id;
        if (activeTermId === overTermId) return;
    
        // Find indexes in current array
        const activeIndex = rearrangedTerms.findIndex(term => term.id == activeTermId);
        const overIndex = rearrangedTerms.findIndex(term => term.id == overTermId);
    
        // Reorder terms in the array
        const newOrderedTerms = arrayMove(rearrangedTerms, activeIndex, overIndex);
    
        // Reassign order_index to maintain sequential order
        const updatedTerms = newOrderedTerms.map((term, index) => ({
            ...term,
            order_index: index + 1 // Ensuring a continuous sequence
        }));
    
        setRearrangedTerms(updatedTerms);
    }

    async function confirmRearrange() {
        if (rearrangedTerms) {
            toast({
                variant: "default",
                title: "Rerranging Order...",
                duration: 2000
            })
            dispatch(setData(rearrangedTerms))
            console.log(rearrangedTerms)
            const response = await _apiService.updateTermOrder(user!.id, rearrangedTerms);
            if (!response) {
                dispatch(setData(cachedData));
                toast({
                    variant: "destructive",
                    title: "Error rearranging terms",
                    description: "Could not rearrange your terms.",
                    duration: 2000
                })
                return;
            }
            toast({
                variant: "success",
                title: "Rearranged Terms!",
                description: "Your terms were successfully rearranged.",
                duration: 2000
            })
        }
    }

    return ( 
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Dialog open={isRearrangingTerms} onOpenChange={setIsRearrangingTerms}>
                <DialogContent className="p-10 w-[100%] max-w-6xl h-fit max-h-[95%]">
                    <DialogHeader className="flex flex-col justify-start items-center gap-3">
                        <DialogTitle className="text-2xl">Rearrange Terms</DialogTitle>
                        <DialogDescription className={`${data == rearrangedTerms ? "text-black" : "text-red-500"}`}>
                            {data === rearrangedTerms ? "Drag and drop to rearrange" : "Changes not saved" }
                        </DialogDescription>
                        <div className="flex flex-row justify-center items-center">
                            <Button disabled={data == rearrangedTerms} onClick={confirmRearrange} className="bg-green-500 text-white hover:bg-green-400 hover:text-white">Sync</Button>
                        </div>
                        <div className="flex flex-row flex-wrap items-start justify-center gap-6 w-full h-fit max-h-full py-2 overflow-y-auto">
                            <SortableContext items={termIds}>
                                {rearrangedTerms.slice(0).reverse().map((term: Term) => ( <DisplayTermCard  typeRearrange={true} 
                                                                                                            key={term.id}
                                                                                                            term={term} 
                                                                                                            isShowingGrades={false}/>))}
                            </SortableContext>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {/* Card displayed under mouse when dragging a term */}
            {createPortal(
                <DragOverlay>
                    {movingTerm && (
                        <DisplayTermCard typeRearrange={true} 
                                         key={movingTerm.id} 
                                         term={movingTerm} 
                                         isShowingGrades={false}/>
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>

     );
}
 
export default RearrangeTermsPopup;