import { Link } from "react-router-dom";

import { Course } from "@/types/mainTypes";

import { useParams } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  gradesShown: boolean;
  isCompleted: boolean
}

const DisplayCourseCard: React.FC<CourseCardProps> = ({ course, gradesShown, isCompleted }) =>  {
    const { term } = useParams()

    if (!isCompleted) {
        return ( 
        <Link key={course.courseTitle} to={`/home/${term?.replace(/\s+/g, '-')}/${course.courseTitle.replace(/\s+/g, '-')}`} className="">
            <div style={{//@ts-expect-error no clue
                    '--text-color': course.colour,}}
                className={`h-40 w-40 custom-card transform transition-all duration-200 hover:scale-[1.04] hover:border-[var(--border-color)] hover:text-[var(--text-color)]`}>
                <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                    {!gradesShown && <h1 className="text-2xl">{course.courseTitle.split(' ')[0]}</h1>}
                    {gradesShown && <h1 className="text-xl">{course.courseTitle}</h1>}
                    {!gradesShown && <h1 className="text-4xl font-medium">{course.courseTitle.split(' ')[1]}</h1>}
                    {gradesShown && <h1 className="text-3xl font-medium">{course.highestGrade}%</h1>}
                </div>
            </div>
        </Link>
    )} else {
        return ( 
        <div key={course.courseTitle} className="h-40" >
            <div className={`custom-card h-40 w-40`}>
                <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                    {!gradesShown && <h1 className="text-2xl">{course.courseTitle.split(' ')[0]}</h1>}
                    {gradesShown && <h1 className="text-xl">{course.courseTitle}</h1>}
                    {!gradesShown && <h1 className="text-4xl font-medium">{course.courseTitle.split(' ')[1]}</h1>}
                    {gradesShown && <h1 className="text-3xl font-medium">{course.highestGrade}%</h1>}
                </div>
            </div>
        </div>
    )};
}
 
export default DisplayCourseCard;