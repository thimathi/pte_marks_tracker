import { describe, it, expect } from 'vitest';
import {
  SECTION_TEST_SCHEDULE,
  getSectionTestForDay,
  TOTAL_SECTION_TESTS,
  TOTAL_STUDY_DAYS,
  DEFAULT_TARGET_SCORES,
  FINAL_TARGET_DATE,
  DAILY_15H_MASTER_SCHEDULE
} from '../config/constants';

describe('Daily Section Test Schedule & 15-Hour Work Plan Verification (Through Dec 10)', () => {
  it('does not assign section tests to Days 1, 2, and 3', () => {
    expect(getSectionTestForDay(1)).toBeNull();
    expect(getSectionTestForDay(2)).toBeNull();
    expect(getSectionTestForDay(3)).toBeNull();
  });

  it('assigns exactly 1 section test to every day starting from Day 4 through Day 37', () => {
    expect(TOTAL_SECTION_TESTS).toBe(34);
    for (let day = 4; day <= TOTAL_STUDY_DAYS; day++) {
      const secDef = getSectionTestForDay(day);
      expect(secDef).not.toBeNull();
      expect(secDef?.dayNumber).toBe(day);
      expect(secDef?.title).toBeTruthy();
      expect(secDef?.targetQuestions).toBeGreaterThan(0);
      expect(secDef?.estMinutes).toMatch(/min/);
      expect(secDef?.description.length).toBeGreaterThan(15);
      expect(secDef?.recommendedSlot).toMatch(/PM/);
      expect(['reading', 'listening', 'speaking', 'writing']).toContain(secDef?.skill);
    }
  });

  it('strictly respects the user priority hierarchy: Reading > Listening > Speaking > Writing', () => {
    const counts = {
      reading: 0,
      listening: 0,
      speaking: 0,
      writing: 0
    };

    for (let day = 4; day <= TOTAL_STUDY_DAYS; day++) {
      const secDef = getSectionTestForDay(day);
      if (secDef && secDef.skill in counts) {
        counts[secDef.skill as keyof typeof counts]++;
      }
    }

    // Verify individual counts for 34 tests across 37 days
    expect(counts.reading).toBe(11);
    expect(counts.listening).toBe(10);
    expect(counts.speaking).toBe(7);
    expect(counts.writing).toBe(6);

    // Verify priority: Reading > Listening > Speaking > Writing
    expect(counts.reading).toBeGreaterThan(counts.listening);
    expect(counts.listening).toBeGreaterThan(counts.speaking);
    expect(counts.speaking).toBeGreaterThan(counts.writing);

    const totalAssigned = counts.reading + counts.listening + counts.speaking + counts.writing;
    expect(totalAssigned).toBe(TOTAL_SECTION_TESTS);
  });

  it('guarantees no two consecutive days have the same skill (no back-to-back repeats)', () => {
    for (let day = 4; day < TOTAL_STUDY_DAYS; day++) {
      const currentSec = getSectionTestForDay(day);
      const nextSec = getSectionTestForDay(day + 1);

      expect(currentSec).not.toBeNull();
      expect(nextSec).not.toBeNull();
      expect(currentSec!.skill).not.toBe(nextSec!.skill);
    }
  });

  it('configures new target scores: S:87, W:84, R:69, L:68, Overall:78 and Dec 10 exam', () => {
    expect(DEFAULT_TARGET_SCORES.speaking).toBe(87);
    expect(DEFAULT_TARGET_SCORES.writing).toBe(84);
    expect(DEFAULT_TARGET_SCORES.reading).toBe(69);
    expect(DEFAULT_TARGET_SCORES.listening).toBe(68);
    expect(DEFAULT_TARGET_SCORES.overall).toBe(78);
    expect(FINAL_TARGET_DATE).toBe('2026-12-10');
  });

  it('configures the 14-15 Hour Master Daily Schedule (7 Strategic Blocks = 14.25-15h)', () => {
    expect(DAILY_15H_MASTER_SCHEDULE.length).toBe(7);
    const totalHours = DAILY_15H_MASTER_SCHEDULE.reduce((sum, b) => sum + b.durationHours, 0);
    expect(totalHours).toBeGreaterThanOrEqual(14.0);
    expect(totalHours).toBeLessThanOrEqual(15.0);

    // Block 1: Speaking 87 (2.5h)
    expect(DAILY_15H_MASTER_SCHEDULE[0].durationHours).toBe(2.5);
    expect(DAILY_15H_MASTER_SCHEDULE[0].targetSkill).toBe('speaking');
    expect(DAILY_15H_MASTER_SCHEDULE[0].targetScoreBenchmark).toBe(87);

    // Block 2: Mock 1 + Review (3.0h)
    expect(DAILY_15H_MASTER_SCHEDULE[1].durationHours).toBe(3.0);
    expect(DAILY_15H_MASTER_SCHEDULE[1].targetSkill).toBe('mock');
  });
});
