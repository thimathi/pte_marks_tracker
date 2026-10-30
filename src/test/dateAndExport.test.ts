import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';
import { DEFAULT_START_DATE, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 15 consecutive ISO dates starting October 30, 2026', () => {
    const dates = calculate21StudyDates(DEFAULT_START_DATE, TOTAL_STUDY_DAYS);
    expect(dates.length).toBe(15);
    expect(dates[0]).toBe('2026-10-30'); // Day 1
    expect(dates[1]).toBe('2026-10-31'); // Day 2
    expect(dates[14]).toBe('2026-11-13'); // Day 15
  });

  it('supports custom duration when requested (e.g. 15 days)', () => {
    const dates = calculate21StudyDates('2026-10-30', 15);
    expect(dates.length).toBe(15);
    expect(dates[0]).toBe('2026-10-30');
    expect(dates[14]).toBe('2026-11-13');
  });

  it('correctly retrieves date for any specific study day (1 to 15)', () => {
    const startDate = '2026-10-30';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-30');
    expect(getDateForDay(startDate, 10)).toBe('2026-11-08');
    expect(getDateForDay(startDate, 15)).toBe('2026-11-13');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-30');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('30');
  });
});
