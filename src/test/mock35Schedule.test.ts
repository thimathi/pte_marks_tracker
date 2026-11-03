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
  getExamNumberForMock,
  getSectionTestForDay,
  TOTAL_SECTION_TESTS
} from '../config/constants';

describe('35 Mock Exam Catalog & 4 Daily Mocks Progression Verification', () => {
  it('contains exactly 35 user-specified mock exam papers', () => {
    expect(APEUNI_VIP_MOCKS.length).toBe(35);
    expect(APEUNI_VIP_MOCKS[0]).toBe('【VIP Full Test】PTE Mock Test 45C');
    expect(APEUNI_VIP_MOCKS[1]).toBe('【VIP Full Test】PTE Mock Test 44C');
    expect(APEUNI_VIP_MOCKS[34]).toBe('【VIP Full Test】PTE Mock Test 22B (7th Aug. new version)');
  });

  it('configures 14 intensive study days and 56 total mocks (4 mocks/day, 50+ Target)', () => {
    expect(TOTAL_STUDY_DAYS).toBe(14);
    expect(TOTAL_MOCK_TARGET).toBe(56);
    expect(DAILY_MOCK_SCHEDULE.length).toBe(4);
    expect(TOTAL_SECTION_TESTS).toBe(12);
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
    // Mock 1: 12:00 AM – 02:00 AM
    const mock1 = getMockExamDetails(1);
    expect(mock1.examNumber).toBe(1);
    expect(mock1.timeSlot).toBe('12:00 AM – 02:00 AM');
    expect(mock1.sessionName).toBe('Mock 1: Midnight Simulation');

    // Mock 2: 09:00 AM – 11:00 AM
    const mock2 = getMockExamDetails(2);
    expect(mock2.timeSlot).toBe('09:00 AM – 11:00 AM');
    expect(mock2.sessionName).toBe('Mock 2: Morning Simulation');

    // Mock 3: 01:00 PM – 03:00 PM
    const mock3 = getMockExamDetails(3);
    expect(mock3.timeSlot).toBe('01:00 PM – 03:00 PM');
    expect(mock3.sessionName).toBe('Mock 3: Afternoon Simulation');

    // Mock 4: 04:00 PM – 06:00 PM
    const mock4 = getMockExamDetails(4);
    expect(mock4.timeSlot).toBe('04:00 PM – 06:00 PM');
    expect(mock4.sessionName).toBe('Mock 4: Evening Simulation');
  });

  it('returns 4 mock exams per study day', () => {
    const day1Mocks = getMockExamsForDay(1);
    expect(day1Mocks).toEqual(['mock01', 'mock02', 'mock03', 'mock04']);
    expect(getExamNumberForMock(1, 0)).toBe(1);
    expect(getExamNumberForMock(1, 3)).toBe(4);
    expect(getExamNumberForMock(2, 0)).toBe(5);
  });

  it('schedules 12 section tests across 14 days (Day 7 and 14 as buffer)', () => {
    expect(getSectionTestForDay(1)?.skill).toBe('speaking');
    expect(getSectionTestForDay(2)?.skill).toBe('reading');
    expect(getSectionTestForDay(3)?.skill).toBe('listening');
    expect(getSectionTestForDay(4)?.skill).toBe('writing');
    expect(getSectionTestForDay(7)).toBeNull(); // Day 7 weekly buffer
    expect(getSectionTestForDay(14)).toBeNull(); // Day 14 summit buffer
  });

  it('validates total question targets: 3,360 mock questions and ~3,600+ mission questions', () => {
    expect(TOTAL_MOCK_EXAM_QUESTIONS).toBe(3360);
    expect(TOTAL_MISSION_QUESTIONS).toBeGreaterThanOrEqual(3500);
  });
});
