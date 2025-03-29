// This service is used to validate input fields to make sure they are consistent across the app

export class InputFieldValidationService {

    inputNumber(value: string, upperLimit: number = 200): number | null | undefined {
        const parsedValue = parseFloat(parseFloat(value).toFixed(2));
        if (parsedValue < 0 || parsedValue > upperLimit) {
            return;
        }
        return isNaN(parsedValue) ? null : parsedValue;
    }

    inputCourseCode(value: string): string {
        return value.trimStart().slice(0, 8);
    }

    inputCourseNumber(value: string): string {
        return value.trimStart().slice(0, 6);
    }

    inputCourseSubtitle(value: string): string {
        return value.trimStart().slice(0, 60);
    }

    inputAssessmentName(value: string): string {
        return value.trimStart().slice(0, 25);
    }

    inputAssessmentWeight(value: string, upperLimit = 200) {
        if (value == "") {
            return null;
        }
        const parsedValue = parseFloat(parseFloat(value).toFixed(2));
        if (parsedValue < 0 || parsedValue > upperLimit) {
            return;
        }

        return isNaN(parsedValue) ? null : parsedValue;
    }

    inputGradingSchemeName(value: string) {
        return value.trimStart().slice(0, 25);
    }

    inputHoursStudied(value: string, upperLimit = 16) {
        if (value == "") {
            return null;
        }
        const parsedValue = parseFloat(parseFloat(value).toFixed(2));
        if (parsedValue < 0 || parsedValue > upperLimit) {
            return;
        }

        return isNaN(parsedValue) ? null : parsedValue;
    }

}