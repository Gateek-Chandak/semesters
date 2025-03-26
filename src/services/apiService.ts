// This service handles all API calls for the application

// Imports
import { Assessment, Course, GradingScheme } from "@/types/mainTypes";
import axios, { AxiosError } from "axios";

// CONSTANTS
const API_BASE_URL = import.meta.env.VITE_SITE_URL;

export class APIService {
    // uploadSchedule(formData) sends a request to make a new course with a syllabus
    async uploadSchedule(formData: FormData) {
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

    // TERM ROUTES 
    async createTerm(user_id: number, term_name: string, is_completed: boolean) {
        const season = term_name.split(' ')[0];
        let start_date;
        let end_date;

        if (season == 'Fall') {
            start_date = '2025-09-01';
            end_date = '2025-12-30';
        } else if (season == 'Winter') {
            start_date = '2025-01-01';
            end_date = '2025-04-30';
        } else {
            start_date = '2025-05-01';
            end_date = '2025-08-30';
        }

        const term = {
            user_id,
            term_name,
            is_completed,
            start_date,
            end_date
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/term-database/create-term`, 
                { term },
            );
            
            if (response.data.success) {
                return response.data.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async deleteTerm(user_id: number, term_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/term-database/delete-term`, {
                data: { user_id, term_id },
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }
    

    // COURSE ROUTES
    async createCourse(term_id: number, course_title: string, course_subtitle: string, colour: string, highest_grade: number, is_completed: boolean) {
        
        const course = {
            term_id,
            course_title,
            course_subtitle,
            colour: is_completed ? "black" : colour,
            highest_grade
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/term-database/create-course`, 
                { course },
            );
            
            if (response.data.success) {
                return response.data.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async deleteCourse(user_id: number, course_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/term-database/delete-course`, {
                data: { user_id, course_id },
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async updateCourse(user_id: number, course: Course) {
        const { id, course_title, course_subtitle, colour, highest_grade } = course;
        try {
            const response = await axios.put(`${API_BASE_URL}/api/term-database/update-course`, {
                user_id, 
                course: { id, course_title, course_subtitle, colour, highest_grade}
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    // GRADING SCHEME ROUTES
    async createGradingScheme(user_id: number, course_id: number, scheme_name: string) {
        const grading_scheme = { scheme_name, grade: 0, course_id }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/term-database/create-grading-scheme`, 
                { user_id: user_id, grading_scheme },
            );
            
            if (response.data.success) {
                return response.data.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    } 

    async deleteGradingScheme(user_id: number, grading_scheme_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/term-database/delete-grading-scheme`, {
                data: { user_id, grading_scheme_id },
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async updateGradingScheme(user_id: number, grading_scheme: GradingScheme) {
        const { id, scheme_name, grade } = grading_scheme;
        try {
            const response = await axios.put(`${API_BASE_URL}/api/term-database/update-grading-scheme`, {
                user_id, 
                grading_scheme: { id, scheme_name, grade }
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    // ASSESSMENT ROUTES
    async createAssessment(user_id: number, grading_scheme_id: number, assessment_name: string, due_date: String | null, weight: number, grade: number | null) {
        const assessment = { assessment_name, due_date, weight, grade, grading_scheme_id }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/term-database/create-assessment`, 
                { user_id, assessment },
            );
            
            if (response.data.success) {
                return response.data.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    } 

    async deleteAssessment(user_id: number, assessment_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/term-database/delete-assessment`, {
                data: { user_id, assessment_id },
            });
    
            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async updateAssessment(user_id: number, assessment: Assessment) {
        const { id, assessment_name, due_date, weight, grade } = assessment;
        try {
            const response = await axios.put(`${API_BASE_URL}/api/term-database/update-assessment`, {
                user_id, 
                assessment: { id, assessment_name, due_date, weight, grade }
            });

            if (response.data.success) {
                return response.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }
}

