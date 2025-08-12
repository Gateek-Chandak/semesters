import { Calendar } from 'lucide-react';
import TermCard from './TermCard';
import useData from '@/hooks/general/use-data';

const PlanningGrid = () => {
    const { data: terms } = useData();

    // If no terms are available, show a message
    if (!terms || terms.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No terms available</h3>
                <p className="text-gray-500">Create terms in your dashboard to start planning</p>
            </div>
        );
    }

    // If terms are available, show the planning grid
    return (
        <div className="space-y-8">
            {/* Terms Grid */}
            <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                {terms.slice(0).reverse().map((term) => (
                    <TermCard key={term.id} term={term} />
                ))}
            </div>
        </div>
    );
};

export default PlanningGrid;
