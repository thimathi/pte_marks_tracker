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

describe('35 Mock Exam Catalog & 15-Day Shuffled Progression Verification', () => {
  it('contains exactly 35 user-specified mock exam papers', () => {
    expect(APEUNI_VIP_MOCKS.length).toBe(35);
    expect(APEUNI_VIP_MOCKS[0]).toBe('【VIP Full Test】PTE Mock Test 45C');
    expect(APEUNI_VIP_MOCKS[1]).toBe('【VIP Full Test】PTE Mock Test 44C');
    expect(APEUNI_VIP_MOCKS[34]).toBe('【VIP Full Test】PTE Mock Test 22B (7th Aug. new version)');
  });

  it('configures 15 study days and 75 total mocks (covering 35 papers 2 full times + Day 15 summit)', () => {
    expect(TOTAL_STUDY_DAYS).toBe(15);
    expect(TOTAL_MOCK_TARGET).toBe(75);
    expect(MOCK_EXAM_SCHEDULE_INDICES.length).toBe(75);
  });

  it('guarantees Round 1 (Days 1–7, Mocks 1–35) covers all 35 papers without duplicate', () => {
    const round1Indices = MOCK_EXAM_SCHEDULE_INDICES.slice(0, 35);
    expect(round1Indices.length).toBe(35);
    const uniquePapers = new Set(round1Indices);
    expect(uniquePapers.size).toBe(35);
    for (let i = 0; i < 35; i++) {
      expect(uniquePapers.has(i)).toBe(true);
    }
  });

  it('guarantees Round 2 (Days 8–14, Mocks 36–70) covers all 35 papers without duplicate', () => {
    const round2Indices = MOCK_EXAM_SCHEDULE_INDICES.slice(35, 70);
    expect(round2Indices.length).toBe(35);
    const uniquePapers = new Set(round2Indices);
    expect(uniquePapers.size).toBe(35);
    for (let i = 0; i < 35; i++) {
      expect(uniquePapers.has(i)).toBe(true);
    }
  });

  it('configures Day 15 Grand Summit with top 5 high-yield VIP simulation papers', () => {
    const day15Indices = MOCK_EXAM_SCHEDULE_INDICES.slice(70, 75);
    expect(day15Indices.length).toBe(5);
    // 45C, 44C, 44B, 44A, 43B
    expect(day15Indices).toEqual([0, 1, 2, 3, 5]);
  });

  it('maps every mock to its exact timed session slot and round details', () => {
    // Test Exam 1 (Day 1 Mock 1)
    const mock1 = getMockExamDetails(1);
    expect(mock1.examNumber).toBe(1);
    expect(mock1.roundNumber).toBe(1);
    expect(mock1.timeSlot).toBe('8:00 AM – 10:00 AM');
    expect(mock1.sessionName).toBe('Session 1: Morning Simulation');

    // Test Exam 5 (Day 1 Mock 5)
    const mock5 = getMockExamDetails(5);
    expect(mock5.timeSlot).toBe('11:00 PM – 1:00 AM');
    expect(mock5.sessionName).toBe('Session 5: Late Night Peak Simulation');

    // Test Exam 36 (Day 8 Mock 1 - Start of Round 2)
    const mock36 = getMockExamDetails(36);
    expect(mock36.roundNumber).toBe(2);
    expect(mock36.roundTitle).toContain('Round 2');

    // Test Exam 71 (Day 15 Mock 1 - Summit)
    const mock71 = getMockExamDetails(71);
    expect(mock71.roundNumber).toBe(3);
    expect(mock71.roundTitle).toContain('Grand Summit');
    expect(mock71.testName).toBe('【VIP Full Test】PTE Mock Test 45C');
  });

  it('validates total question targets: 1500 practice + 4500 mock = 6000 total questions', () => {
    expect(TOTAL_PRACTICE_TARGET).toBe(1500);
    expect(TOTAL_MOCK_EXAM_QUESTIONS).toBe(4500);
    expect(TOTAL_MISSION_QUESTIONS).toBe(6000);
    expect(TOTAL_PRACTICE_TARGET + TOTAL_MOCK_EXAM_QUESTIONS).toBe(TOTAL_MISSION_QUESTIONS);
  });
});
