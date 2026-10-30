import { describe, it, expect } from 'vitest';
import {
  APEUNI_VIP_MOCKS,
  MOCK_EXAM_SCHEDULE_INDICES,
  getMockExamDetails,
  TOTAL_STUDY_DAYS,
  TOTAL_MOCK_TARGET,
  TOTAL_PRACTICE_TARGET,
  TOTAL_MOCK_EXAM_QUESTIONS,
  TOTAL_MISSION_QUESTIONS,
  DAILY_MOCK_SCHEDULE,
  getMockExamsForDay,
  getExamNumberForMock
} from '../config/constants';

describe('35 Mock Exam Catalog & 6 Daily Mocks Progression Verification', () => {
  it('contains exactly 35 user-specified mock exam papers', () => {
    expect(APEUNI_VIP_MOCKS.length).toBe(35);
    expect(APEUNI_VIP_MOCKS[0]).toBe('【VIP Full Test】PTE Mock Test 45C');
    expect(APEUNI_VIP_MOCKS[1]).toBe('【VIP Full Test】PTE Mock Test 44C');
    expect(APEUNI_VIP_MOCKS[34]).toBe('【VIP Full Test】PTE Mock Test 22B (7th Aug. new version)');
  });

  it('configures 10 intensive study days and 60 total mocks (6 mocks/day)', () => {
    expect(TOTAL_STUDY_DAYS).toBe(10);
    expect(TOTAL_MOCK_TARGET).toBe(60);
    expect(DAILY_MOCK_SCHEDULE.length).toBe(6);
  });

  it('guarantees Round 1 covers all 35 papers without duplicate', () => {
    const round1Indices = MOCK_EXAM_SCHEDULE_INDICES.slice(0, 35);
    expect(round1Indices.length).toBe(35);
    const uniquePapers = new Set(round1Indices);
    expect(uniquePapers.size).toBe(35);
    for (let i = 0; i < 35; i++) {
      expect(uniquePapers.has(i)).toBe(true);
    }
  });

  it('maps every mock to its exact user-specified timed session slot', () => {
    // Mock 1: 8:00 AM – 10:00 AM
    const mock1 = getMockExamDetails(1);
    expect(mock1.examNumber).toBe(1);
    expect(mock1.timeSlot).toBe('8:00 AM – 10:00 AM');
    expect(mock1.sessionName).toBe('Mock 1: Morning Simulation');

    // Mock 2: 11:00 AM – 1:00 PM
    const mock2 = getMockExamDetails(2);
    expect(mock2.timeSlot).toBe('11:00 AM – 1:00 PM');

    // Mock 3: 2:00 PM – 4:00 PM
    const mock3 = getMockExamDetails(3);
    expect(mock3.timeSlot).toBe('2:00 PM – 4:00 PM');

    // Mock 4: 8:00 PM – 10:00 PM
    const mock4 = getMockExamDetails(4);
    expect(mock4.timeSlot).toBe('8:00 PM – 10:00 PM');

    // Mock 5: 10:30 PM – 12:30 AM
    const mock5 = getMockExamDetails(5);
    expect(mock5.timeSlot).toBe('10:30 PM – 12:30 AM');

    // Mock 6: 1:00 AM – 3:00 AM
    const mock6 = getMockExamDetails(6);
    expect(mock6.timeSlot).toBe('1:00 AM – 3:00 AM');
  });

  it('returns 6 mock exams per study day', () => {
    const day1Mocks = getMockExamsForDay(1);
    expect(day1Mocks).toEqual(['mock01', 'mock02', 'mock03', 'mock04', 'mock05', 'mock06']);
    expect(getExamNumberForMock(1, 0)).toBe(1);
    expect(getExamNumberForMock(1, 5)).toBe(6);
    expect(getExamNumberForMock(2, 0)).toBe(7);
  });

  it('validates total question targets: 1200 practice + 3600 mock = 4800 total questions', () => {
    expect(TOTAL_PRACTICE_TARGET).toBe(1200);
    expect(TOTAL_MOCK_EXAM_QUESTIONS).toBe(3600);
    expect(TOTAL_MISSION_QUESTIONS).toBe(4800);
    expect(TOTAL_PRACTICE_TARGET + TOTAL_MOCK_EXAM_QUESTIONS).toBe(TOTAL_MISSION_QUESTIONS);
  });
});
