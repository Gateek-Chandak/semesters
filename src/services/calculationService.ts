// This service handles all calculations for the app
// To NAVIGATE, Search for sections => [GENERAL CALCULATIONS, COURSE DATA CALCULATIONS, TERM DATA CALCULATIONS, DASHBOARD CALCULATIONS]

// Libraries
import { addHours } from "date-fns";

// Types
import { Assessment, CalendarEvent, Course, GradingScheme, Term } from "@/types/mainTypes";

export class CalculationService{
    // COURSE DATA CALCULATIONS -----------------------------------------------------------------------

    // getCourseCalendarEvents(courseData) takes in course data and returns a list of calendar
    //                                     events to be used in a calendar component
    getCourseCalendarEvents(courseData: Course): CalendarEvent[] {
        const uniqueAssessments = new Set();
        const calendarEvents = courseData.grading_schemes.flatMap((scheme) =>
            scheme.assessments
                .filter((assessment) => assessment.due_date !== null) // Filter out assessments with null dueDate
                .filter((assessment) => {
                    // Check if the assessment name is already added for this course
                    if (uniqueAssessments.has(assessment.assessment_name)) {
                        return false;
                    }
                    uniqueAssessments.add(assessment.assessment_name)
                    return true;
                })
                .map((assessment, index) => ({
                    id: index,
                    //@ts-expect-error calendar expects Date but I can only give Date | null
                    start: new Date(assessment.due_date),
                    //@ts-expect-error calendar expects Date but I can only give Date | null
                    end: addHours(new Date(assessment.due_date), 1),
                    title: assessment.assessment_name,
                    course: courseData.course_title,
                    color: courseData.colour,
                }))
        );

        return calendarEvents;
    }

    // calculateMinGrade(courseData) calculates the minimum grade possible for a course
    calculateMinGrade(courseData: Course | undefined): number {
        if (courseData == undefined) {
            return 0;
        }

        let minGrade = 0; // Start with the highest possible value

        courseData?.grading_schemes.forEach((scheme) => {
            if (!scheme.assessments || scheme.assessments.length === 0) {
                return; // Skip this scheme if it has no assessments
            }
            // Calculate the total grade for the scheme by assigning 0 to all grades
            const totalGrade = scheme.assessments.reduce((total, assessment) => {
                const grade = assessment.grade !== null && assessment.grade !== undefined ? assessment.grade : 0;
                return total + (grade * assessment.weight) / 100;
            }, 0);

            // Update minGrade if this scheme's grade is lower
            minGrade = Math.max(minGrade, totalGrade)
        });

        return minGrade
    }

    // calculateMaxGrade(courseData) calculates the maximum grade possible for a course
    calculateMaxGrade(courseData: Course | undefined): number {
        let maxGrade = 0; // Start with the lowest possible value (0)
            
        courseData?.grading_schemes.forEach((scheme) => {
            // Calculate the total grade for the scheme by assigning 100 to all grades
            let totalGrade = scheme.assessments.reduce((total, assessment) => {
                const grade = (assessment.grade !== null && assessment.grade !== undefined ) ? assessment.grade : 100; // Assign 100 to undefined or null grades
                return total + (grade * assessment.weight) / 100;
            }, 0);

            // Determine the scheme's final grade by scaling to the total weight
            const totalWeight = scheme.assessments.reduce((total, assessment) => total + assessment.weight, 0);
            if (totalWeight <= 100) {
                totalGrade += 100 - totalWeight;
            }

            // Update maxGrade if this scheme's grade is higher
            if (totalGrade > maxGrade) {
                maxGrade = totalGrade;
            }
        });

        return maxGrade;
    }

    // calculateMinGradeNeeded(grade, courseData) calculates the minimum grade needed to get 'grade' using grading scheme(s)
    calculateMinGradeNeeded(grade: number, courseData: Course | undefined): number | null {
        let minGradeNeeded: number | null = null;
        let atLeastOneSchemeCanContribute = false;
    
        courseData?.grading_schemes.forEach((scheme) => {
            if (!scheme.assessments || scheme.assessments.length === 0) return;
    
            const completed = scheme.assessments.filter(a => a.grade !== null);
            const remaining = scheme.assessments.filter(a => a.grade === null);
            
            const gradeAchieved = completed.reduce((sum, a) => sum + ((a.grade! * a.weight) / 100), 0);
            const weightAchieved = completed.reduce((sum, a) => sum + a.weight, 0);
            const weightRemaining = Math.max(remaining.reduce((sum, a) => sum + a.weight, 0), 100 - weightAchieved);
    
            // If no weight is left in this scheme, check if it alone was enough
            if (weightRemaining === 0) {
                if (gradeAchieved >= grade) {
                    minGradeNeeded = minGradeNeeded === null ? 0 : Math.min(minGradeNeeded, 0);
                }
                return; // Skip this scheme since it can't contribute more
            }
    
            atLeastOneSchemeCanContribute = true;
    
            const weightNeeded = grade - gradeAchieved;
            const gradeNeeded = (weightNeeded / weightRemaining) * 100;
            
            minGradeNeeded = minGradeNeeded === null ? gradeNeeded : Math.min(minGradeNeeded, gradeNeeded);
        });
    
        // If no scheme can contribute anymore and the goal isn't reached, return Infinity
        if (!atLeastOneSchemeCanContribute && (minGradeNeeded === null || minGradeNeeded > grade)) {
            return Infinity;
        }
    
        return minGradeNeeded;
    }
    
    // updateSchemes(courseData, assessmentGrade, assessmentName) updates a courses grading schemes along with its grades
    updateSchemeGrades(gradingSchemes: GradingScheme[], assessmentGrade: number | null, assessment_id: number) {
        const updatedSchemes = gradingSchemes.map((scheme) => {
            let totalGrade = 0;
            let totalWeight = 0;

            const updatedAssessments = scheme.assessments.map((assessment) => {
                // Update the grade for the matching assessment
                if (assessment.id === assessment_id) {
                    assessment = { ...assessment, grade: assessmentGrade }; // Assign rounded value or null
                }
                // Include only completed assessments in the grade calculation
                if (assessment.grade !== null && assessment.grade !== undefined && assessment.weight) {
                    totalGrade += (assessment.grade * assessment.weight) / 100;
                    totalWeight += assessment.weight;
                }
                return assessment;
            });

            // Ensure totalWeight doesn't exceed 100
            if (totalWeight > 100) {
                totalWeight = 100;
            }
            // Calculate final grade, scaled to completed assessments
            const finalGrade = totalWeight > 0 ? (totalGrade / totalWeight) * 100 : 0;
            return {
                ...scheme,
                assessments: updatedAssessments,
                grade: parseFloat(finalGrade.toFixed(2)), // Round to 2 decimal places
            };
        });

        return updatedSchemes;
    }

    // updateGradingSchemeGrade(assessments) produces the new grading scheme grade based on assessments
    updateGradingSchemeGrade(assessments: Assessment[]) {
        let totalGrade = 0;
        let totalWeight = 0;

        assessments.forEach((assessment) => {
            if (assessment.grade != null && assessment.weight) {
                totalGrade += (assessment.grade * assessment.weight) / 100;
                totalWeight += assessment.weight;
            }
        });
        // Ensure totalWeight doesn't exceed 100
        totalWeight = Math.min(totalWeight, 100);

        // Calculate and return final grade
        return totalWeight > 0 ? parseFloat(((totalGrade / totalWeight) * 100).toFixed(2)) : 0;
    }

    // getHighestCourseGrade(gradingSchemes) takes in a list of grading schemes and returns the highest grade out of the two
    getHighestCourseGrade(gradingSchemes: GradingScheme[]): number {
        const highestGrade = gradingSchemes.reduce((max: number, scheme) => {
            return Math.max(max, scheme.grade);
        }, 0);

        return highestGrade || 0
    }

    // TERM DATA CALCULATIONS -------------------------------------------------------------------------

    // getTermCalendarEvents(courseData) takes in term data and returns a list of calendar
    //                                     events to be used in a calendar component
    getTermCalendarEvents(termData: Term): CalendarEvent[] {
        const calendarEvents = termData?.courses.flatMap((course) => {
            // Use a Set to track unique assessment names for the course
            const uniqueAssessments = new Set();
            return course.grading_schemes.flatMap((scheme) =>
            scheme.assessments
                .filter((assessment) => {
                // Check if the assessment name is already added for this course
                if (uniqueAssessments.has(assessment.assessment_name)) {
                    return false; // Skip duplicates
                }
                uniqueAssessments.add(assessment.assessment_name); // Mark as added
                return true;
                })
                .map((assessment, index) => ({
                    id: index,
                    start: assessment.due_date ? new Date(assessment.due_date) : null,
                    end: assessment.due_date ? addHours(new Date(assessment.due_date), 1) : null,
                    title: assessment.assessment_name,
                    course: course.course_title,
                    color: course.colour,
                }))
            );
        });

        return calendarEvents;
    }

    // getEventsInTimeFrame(calendarEvents, timeFrame) gets the number of calendar events 
    //                                                 in the next timeFrame days
    getEventsInTimeFrame(calendarEvents: CalendarEvent[], timeFrame: number): number {
        const now = new Date();
        const proximityDaysFromNow = new Date();
        proximityDaysFromNow.setDate(now.getDate() + timeFrame);
        const calculatedEvents = calendarEvents?.filter(event => {
            if (event.start) {
                const eventDate = new Date(event.start);
                return eventDate >= now && eventDate <= proximityDaysFromNow;
            }
            return false
        });
        const numOfEventsInNextXDays = calculatedEvents? calculatedEvents.length : 0
        return numOfEventsInNextXDays;
    }

    // getDeliverablesRemaining(termData) gets the number of remaining deliverables for the term
    getDeliverablesRemaining(termData: Term): number {
        const pendingDeliverablesList = termData?.courses.flatMap((course) => 
            course.grading_schemes?.[0]?.assessments?.filter((assessment) => 
                assessment.grade === null || assessment.grade === undefined
            ) || []
        );
        return pendingDeliverablesList?.length || 0;
    }

    // getTermAverage(termData) calculates the overall term average
    getTermAverage(termData: Term): number {
        if (termData && termData.courses?.length > 0) {
            const courseGrades = termData.courses.reduce((total: number, course: Course) => {
                return total + course.highest_grade;
            }, 0);

            const average = courseGrades / termData.courses.length;
            return parseFloat(average.toFixed(2));
        } else {
            return 0;
        }
    }

    // DASHBOARD CALCULATIONS -------------------------------------------------------------------------

    // getCumulativeGPA(data) gets the cGPT from a list of COMPLETED Terms
    getCumulativeGPA(data: Term[]): number {
        // Sum all grades
        const totalGrades = data.reduce((overallTotal: number, term: Term) => {
            if (term.is_completed) {
                return overallTotal + term.courses.reduce((termSum: number, course: Course) => {
                    return termSum + course.highest_grade;
                }, 0);
            } else {
                return overallTotal + 0
            } 
        }, 0);
        // Sum all completed courses
        const totalCourses = data.reduce((count: number, term) => {
            if (term.is_completed) {
                return count + term.courses.length;
            } else {
                return count + 0;
            }
        }, 0);

        if (totalCourses > 0) {
            return totalGrades / totalCourses;
        } 
        return 0;
    }

    //getProjectedCumulativeGPA(data, projectedTerm) compares projectedTerm with other completed terms
    //                                               to determine projected GPA
    getProjectedCumulativeGPA(data: Term[]): number {
        // Sum all grades
        const totalGrades = data.reduce((overallTotal: number, term: Term) => {
            return overallTotal + term.courses.reduce((termSum: number, course: Course) => {
                return termSum + course.highest_grade;
            }, 0);
        }, 0);
        // Sum all completed courses
        const totalCourses = data.reduce((count: number, term) => {
            return count + term.courses.length;
        }, 0);

        if (totalCourses > 0) {
            return totalGrades / totalCourses;
        } 
        return 0;
    }
} 
