import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';
import { DEFAULT_START_DATE, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 20 consecutive ISO dates from start date (October 25, 2026)', () => {
    const dates = calculate21StudyDates(DEFAULT_START_DATE, TOTAL_STUDY_DAYS);
    expect(dates.length).toBe(20);
    expect(dates[0]).toBe('2026-10-25'); // Day 1
    expect(dates[1]).toBe('2026-10-26'); // Day 2
    expect(dates[19]).toBe('2026-11-13'); // Day 20
  });

  it('supports custom duration when requested (e.g. 20 days)', () => {
    const dates = calculate21StudyDates('2026-10-25', 20);
    expect(dates.length).toBe(20);
    expect(dates[0]).toBe('2026-10-25');
    expect(dates[19]).toBe('2026-11-13');
  });

  it('correctly retrieves date for any specific study day (1 to 20)', () => {
    const startDate = '2026-10-25';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-25');
    expect(getDateForDay(startDate, 10)).toBe('2026-11-03');
    expect(getDateForDay(startDate, 20)).toBe('2026-11-13');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-25');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('25');
  });
});