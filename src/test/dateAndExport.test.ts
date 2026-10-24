import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';
import { DEFAULT_START_DATE, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 22 consecutive ISO dates from start date (October 25, 2026)', () => {
    const dates = calculate21StudyDates(DEFAULT_START_DATE, TOTAL_STUDY_DAYS);
    expect(dates.length).toBe(22);
    expect(dates[0]).toBe('2026-10-25'); // Day 1
    expect(dates[1]).toBe('2026-10-26'); // Day 2
    expect(dates[21]).toBe('2026-11-15'); // Day 22
  });

  it('supports custom duration when requested (e.g. 22 days)', () => {
    const dates = calculate21StudyDates('2026-10-25', 22);
    expect(dates.length).toBe(22);
    expect(dates[0]).toBe('2026-10-25');
    expect(dates[21]).toBe('2026-11-15');
  });

  it('correctly retrieves date for any specific study day (1 to 22)', () => {
    const startDate = '2026-10-25';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-25');
    expect(getDateForDay(startDate, 10)).toBe('2026-11-03');
    expect(getDateForDay(startDate, 22)).toBe('2026-11-15');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-25');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('25');
  });
});