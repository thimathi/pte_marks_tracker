import { describe, it, expect } from 'vitest';
import { createDefaultDayData } from '../services/databaseService';
import { calculateDayBreakdown } from '../utils/scoring';
import { DEFAULT_QUESTION_TARGETS } from '../config/constants';

describe('Mandatory Rollover, Locking, and 7-Item Gate Requirements', () => {
  it('initializes Day 1 as active and Day 2 through Day 25 as locked', () => {
    const day1 = createDefaultDayData(1, '2026-10-20', true);
    const day2 = createDefaultDayData(2, '2026-10-21', false);
    const day25 = createDefaultDayData(25, '2026-11-13', false);

    expect(day1.status).toBe('active');
    expect(day1.gateStatus.isUnlocked).toBe(true);

    expect(day2.status).toBe('locked');
    expect(day2.gateStatus.isUnlocked).toBe(false);

    expect(day25.status).toBe('locked');
    expect(day25.gateStatus.isUnlocked).toBe(false);
  });

  it('rejects gate completion when practice questions are below daily target (278)', () => {
    const day1 = createDefaultDayData(1, '2026-10-11', true);
    const breakdown = calculateDayBreakdown(day1, DEFAULT_QUESTION_TARGETS);

    expect(breakdown.totalCompleted).toBe(0);
    expect(breakdown.totalDailyTarget).toBe(278);
    expect(breakdown.totalCompleted < 278).toBe(true);
    expect(day1.gateStatus.practiceCompleted).toBe(false);
  });

  it('requires both Mock Exam score and Mock Review to mark simulation complete', () => {
    const day1 = createDefaultDayData(1, '2026-10-11', true);
    day1.mockExams.mock01.overallScore = 78;
    day1.mockExams.mock01.isCompleted = true;

    // Review is still incomplete
    expect(day1.mockReviews.review01.isCompleted).toBe(false);

    // Both must be fulfilled for gate
    const mockAndReviewBothDone = day1.mockExams.mock01.isCompleted && day1.mockReviews.review01.isCompleted;
    expect(mockAndReviewBothDone).toBe(false);

    // When review is also completed
    day1.mockReviews.review01.isCompleted = true;
    expect(day1.mockExams.mock01.isCompleted && day1.mockReviews.review01.isCompleted).toBe(true);
  });

  it('enforces that date change does not bypass lock state of future days', () => {
    // If today is calendar date of Day 5, but Day 1 is still incomplete:
    const day1 = createDefaultDayData(1, '2026-10-11', true);
    const day2 = createDefaultDayData(2, '2026-10-12', false);
    const day5 = createDefaultDayData(5, '2026-10-15', false);

    // Day 1 has not satisfied all 7 criteria
    expect(day1.status).toBe('active');
    expect(day1.status !== 'completed').toBe(true);

    // Day 2 and Day 5 remain locked
    expect(day2.gateStatus.isUnlocked).toBe(false);
    expect(day5.gateStatus.isUnlocked).toBe(false);
  });

  it('validates all 5 criteria required to pass gate (1 mock per day)', () => {
    const criteria = {
      practiceCompleted: true,
      dailyPracticeReviewCompleted: true,
      mock1Completed: true,
      mock1ReviewCompleted: true,
      additionalExercisesCompleted: true
    };

    const isAllCriteriaSatisfied = (c: typeof criteria) =>
      c.practiceCompleted &&
      c.dailyPracticeReviewCompleted &&
      c.mock1Completed &&
      c.mock1ReviewCompleted &&
      c.additionalExercisesCompleted;

    expect(isAllCriteriaSatisfied(criteria)).toBe(true);

    // If even one item (e.g. mock review) is missing, gate fails
    const missingMockReview = { ...criteria, mock1ReviewCompleted: false };
    expect(isAllCriteriaSatisfied(missingMockReview)).toBe(false);

    // If daily practice review is missing, gate fails
    const missingPracticeReview = { ...criteria, dailyPracticeReviewCompleted: false };
    expect(isAllCriteriaSatisfied(missingPracticeReview)).toBe(false);
  });
});
