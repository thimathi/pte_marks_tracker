import { describe, it, expect } from 'vitest';
import {
  APEUNI_VIP_MOCKS,
  MOCK_EXAM_SCHEDULE_INDICES,
  getMockExamDetails,
  TOTAL_STUDY_DAYS,
  TOTAL_MOCK_TARGET,
  TOTAL_UNIQUE_PAPERS,
  REPETITIONS_PER_PAPER,
  TOTAL_MOCK_EXAM_QUESTIONS,
  TOTAL_MISSION_QUESTIONS,
  DAILY_MOCK_SCHEDULE,
  getMockExamsForDay,
  getExamNumberForMock,
  getDayAndSlotForExam,
  getExamNumbersForPaper,
  isReviewDay,
  getReviewDayDefinition
} from '../config/constants';

describe('60 Mock Exam Mastery Plan & 20 Papers × 3 Passes + 9 Review Days Verification', () => {
  it('contains available user-specified mock exam catalog', () => {
    expect(APEUNI_VIP_MOCKS.length).toBeGreaterThanOrEqual(20);
    expect(APEUNI_VIP_MOCKS[0]).toBe('【VIP Full Test】PTE Mock Test 45C');
    expect(APEUNI_VIP_MOCKS[1]).toBe('【VIP Full Test】PTE Mock Test 44C');
  });

  it('configures 28 study days and 60 total mocks (20 unique papers × 3 passes)', () => {
    expect(TOTAL_STUDY_DAYS).toBe(28);
    expect(TOTAL_MOCK_TARGET).toBe(60);
    expect(TOTAL_UNIQUE_PAPERS).toBe(20);
    expect(REPETITIONS_PER_PAPER).toBe(3);
    expect(MOCK_EXAM_SCHEDULE_INDICES.length).toBe(60);
  });

  it('guarantees each of the 3 passes covers all 20 unique papers without duplicate', () => {
    for (let pass = 0; pass < 3; pass++) {
      const passIndices = MOCK_EXAM_SCHEDULE_INDICES.slice(pass * 20, (pass + 1) * 20);
      expect(passIndices.length).toBe(20);
      const uniquePapers = new Set(passIndices);
      expect(uniquePapers.size).toBe(20);
      for (let i = 0; i < 20; i++) {
        expect(uniquePapers.has(i)).toBe(true);
      }
    }
  });

  it('guarantees every unique paper appears exactly 3 times in random order', () => {
    for (let pIdx = 0; pIdx < 20; pIdx++) {
      const examNumbers = getExamNumbersForPaper(pIdx);
      expect(examNumbers.length).toBe(3);

      // Verify that each appearance falls into a different pass
      expect(examNumbers[0]).toBeLessThanOrEqual(20);
      expect(examNumbers[1]).toBeGreaterThan(20);
      expect(examNumbers[1]).toBeLessThanOrEqual(40);
      expect(examNumbers[2]).toBeGreaterThan(40);
      expect(examNumbers[2]).toBeLessThanOrEqual(60);
    }
  });

  it('maps every mock exam number (1..60) to study days and slots bi-directionally', () => {
    for (let eNum = 1; eNum <= 60; eNum++) {
      const { dayNumber, mockKey } = getDayAndSlotForExam(eNum);
      expect(dayNumber).toBeGreaterThanOrEqual(1);
      expect(dayNumber).toBeLessThanOrEqual(28);
      expect(mockKey).toMatch(/^mock0[1-4]$/);

      const dayMocks = getMockExamsForDay(dayNumber);
      const slotIndex = dayMocks.indexOf(mockKey);
      expect(slotIndex).toBeGreaterThanOrEqual(0);
      const mappedExamNumber = getExamNumberForMock(dayNumber, slotIndex);
      expect(mappedExamNumber).toBe(eNum);
    }
  });

  it('correctly maps Day 1 to the 4 specific tests in user-requested order', () => {
    const day1Mocks = getMockExamsForDay(1);
    expect(day1Mocks).toEqual(['mock01', 'mock02', 'mock03', 'mock04']);

    const mock1 = getMockExamDetails(1);
    expect(mock1.testName).toBe('【Free Full Test】Mock Test A (note: VIP required for scoring)');
    expect(mock1.timeSlot).toBe('12:00 AM – 02:00 AM');

    const mock2 = getMockExamDetails(2);
    expect(mock2.testName).toBe('【VIP Full Test】PTE Mock Test 37B (7th Aug. new version)');
    expect(mock2.timeSlot).toBe('09:00 AM – 11:00 AM');

    const mock3 = getMockExamDetails(3);
    expect(mock3.testName).toBe('【VIP Full Test】PTE Mock Test 40B (7th Aug. new version)');
    expect(mock3.timeSlot).toBe('01:00 PM – 03:00 PM');

    const mock4 = getMockExamDetails(4);
    expect(mock4.testName).toBe('【VIP Full Test】PTE Mock Test 45C');
    expect(mock4.timeSlot).toBe('04:00 PM – 06:00 PM');
  });

  it('returns mock exam details with correct pass, attempt number, and badges', () => {
    const mock1 = getMockExamDetails(1);
    expect(mock1.roundNumber).toBe(1);
    expect(mock1.attemptOfPaper).toBe(1);

    const mock25 = getMockExamDetails(25);
    expect(mock25.roundNumber).toBe(2);
    expect(mock25.attemptOfPaper).toBe(2);

    const mock50 = getMockExamDetails(50);
    expect(mock50.roundNumber).toBe(3);
    expect(mock50.attemptOfPaper).toBe(3);
  });

  it('validates total question targets: 3,600 mock exam questions', () => {
    expect(TOTAL_MOCK_EXAM_QUESTIONS).toBe(3600);
    expect(TOTAL_MISSION_QUESTIONS).toBe(3600);
  });

  it('validates the 9 dedicated Deep Review Days (Days 3, 6, 9, 12, 15, 18, 21, 24, 27)', () => {
    const reviewDays = [3, 6, 9, 12, 15, 18, 21, 24, 27];
    reviewDays.forEach((d) => {
      expect(isReviewDay(d)).toBe(true);
      expect(getMockExamsForDay(d)).toEqual([]); // 0 new mocks scheduled
      const def = getReviewDayDefinition(d);
      expect(def).not.toBeNull();
      expect(def?.examNumbers.length).toBeGreaterThanOrEqual(6);
    });

    // Specifically verify Day 3 reviews all 7 mocks of Day 1 & Day 2:
    const day3Def = getReviewDayDefinition(3);
    expect(day3Def?.examNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(day3Def?.coveredDays).toEqual([1, 2]);
  });
});
