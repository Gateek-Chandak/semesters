import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import authReducer from './slices/authSlice';
import degreeRequirementsReducer from './slices/degreeRequirementsSlice';

const store = configureStore({
    reducer: {
        data: dataReducer, // Manages Term Data
        auth: authReducer, // Manages Authentication Data
        degreeRequirements: degreeRequirementsReducer, // Manages Degree Requirements Data
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
