// This File holds all global types used throughout the application

// Incoming Assessments from API
export type IncomingAssessments = {
    assessmentName: string,
    weight: number,
    dueDate: Date | null
}
// Incoming Schemes From API
export type IncomingScheme = {
    schemeName: string,
    assessments: IncomingAssessments[]
}
// Incoming Course Info From API
export type IncomingCourseInfo = {
    gradingSchemes: IncomingScheme[]
}
// Calendar Event for Calendar Components
export type CalendarEvent = {
  id: number;
  start: Date | null;
  end: Date | null;
  title: string;
  course: string;
  color?: 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' 
};
// Individual Assessments 
export type Assessment = {
    assessmentName: string,
    dueDate: null | string,
    weight: number,
    grade: null | number
}
// Individual Grading Schemes
export type GradingScheme = {
    schemeName: string,
    grade: number,
    assessments: Assessment[]
}
// Holds types for all courses
export type Course = {
    courseTitle: string;
    courseSubtitle: string;
    colour: 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' 
    highestGrade: number;
    gradingSchemes: GradingScheme[];
};
// Holds types for a term
export type Term = {
    term: string;
    isCompleted: boolean;
    courses: Course[];
};