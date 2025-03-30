// This Slice handles and monitors all changes relating to term data

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, Course, GradingScheme, Term } from '@/types/mainTypes';

// Type for Term Data
interface DataState {
  data: Term[];
}
// Initial State for Term Data
const initialState: DataState = {
    data: [],
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // Sets state
        setData(state, action: PayloadAction<Term[]>) {
            state.data = action.payload;
        },

        // Term functions
        addTerm(state, action: PayloadAction<{ newTerm: Term }>) {
          const { newTerm } = action.payload;
          const duplicateTerm = state.data.find((t: Term) => t.term_name == newTerm.term_name);
          if (newTerm && !duplicateTerm) {
              state.data.push(newTerm);
          }
        },            
        updateTerm(state, action: PayloadAction<{ term_id: number; updatedCourseList: Course[] }>) {
            const { term_id, updatedCourseList } = action.payload;
            const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
            if (termIndex !== -1) {
              state.data[termIndex].courses = updatedCourseList;
            }
        },
        deleteTerm(state, action: PayloadAction<{ term_id: number }>) {
          const { term_id } = action.payload;
          const newState = state.data.filter((t: Term) => t.id != term_id)
          state.data = newState;
        },

        // Course functions
        addCourse(state, action: PayloadAction<{ term_id: number; newCourse: any }>) {
          const { term_id, newCourse } = action.payload;

          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
          if (termIndex !== -1) {

              const existingCourse = state.data[termIndex].courses.find((c: Course) => c.course_title === newCourse.course_title);
              if (existingCourse) {
                  console.log(`Course "${newCourse.course_title}" already exists in term ID ${term_id}`);
                  return;
              }

              state.data[termIndex].courses.push(newCourse);
          }
        },
        updateCourse(state, action: PayloadAction<{ term_id: number; course_id: number; updatedCourse: Course }>) {
          const { term_id, course_id, updatedCourse } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
          if (termIndex !== -1) {
              const courseIndex = state.data[termIndex].courses.findIndex((c: Course) => c.id == course_id);
              if (courseIndex !== -1) {
                state.data[termIndex].courses[courseIndex] = updatedCourse;
              }
          }
        },
        deleteCourse(state, action: PayloadAction<{ term_id: number; course_id: number }>) {
          const { term_id, course_id } = action.payload;
          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
          if (termIndex !== -1) {
            const updatedCourses = state.data[termIndex].courses.filter((course: Course) => course.id != course_id);
              state.data[termIndex].courses = updatedCourses;
          }
        },

        // Scheme functions
        updateScheme(state, action: PayloadAction<{ term_id: number; course_id: number; scheme_id: number, updatedScheme: GradingScheme }>) {
          const { term_id, course_id, scheme_id, updatedScheme } = action.payload;

          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
          if (termIndex !== -1) {
            const courseIndex = state.data[termIndex].courses.findIndex((c: Course) => c.id === course_id);
            if (courseIndex !== -1) {
              const schemeIndex = state.data[termIndex].courses[courseIndex].grading_schemes.findIndex(
                (s: GradingScheme) => s.id === scheme_id
              );
              if (schemeIndex !== -1) {
                state.data[termIndex].courses[courseIndex].grading_schemes[schemeIndex] = updatedScheme;
              }
            }
          }
        },

        // Assessment functions
        updateAssessment(state, action: PayloadAction<{ term_id: number; course_id: number; scheme_id: number; assessment_id: number; updatedAssessment: Assessment }>) {
          const { term_id, course_id, scheme_id, assessment_id, updatedAssessment } = action.payload;
        
          const termIndex = state.data.findIndex((t: Term) => t.id === term_id);
          if (termIndex !== -1) {
            const courseIndex = state.data[termIndex].courses.findIndex((c: Course) => c.id === course_id);
            if (courseIndex !== -1) {
              const schemeIndex = state.data[termIndex].courses[courseIndex].grading_schemes.findIndex(
                (s: GradingScheme) => s.id === scheme_id
              );
              if (schemeIndex !== -1) {
                const assessmentIndex = state.data[termIndex].courses[courseIndex].grading_schemes[schemeIndex].assessments.findIndex(
                  (a: Assessment) => a.id === assessment_id
                );
                if (assessmentIndex !== -1) {
                  state.data[termIndex].courses[courseIndex].grading_schemes[schemeIndex].assessments[assessmentIndex] = updatedAssessment;
                }
              }
            }
          }
        },
        
    }
});

export const { setData, addTerm, updateTerm, deleteTerm, addCourse, updateCourse, deleteCourse, updateScheme } = dataSlice.actions;

export default dataSlice.reducer;
