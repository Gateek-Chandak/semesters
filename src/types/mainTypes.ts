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

// Individual Assessment
export type Assessment = {
    id: number,
    grading_scheme_id: number;
    assessment_name: string;
    due_date: string | null;
    weight: number;
    grade: number | null;
};

// Individual Grading Scheme
export type GradingScheme = {
    id: number,
    course_id: number;
    scheme_name: string;
    grade: number;
    assessments: Assessment[];
};

// Holds types for all courses
export type Course = {
    id: number,
    term_id: number;
    course_title: string;
    course_subtitle: string;
    colour: 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red';
    highest_grade: number;
    grading_schemes: GradingScheme[];
};

// Holds types for a term
export type Term = {
    id: number,
    user_id: number;
    term_name: string;
    is_completed: boolean;
    start_date: string;
    end_date: string;
    order_index: number;
    courses: Course[];
};
