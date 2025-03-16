// This Slice handles and monitors all changes relating to term data

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, Course, GradingScheme, Term } from '@/types/mainTypes';
// Services
import { APIService } from '@/services/apiService';
const _apiService = new APIService();

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
        // Add an array of terms
        addTerms(state, action: PayloadAction<{ terms: Term[] }>) {
          const { terms } = action.payload;
      
          if (terms) {
              const combinedTerms = [
                  ...terms.filter(newTerm => !state.data.some((existingTerm: Term) => existingTerm.term === newTerm.term)),
                  ...state.data
              ];
              state.data = combinedTerms; 
          }
        },   
        // Add a single term    
        addTerm(state, action: PayloadAction<{ term: Term }>) {
          const { term } = action.payload;
          if (term) {
              // Ensure the state is updated immutably by spreading the previous state and adding the new term
              state.data = [...state.data, term];
          }
        },            
        // Update a Term
        updateTerm(state, action: PayloadAction<{ term: string; courses: Course[] }>) {
            const { term, courses } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term === term);
            if (termIndex !== -1) {
              state.data[termIndex].courses = courses;
            }
        },
        // Update name of a course
        updateCourseName(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
            const { term, courseIndex, course } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term === term);
            if (termIndex !== -1) {
                const repeatedCourseTitle = state.data[termIndex].courses.find(
                  (c: Course) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase()
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
          const termIndex = state.data.findIndex((t: Term) => t.term === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Update course grade for a completed term
        updateCompletedCourseGrade(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Modify a course
        updateCourse(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        // Modify a scheme
        updateScheme(state, action: PayloadAction<{ term: string; courseIndex: number; schemeIndex: number, scheme: GradingScheme }>) {
          const { term, courseIndex, schemeIndex, scheme } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex].gradingSchemes[schemeIndex] = scheme;
          }
        },
        // Add a course
        addCourse(state, action: PayloadAction<{ term: string; course: Course }>) {
          const { term, course } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.term === term);

          if (termIndex !== -1) {
              const existingCourse = state.data[termIndex].courses.find(
                  (c: Course) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase() // Case insensitive comparison
              );
              if (existingCourse) {
                  return;  
              }
              state.data[termIndex].courses.push(course);
          }
        },
        // Delete a course
        deleteCourse(state, action: PayloadAction<{ term: string; courseIndex: number }>) {
            const { term, courseIndex } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term === term);
            if (termIndex !== -1) {
                state.data[termIndex].courses.splice(courseIndex, 1);
            }
        },
        // Update an assessment
        updateAssessment(state, action: PayloadAction<{ term: string; courseIndex: number; schemeIndex: number; assessmentIndex: number; assessment: Assessment }>) {
            const { term, courseIndex, schemeIndex, assessmentIndex, assessment } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.term === term);
            if (termIndex !== -1) {
                state.data[termIndex].courses[courseIndex].gradingSchemes[schemeIndex].assessments[assessmentIndex] = assessment;
            }
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(_apiService.syncTermDataChanges.fulfilled, (state) => {
            state.error = null; // Reset error on success
          })
          .addCase(_apiService.syncTermDataChanges.rejected, (state) => {
            state.error = 'Error Syncing Data'
          });
    },
});

export const { setData, updateCourse, updateScheme, addCourse, deleteCourse, updateAssessment, updateTerm, updateCourseName, updateCourseSubtitle, addTerm, addTerms, updateCompletedCourseGrade } = dataSlice.actions;

export default dataSlice.reducer;
