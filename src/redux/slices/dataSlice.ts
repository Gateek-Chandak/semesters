// This Slice handles and monitors all changes relating to term data

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, Course, GradingScheme, Term } from '@/types/mainTypes';

// Type for Term Data
interface DataState {
  data: Term[];
  error: string | null;
}
// Initial State for Term Data
const initialState: DataState = {
    data: [],
    error: null
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // Sets data state
        setData(state, action: PayloadAction<Term[]>) {
            state.data = action.payload;
        },
        // Add a single term    
        addTerm(state, action: PayloadAction<{ term: Term }>) {
          const { term } = action.payload;
          const duplicateTerm = state.data.find((t: Term) => t.id == term.id)
          if (term && !duplicateTerm) {
              state.data = [...state.data, term];
          }
        },            
        // Update a Term
        updateTerm(state, action: PayloadAction<{ term: string; courses: Course[] }>) {
            const { term, courses } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
            if (termIndex !== -1) {
              state.data[termIndex].courses = courses;
            }
        },
        // Update name of a course
        updateCourseName(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
            const { term, courseIndex, course } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
            if (termIndex !== -1) {
                const repeatedCourseTitle = state.data[termIndex].courses.find(
                  (c: Course) => c.course_title.toLowerCase() === course.course_title.toLowerCase()
                )
                if  (repeatedCourseTitle) {
                  return;
                }
                state.data[termIndex].courses[courseIndex] = course;
            }
        },
        // Update subtitle for a course
        updateCourseSubtitle(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Update course grade for a completed term
        updateCompletedCourseGrade(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Modify a course
        updateCourse(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Modify a scheme
        updateScheme(state, action: PayloadAction<{ term: string; courseIndex: number; schemeIndex: number, scheme: GradingScheme }>) {
          const { term, courseIndex, schemeIndex, scheme } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
          
          if (termIndex !== -1) {
            // Ensure immutable updates with spread operator
            const updatedCourses = [...state.data[termIndex].courses];
            const updatedGradingSchemes = [
              ...updatedCourses[courseIndex].grading_schemes.slice(0, schemeIndex),
              scheme,
              ...updatedCourses[courseIndex].grading_schemes.slice(schemeIndex + 1)
            ];
            
            updatedCourses[courseIndex] = {
              ...updatedCourses[courseIndex],
              grading_schemes: updatedGradingSchemes
            };
            
            // Update state with new course data
            state.data[termIndex] = {
              ...state.data[termIndex],
              courses: updatedCourses
            };
          }
        },
        // Add a course
        addCourse(state, action: PayloadAction<{ term_id: number; course: any }>) {
          const { term_id, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);

          if (termIndex !== -1) {
              const existingCourse = state.data[termIndex].courses.find((c: Course) => c.course_title.toLowerCase() === course.course_title.toLowerCase());

              if (existingCourse) {
                  console.warn(`Course "${course.course_title}" already exists in term ID ${term_id}`);
                  return;
              }

              state.data[termIndex].courses = [
                  ...state.data[termIndex].courses,
                  course,
              ];

              console.log(`Added course "${course.course_title}" to term ID ${term_id}`);
          }
        },
        // Delete a course
        deleteCourse(state, action: PayloadAction<{ term_id: number; courseId: number }>) {
            const { term_id, courseId } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
            if (termIndex !== -1) {
                state.data[termIndex].courses = [
                  ...state.data[termIndex].courses.filter((course: Course) => course.id != courseId)
                ]
            }
        },
        // Update an assessment
        updateAssessment(state, action: PayloadAction<{ term: string; courseIndex: number; schemeIndex: number; assessmentIndex: number; assessment: Assessment }>) {
            const { term, courseIndex, schemeIndex, assessmentIndex, assessment } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term_name === term);
            if (termIndex !== -1) {
                state.data[termIndex].courses[courseIndex].grading_schemes[schemeIndex].assessments[assessmentIndex] = assessment;
            }
        },
    }
});

export const { setData, updateCourse, updateScheme, addCourse, deleteCourse, updateAssessment, updateTerm, updateCourseName, updateCourseSubtitle, addTerm, updateCompletedCourseGrade } = dataSlice.actions;

export default dataSlice.reducer;
