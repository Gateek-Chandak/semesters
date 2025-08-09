import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { CreditCategory } from "@/types/degreePlanningTypes";

interface RequirementsTableProps {
    degreeRequirements: CreditCategory[];
    initEditRequirement: (requirement: CreditCategory) => void;
    initDeleteRequirement: (requirement: CreditCategory) => void;
}

const RequirementsTable: React.FC<RequirementsTableProps> = ({ 
    degreeRequirements, 
    initEditRequirement, 
    initDeleteRequirement 
}) => {
    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-sm font-normal">Requirement Name</TableHead>
                        <TableHead className="text-sm font-normal">Progress</TableHead>
                        <TableHead className="text-sm font-normal text-right">Credits Completed</TableHead>
                        <TableHead className="text-sm font-normal text-right">Credits Required</TableHead>
                        <TableHead className="text-sm font-normal text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {degreeRequirements.map((requirement) => {
                        const progressPercentage = requirement.requiredCredits > 0 
                                ? (requirement.completedCredits / requirement.requiredCredits) * 100 
                            : 0;
                        
                        return (
                            <TableRow key={requirement.id}>
                                <TableCell className="text-sm font-medium">
                                    {requirement.name}
                                </TableCell>
                                <TableCell className="w-48">
                                    <div className="flex items-center gap-2">
                                        <Progress 
                                            value={progressPercentage} 
                                            className="flex-1 min-w-[300px]"
                                        />
                                        <span className="text-sm text-muted-foreground min-w-[3rem]">
                                            {Math.round(progressPercentage)}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-right font-medium">
                                    {requirement.completedCredits}
                                </TableCell>
                                <TableCell className="text-sm text-right font-medium">
                                    {requirement.requiredCredits}
                                </TableCell>
                                <TableCell className="text-sm text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => initEditRequirement(requirement)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => initDeleteRequirement(requirement)}
                                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default RequirementsTable; 