import { Card } from "../ui/card";

interface FacultyCardProps {
    colour: string,
    title: string,
    position: string
}

const FacultyCard: React.FC<FacultyCardProps> = ({colour, title, position}) => {
    return ( 
        <Card className={`absolute !rounded-lg px-4 py-2 text-gray-300 ${position}`} style={{ backgroundColor: colour, opacity: 0.28}}>
            {title}
        </Card>
     );
}
 
export default FacultyCard;