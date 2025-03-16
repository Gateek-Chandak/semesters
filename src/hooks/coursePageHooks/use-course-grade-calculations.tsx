import { useMemo } from 'react';
import { CalculationService } from '@/services/calculationService';
import useData from '../use-data';

const _calculationService = new CalculationService();

const useCourseGradeCalculations = () => {
  const { courseData } = useData();

  const { minGradePossible, maxGradePossible, highestCourseGrade } = useMemo(() => {
    if (!courseData) {
      return { minGradePossible: 0, maxGradePossible: 100, highestCourseGrade: 0 };
    }

    return {
      minGradePossible: _calculationService.calculateMinGrade(courseData) !== Infinity
        ? parseFloat(_calculationService.calculateMinGrade(courseData).toFixed(2))
        : 0,
      maxGradePossible: parseFloat(_calculationService.calculateMaxGrade(courseData).toFixed(2)),
      highestCourseGrade: _calculationService.getHighestCourseGrade(courseData.gradingSchemes)
    };
  }, [courseData]);

  return { minGradePossible, maxGradePossible, highestCourseGrade };
};

export default useCourseGradeCalculations;
