// Hooks
import { useMemo } from "react";
// Libraries
import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
// Types
import { Term } from "@/types/mainTypes";
// Services
import { CalculationService } from "@/services/calculationService";

const _calculationService = new CalculationService();

interface DisplayTermCardProps {
  term: Term;
  isShowingGrades: boolean;
  typeRearrange?: boolean; // Indicates whether or not this component is being used to rearrange terms
}

const DisplayTermCard: React.FC<DisplayTermCardProps> = ({ term, isShowingGrades, typeRearrange }) => {
  // Values
  const termGPA: number = useMemo(() => _calculationService.getTermAverage(term), [term]);

  // Init all values needed for DND functionality
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: term.term,
    data: {
      type: "Term",
      term
    },
  })
  // style for components involved in DND
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  // Empty square template that displays when you hover over a spot
  if (isDragging && typeRearrange) {
    return <div ref={setNodeRef} style={style} className="hover:cursor-grab border-2 border-dashed bg-gray-50 border-gray-300 rounded-2xl scale-[1.02]">
              <div className="md:h-32 md:w-32 h-20 w-20 text-gray-300 flex flex-row justify-center items-center">
                place here
              </div>
           </div>
  }

  return (
    <Link to={typeRearrange ? '' : `/home/${term.term}`} className="">
        {/* Used in the RearrangeTermsPopup component */}
        {!isShowingGrades && typeRearrange &&
            <div ref={setNodeRef} style={style}
                 className={`${typeRearrange ? 'hover:cursor-grab': ''} custom-card transform transition-all duration-200 hover:scale-[1.04] hover:shadow-sm hover:border-slate-300`}>
                <div {...attributes}
                     {...listeners} 
                     className="md:h-32 md:w-32 h-20 w-20 flex flex-col justify-center gap-1 items-center">
                    <h1 className='md:text-3xl text-xl'>{term.term.split(' ')[0]}</h1>
                    {term.term.split(' ').length > 1 && <h1 className='md:text-4xl text-3xl font-medium'>‘{term.term.split(' ')[1].slice(-2)}</h1>}
                </div>
            </div>}
        {/* Used in the DashboardPage for default view */}
        {!isShowingGrades && !typeRearrange &&
          <div className="custom-card hover:border-slate-300 transform transition-all duration-200 hover:scale-[1.04]">
                  <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                      <h1 className='text-3xl'>{term.term.split(' ')[0]}</h1>
                      {term.term.split(' ').length > 1 && <h1 className='text-4xl font-medium'>‘{term.term.split(' ')[1].slice(-2)}</h1>}
                  </div>
          </div>}
        {/* Used in the DashboardPage for showing grades view */}
        {isShowingGrades && !typeRearrange &&
          <div className="custom-card transform transition-all duration-200 hover:scale-[1.04]">
                  <div className="h-40 w-40 flex flex-col justify-center gap-4 items-center">
                      <h1 className='text-2xl'>{term.term}</h1>
                      <h1 className={`${(termGPA === null || term.courses.length <= 0) ? "text-muted-foreground text-3xl" : "text-4xl font-medium"}`}>{(termGPA === null || term.courses.length <= 0) ? 'N/A' : parseFloat(termGPA?.toFixed(2)) + '%'}
                      </h1>
                  </div>
          </div>}
    </Link>
  );
};

export default DisplayTermCard;