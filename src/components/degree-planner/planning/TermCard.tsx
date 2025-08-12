import { Term } from '@/types/mainTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, CheckCircle } from 'lucide-react';
import CourseCard from './CourseCard';

interface TermCardProps {
  term: Term;
}

const TermCard = ({ term }: TermCardProps) => {

  return (
    <Card className="">
      <CardHeader className="pb-4">
        <div className="flex-1 flex items-start justify-between mb-2">
          <CardTitle className="text-xl font-normal text-gray-900">
            {term.term_name}
          </CardTitle>
          {term.is_completed && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 h-full hover:bg-green-100 hover:text-green-800 hover:border-green-300">
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {term.courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {term.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Add courses to this term to see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TermCard;
