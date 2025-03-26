// Libraries
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
// UI
import { Button } from "../ui/button";
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
import DisplayTermCard from "./DisplayTermCard";
import { useEffect, useMemo, useState } from "react";
import { Term } from "@/types/mainTypes";
import { createPortal } from "react-dom";
// Hooks
import useData from "@/hooks/general/use-data";

interface RearrangeTermsPopupProps {
    isRearrangingTerms: boolean;
    setIsRearrangingTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

const RearrangeTermsPopup: React.FC<RearrangeTermsPopupProps> = ({ isRearrangingTerms, setIsRearrangingTerms }) => {
    // Inits
    const dispatch = useDispatch();
    // Hooks
    const { data } = useData();
    // States
    //  values
    const [rearrangedTerms, setRearrangedTerms] = useState<Term[]>(data);
    const [movingTerm, setMovingTerm] = useState<Term | null>(null)
    // Ids for sortable property
    const termIds = useMemo(() => rearrangedTerms.map((term: Term) => term.term_name), [rearrangedTerms]);

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
        // if drop has not happened yet
        if (!over) {
            return;
        }
        // get the terms that are involved
        const activeTerm = active.id;
        const overTerm = over.id;
        // if term is placed in its original spot
        if (activeTerm === overTerm) {
            return;
        }
        // extract the indexes
        const activeTermIndex = rearrangedTerms.findIndex(
            (term) => term.term_name == activeTerm
        )
        const overTermIndex = rearrangedTerms.findIndex(
            (term) => term.term_name == overTerm
        )
        // dispatch action to finalize move
        const newTerms = arrayMove(rearrangedTerms, activeTermIndex, overTermIndex)
        setRearrangedTerms(newTerms);
    }

    function confirmRearrange() {
        if (rearrangedTerms) {
            dispatch(setData(rearrangedTerms))
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
                                                                                                            key={term.term_name}
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
                                         key={movingTerm.term_name} 
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