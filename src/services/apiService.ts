// This service handles all API calls for the application

// Imports
import { Term } from "@/types/mainTypes";
import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// CONSTANTS
const API_BASE_URL = import.meta.env.VITE_SITE_URL;

export class APIService {
    // uploadSchedule(formData) sends a request to make a new course with a syllabus
    async uploadSchedule (formData: FormData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/pdf/upload-schedule/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.error || "File upload failed");
            }
            throw new Error("An unknown error occurred");
        }
    };

    // uploadTranscript(formData) sends a request to upload a transcript 
    async uploadTranscript(formData: FormData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/transcript/upload-transcript/`, formData, {
                headers: { "Content-Type": "multipart/form-data", },
                withCredentials: true
            });
            return await response.data.result;
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.error || "File upload failed");
            }
            throw new Error("An unknown error occurred");
        }
    }

    // handleLogin() handles the login API request 
    async handleLogin() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/log-in`, {
                method: 'GET',
                withCredentials: true,
              });
              return response.data.url;    
        } catch {
            throw new Error("An unkown log-in error occurred");
        }
    }

    // exportToGoogleCalendar() exports a term calendar to Google Calendar
    async exportToGoogleCalendar(calendarName: string, calendarEvents: any) {
        try {
            // Create Calendar Item
            const response = await axios.get(`${API_BASE_URL}/api/calendar/create-calendar`, {
                withCredentials: true,
                params: { calendarName: calendarName },
            });
            const { id: calendarID } = response.data; // extract the calendar ID
            // Create Calendar Events
            await axios.post(`${API_BASE_URL}/api/calendar/create-events`, { events: calendarEvents }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: { id: calendarID }, // Pass the calendar ID
                }
            );
        } catch {
            throw new Error("Error exporting calendar")
        }
    }

    // syncTermDataWithDatabase(termData) syncs database with local state for term data
    syncTermDataChanges = createAsyncThunk(
        'data/syncTermData', // This is the action type
        async (termData: Term[], { rejectWithValue }) => {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/term-database/update-term-data`, 
                    { termData },
                    { withCredentials: true }  // Ensures cookies are sent with the request
                );
                
                if (response.data.exists) {
                    return response.data;
                } 
                return rejectWithValue('Error syncing data');
            } catch (error) {
                // Handle errors and return a rejected value
                console.error('Error syncing term data:', error);
                return rejectWithValue('Error syncing data');
            }
        }
    );
}

