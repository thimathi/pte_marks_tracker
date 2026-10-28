import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';
import { DEFAULT_START_DATE, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 17 consecutive ISO dates from start date (October 28, 2026)', () => {
    const dates = calculate21StudyDates(DEFAULT_START_DATE, TOTAL_STUDY_DAYS);
    expect(dates.length).toBe(17);
    expect(dates[0]).toBe('2026-10-28'); // Day 1
    expect(dates[1]).toBe('2026-10-29'); // Day 2
    expect(dates[16]).toBe('2026-11-13'); // Day 17
  });

  it('supports custom duration when requested (e.g. 17 days)', () => {
    const dates = calculate21StudyDates('2026-10-28', 17);
    expect(dates.length).toBe(17);
    expect(dates[0]).toBe('2026-10-28');
    expect(dates[16]).toBe('2026-11-13');
  });

  it('correctly retrieves date for any specific study day (1 to 17)', () => {
    const startDate = '2026-10-28';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-28');
    expect(getDateForDay(startDate, 10)).toBe('2026-11-06');
    expect(getDateForDay(startDate, 17)).toBe('2026-11-13');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-28');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('28');
  });
});