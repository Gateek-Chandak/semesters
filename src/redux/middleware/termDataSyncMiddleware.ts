import { Action, Dispatch, Store, } from 'redux';
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
// Services
import { APIService } from '@/services/apiService';
const _apiService = new APIService();

//@ts-expect-error no clue
const termDataSyncMiddleware: Middleware = (store: Store) => (next: Dispatch) => async (action: Action) => {
  const result = next(action); 

  if (
    action.type === 'data/setData' ||
    action.type === 'data/addTerms' ||
    action.type === 'data/addTerm' ||
    action.type === 'data/updateTerm' ||
    action.type === 'data/addCourse' ||
    action.type === 'data/updateCourse' ||
    action.type === 'data/deleteCourse' ||
    action.type === 'data/updateAssessment' ||
    action.type === 'data/updateCourseName' ||
    action.type === 'data/updateCourseSubtitle' ||
    action.type === 'data/updateCompletedCourseGrade' ||
    action.type === 'data/updateScheme'
  ) {
    const state: RootState = store.getState();
    const data = state.data.data;

    if (data.length > 0) {

      // Trigger an API call to sync the updated terms data with the backend

      //@ts-expect-error no clue
      store.dispatch(_apiService.syncTermDataChanges(data));  // Updates user data on the server
    }
  }

  return result;
};

export default termDataSyncMiddleware;

