import useData from "@/hooks/general/use-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Button } from "../ui/button";
import AddSchemePopup from "./AddSchemePopup";
import {useState } from "react";

import EditGradingSchemeCard from "./EditGradingSchemeCard";
import DisplayGradingSchemeCard from "./DisplayGradingSchemeCard";

const DeliverablesCard = ( ) => {
    // Hooks
    const { courseData } = useData();
    // States
    //  conditionals
    const [isAddingScheme, setIsAddingScheme] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    return ( 
        <Carousel className="w-full">
            <CarouselContent>
                {courseData && (courseData.grading_schemes.length > 0) && courseData.grading_schemes.map((scheme, index) => (
                    isEditing ? <EditGradingSchemeCard key={scheme.id} schemeIndex={index} setIsEditing={setIsEditing} scheme={scheme}/> : 
                                <DisplayGradingSchemeCard key={scheme.id} setIsEditing={setIsEditing} scheme={scheme} />))}
                {courseData && (courseData.grading_schemes.length <= 0) && 
                    <CarouselItem className='min-h-[41rem] custom-card'>
                        <div className='ml-auto flex flex-row justify-end pr-6 relative py-6 gap-3'>                               
                            {!isEditing && <Button variant={'default'} className='' onClick={() => setIsAddingScheme(true)}>+ Add New Grading Scheme</Button>}
                        </div>
                        <h1 className='text-2xl font-light text-center mt-52'>No Deliverables Found.</h1>
                    </CarouselItem>}
            </CarouselContent>
            {courseData && !isEditing && (courseData.grading_schemes.length > 1) && <CarouselPrevious />}
            {courseData && !isEditing && (courseData.grading_schemes.length > 1) && <CarouselNext /> }
            {courseData && <AddSchemePopup isAddingScheme={isAddingScheme} setIsAddingScheme={setIsAddingScheme} />}
        </Carousel>
     );
}
 
export default DeliverablesCard;