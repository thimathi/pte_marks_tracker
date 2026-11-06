import { describe, it, expect } from 'vitest';
import {
  SECTION_TEST_SCHEDULE,
  getSectionTestForDay,
  TOTAL_SECTION_TESTS,
  TOTAL_STUDY_DAYS
} from '../config/constants';

describe('Daily Section Test Schedule Verification (Starting Day 4)', () => {
  it('does not assign section tests to Days 1, 2, and 3', () => {
    expect(getSectionTestForDay(1)).toBeNull();
    expect(getSectionTestForDay(2)).toBeNull();
    expect(getSectionTestForDay(3)).toBeNull();
  });

  it('assigns exactly 1 section test to every day starting from Day 4 through Day 27', () => {
    expect(TOTAL_SECTION_TESTS).toBe(24);
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

    // Verify individual counts
    expect(counts.reading).toBe(8);
    expect(counts.listening).toBe(7);
    expect(counts.speaking).toBe(5);
    expect(counts.writing).toBe(4);

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

  it('provides Day 4 as the first active section test (VIP Reading Section Test 1)', () => {
    const day4Sec = getSectionTestForDay(4);
    expect(day4Sec?.skill).toBe('reading');
    expect(day4Sec?.title).toBe('VIP Reading Section Test 1');
    expect(day4Sec?.targetQuestions).toBe(18);
  });
});
