// Types for Degree Planning Features

export type CreditCategory = {
    id: number;
    name: string;
    requiredCredits: number;
    completedCredits: number;
    coursesIds: string[];
}

export type PlannedCourse = {
    id: string;
    courseName: string; 
    credits: number;
}