import { Course } from '@/types/mainTypes';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className={`border-l-4 border-l-${course.colour}-500 !rounded-xl w-32 h-32`}>
      <CardHeader className="flex flex-col items-center justify-center w-full h-full">
        <CardTitle className="text-md font-normal text-gray-900">
            {course.course_title}
        </CardTitle>
        <CardDescription className='text-sm text-gray-500'>
            0.5 credits
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CourseCard;
