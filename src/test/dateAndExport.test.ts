import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 25 consecutive ISO dates from start date by default', () => {
    const dates = calculate21StudyDates('2026-10-18');
    expect(dates.length).toBe(25);
    expect(dates[0]).toBe('2026-10-18'); // Day 1
    expect(dates[1]).toBe('2026-10-19'); // Day 2
    expect(dates[24]).toBe('2026-11-11'); // Day 25
  });

  it('supports custom duration when requested (e.g. 21 days)', () => {
    const dates = calculate21StudyDates('2026-10-11', 21);
    expect(dates.length).toBe(21);
    expect(dates[0]).toBe('2026-10-11');
    expect(dates[20]).toBe('2026-10-31');
  });

  it('correctly retrieves date for any specific study day (1 to 25)', () => {
    const startDate = '2026-10-18';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-18');
    expect(getDateForDay(startDate, 10)).toBe('2026-10-27');
    expect(getDateForDay(startDate, 25)).toBe('2026-11-11');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-18');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('18');
  });
});
