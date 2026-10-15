import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';

describe('Date Calculations & Formatting', () => {
  it('calculates exactly 21 consecutive ISO dates from start date', () => {
    const dates = calculate21StudyDates('2026-10-11');
    expect(dates.length).toBe(21);
    expect(dates[0]).toBe('2026-10-11'); // Day 1
    expect(dates[1]).toBe('2026-10-12'); // Day 2
    expect(dates[20]).toBe('2026-10-31'); // Day 21
  });

  it('correctly retrieves date for any specific study day (1 to 21)', () => {
    const startDate = '2026-10-11';
    expect(getDateForDay(startDate, 1)).toBe('2026-10-11');
    expect(getDateForDay(startDate, 10)).toBe('2026-10-20');
    expect(getDateForDay(startDate, 21)).toBe('2026-10-31');
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-10-11');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('11');
  });
});
