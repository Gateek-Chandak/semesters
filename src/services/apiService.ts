// This service handles all API calls for the application

// Imports
import { Assessment, Course, GradingScheme, Term } from "@/types/mainTypes";
import axios, { AxiosError } from "axios";

// CONSTANTS
const API_BASE_URL = import.meta.env.VITE_SITE_URL;

export class APIService {
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

    // uploadSyllabus(formData) sends a request to make a new course with a syllabus
    async uploadSyllabus(formData: FormData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/syllabus/upload-syllabus/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            return JSON.parse(response.data);
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
    async createTerm(user_id: number, term_name: string, is_completed: boolean, selectedYear: number) {
        const season = term_name.split(' ')[0];
        let start_date;
        let end_date;

        if (season == 'Fall') {
            start_date = `${selectedYear.toString()}-09-01T05:00:00.000Z`;
            end_date = `${selectedYear.toString()}-12-31T05:00:00.000Z`;
        } else if (season == 'Winter') {
            start_date = `${selectedYear.toString()}-01-01T05:00:00.000Z`;
            end_date = `${selectedYear.toString()}-04-30T05:00:00.000Z`;
        } else {
            start_date = `${selectedYear.toString()}-05-01T05:00:00.000Z`;
            end_date = `${selectedYear.toString()}-08-31T05:00:00.000Z`;
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

    async updateTerm(user_id: number, term: Term) {
        const { id, term_name, is_completed, start_date, end_date, order_index } = term;

        try {
            const response = await axios.put(`${API_BASE_URL}/api/term-database/update-term`, {
                user_id, 
                term: { id, term_name, is_completed, start_date, end_date, order_index }
            });
    
            if (response.data.success) {
                return response.data.data;
            } 
            throw new Error("Error Syncing Data");
        } catch (error) {
            console.error('Error syncing term data:', error);
            throw new Error("Error Syncing Data");
        }
    }

    async updateTermOrder(user_id: number, rearrangedTerms: Term[]) {
        const updatedTerms = rearrangedTerms.map((term: Term) => { return { id: term.id, order_index: term.order_index }});

        try {
            const response = await axios.put(`${API_BASE_URL}/api/term-database/update-term-order`, {
                user_id, 
                updatedTerms
            });
    
            if (response.data.success) {
                return true;
            } 
            return false;
        } catch (error) {
            console.error('Error syncing term data:', error);
            return false;
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
                return response.data.data;
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

    async deleteAllGradingSchemes(term_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/term-database/delete-all-grading-schemes`, {
                data: { term_id },
            });
    
            if (response.data.success) {
                return true
            } 
            throw new Error("Error Deleting Data");
        } catch (error) {
            console.error('Error Deleting Data:', error);
            throw new Error("Error Deleting Data");
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
    async createAssessment(user_id: number, grading_scheme_id: number, assessment_name: string, due_date: string | null, weight: number, grade: number | null) {
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

    // HOURS STUDIED LOGS ROUTES
    async getStudyLogs(user_id: number, term_id: number) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/hours-studied-logs/`, 
                { params: { user_id, term_id } },
            );
            
            if (response.data.success) {
                return response.data.data
            } 
            throw new Error("Error Creating Logs");
        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error Creating Logs:', error);
            throw new Error("Error Creating Logs");
        }
    }
    async createStudyLog(user_id: number, term_id: number, date: string, logs: {course_id: number, hours_studied: number}[]) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/hours-studied-logs/`, 
                { user_id, term_id, date, logs },
            );
            
            if (response.data.success) {
                return true
            } 
            throw new Error("Error Creating Logs");
        } catch (error) {
            // Handle errors and return a rejected value
            throw new Error("Error Creating Logs");
        }
    }

    async deleteStudyLogs(term_id: number) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/hours-studied-logs/`, {
                data: { term_id },
            });
    
            if (response.data.success) {
                return true
            } 
            throw new Error("Error deleting Data");
        } catch (error) {
            console.error('Error deleting study logs:', error);
            throw new Error("Error deleting study logs");

        }
    }
}

