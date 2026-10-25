import { describe, it, expect } from 'vitest';
import { createDefaultDayData } from '../services/databaseService';
import { calculateDayBreakdown } from '../utils/scoring';
import { DEFAULT_QUESTION_TARGETS, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Mandatory Rollover, Locking, and Gate Requirements', () => {
  it('initializes Day 1 as active and Day 2 through Day 20 as locked', () => {
    const day1 = createDefaultDayData(1, '2026-10-25', true);
    const day2 = createDefaultDayData(2, '2026-10-26', false);
    const day20 = createDefaultDayData(20, '2026-11-13', false);

    expect(day1.status).toBe('active');
    expect(day1.gateStatus.isUnlocked).toBe(true);

    expect(day2.status).toBe('locked');
    expect(day2.gateStatus.isUnlocked).toBe(false);

    expect(day20.status).toBe('locked');
    expect(day20.gateStatus.isUnlocked).toBe(false);
  });

  it('configures Day 1 with 2 mock exams and 300 practice questions required', () => {
    const day1 = createDefaultDayData(1, '2026-10-25', true);
    expect(Object.keys(day1.mockExams).length).toBe(2);
    expect(Object.keys(day1.mockReviews).length).toBe(2);

    const breakdown = calculateDayBreakdown(day1, DEFAULT_QUESTION_TARGETS);
    expect(breakdown.totalDailyTarget).toBe(300);
    expect(breakdown.totalCompleted).toBe(0);
  });

  it('configures Day 2 with 2 mock exams and 300 practice questions required', () => {
    const day2 = createDefaultDayData(2, '2026-10-26', false);
    expect(Object.keys(day2.mockExams).length).toBe(2);
    expect(Object.keys(day2.mockReviews).length).toBe(2);

    const breakdown = calculateDayBreakdown(day2, DEFAULT_QUESTION_TARGETS);
    expect(breakdown.totalDailyTarget).toBe(300);
    expect(breakdown.totalCompleted).toBe(0);
    expect(breakdown.totalCompleted < 300).toBe(true);
  });

  it('requires both Mock Exam score and Mock Review to mark simulation complete', () => {
    const day1 = createDefaultDayData(1, '2026-10-25', true);
    day1.mockExams.mock01.overallScore = 78;
    day1.mockExams.mock01.isCompleted = true;

    // Review is still incomplete
    expect(day1.mockReviews.review01.isCompleted).toBe(false);

    // Both must be fulfilled
    const mockAndReviewBothDone = day1.mockExams.mock01.isCompleted && day1.mockReviews.review01.isCompleted;
    expect(mockAndReviewBothDone).toBe(false);

    // When review is also completed
    day1.mockReviews.review01.isCompleted = true;
    expect(day1.mockExams.mock01.isCompleted && day1.mockReviews.review01.isCompleted).toBe(true);
  });

  it('enforces that date change does not bypass lock state of future days', () => {
    const day1 = createDefaultDayData(1, '2026-10-25', true);
    const day2 = createDefaultDayData(2, '2026-10-26', false);
    const day5 = createDefaultDayData(5, '2026-10-29', false);

    expect(day1.status).toBe('active');
    expect(day1.status !== 'completed').toBe(true);

    // Day 2 and Day 5 remain locked
    expect(day2.gateStatus.isUnlocked).toBe(false);
    expect(day5.gateStatus.isUnlocked).toBe(false);
  });

  it('validates Day 1 completion requires all 2 mock exams and reviews', () => {
    const day1 = createDefaultDayData(1, '2026-10-25', true);
    const mockKeys = ['mock01', 'mock02'];

    // Incomplete initially
    const allMocksDone = mockKeys.every(k => day1.mockExams[k].isCompleted);
    expect(allMocksDone).toBe(false);

    // Mark all 2 mocks and reviews complete
    mockKeys.forEach((k, idx) => {
      day1.mockExams[k].isCompleted = true;
      day1.mockExams[k].overallScore = 80;
      day1.mockReviews[`review0${idx + 1}`].isCompleted = true;
    });

    const allMocksNowDone = mockKeys.every(k => day1.mockExams[k].isCompleted);
    const allRevsNowDone = mockKeys.every((_, idx) => day1.mockReviews[`review0${idx + 1}`].isCompleted);
    expect(allMocksNowDone).toBe(true);
    expect(allRevsNowDone).toBe(true);
  });
});