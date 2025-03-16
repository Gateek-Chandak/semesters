import { Card } from "./ui/card";

interface MetricCardProps {
    value: any,
    description_bold: string,
    description_nonbold: string
}

const MetricCard: React.FC<MetricCardProps> = ( { value, description_bold, description_nonbold } ) => {
    return ( 
        <Card className="w-full h-full py-10 px-10 flex flex-row gap-6 justify-center lg:justify-start items-center">
            <h1 className="text-5xl font-semibold">{value}</h1>
            <p className="font-light text-sm"><span className="font-bold">{description_bold}</span> {description_nonbold}</p>
        </Card>
     );
}
 
export default MetricCard;