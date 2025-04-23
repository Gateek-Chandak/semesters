import { Button } from '../ui/button';
import { Trash2Icon } from 'lucide-react';

import { Term } from "@/types/mainTypes";

interface EditTermCardProps {
  term: Term;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setTermBeingDeleted: React.Dispatch<React.SetStateAction<number>>;
}

const EditTermCard: React.FC<EditTermCardProps> = ({ term, isDeleting, setIsDeleting, setTermBeingDeleted }) => {

    const handleDelete = () => {
        setTermBeingDeleted(term.id)
        setIsDeleting(!isDeleting)
    }

    return (
        <div className="custom-card h-40 w-40 flex flex-col justify-between gap-4 items-center py-8">
            <h1 className='text-xl'>{term.term_name}</h1>
            <Button variant="outline" className="h-10 border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" onClick={handleDelete}>
                Delete <Trash2Icon className="" />
            </Button>
        </div>
    );
};

export default EditTermCard;