import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import authReducer from './slices/authSlice';
import termDataSyncMiddleware from './middleware/termDataSyncMiddleware';

const store = configureStore({
    reducer: {
        data: dataReducer, // Manages Term Data
        auth: authReducer, // Manages Authentication Data
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(termDataSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
