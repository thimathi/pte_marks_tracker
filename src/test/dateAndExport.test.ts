import { describe, it, expect } from 'vitest';
import { calculate21StudyDates, getDateForDay, formatDateFriendly } from '../utils/dateUtils';
import { DEFAULT_START_DATE, TOTAL_STUDY_DAYS } from '../config/constants';

describe('Date Calculations & Formatting', () => {
  it('calculates consecutive ISO dates for the intensive protocol', () => {
    const dates = calculate21StudyDates(DEFAULT_START_DATE, TOTAL_STUDY_DAYS);
    expect(dates.length).toBe(TOTAL_STUDY_DAYS);
    expect(dates[0]).toBe('2026-11-16'); // Day 1
    expect(dates[1]).toBe('2026-11-17'); // Day 2
    expect(dates[2]).toBe('2026-11-19'); // Day 3 (Nov 18 Colombo meeting skipped)
    expect(dates[29]).toBe('2026-12-16'); // Day 30 (Final Study Day before Dec 17 Exam)
  });

  it('supports custom duration when requested (e.g. 15 days)', () => {
    const dates = calculate21StudyDates('2026-11-03', 15);
    expect(dates.length).toBe(15);
    expect(dates[0]).toBe('2026-11-03');
    expect(dates[14]).toBe('2026-11-17');
  });

  it('correctly retrieves date for any specific study day', () => {
    const startDate = '2026-11-03';
    expect(getDateForDay(startDate, 1, 28)).toBe('2026-11-03');
    expect(getDateForDay(startDate, 5, 28)).toBe('2026-11-07');
    expect(getDateForDay(startDate, 28, 28)).toBe('2026-12-01'); // Skips Nov 18 leave day
  });

  it('formats friendly date correctly', () => {
    const formatted = formatDateFriendly('2026-11-03');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Nov');
    expect(formatted).toContain('3');
  });
});
