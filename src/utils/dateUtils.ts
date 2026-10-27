import { TOTAL_STUDY_DAYS } from '../config/constants';

/**
 * Utilities for calculating and formatting study dates
 */

/**
 * Calculates ISO date strings (YYYY-MM-DD) for Day 1 through Day N based on startDate.
 */
export function calculate21StudyDates(startDateStr: string, totalDays: number = TOTAL_STUDY_DAYS): string[] {
  const dates: string[] = [];
  const parts = startDateStr.split('-').map(Number);
  const start = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(start);
    cur.setUTCDate(start.getUTCDate() + i);
    dates.push(cur.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Returns the planned date for a specific day number
 */
export function getDateForDay(startDateStr: string, dayNumber: number, totalDays: number = TOTAL_STUDY_DAYS): string {
  const dates = calculate21StudyDates(startDateStr, totalDays);
  return dates[dayNumber - 1] || startDateStr;
}

/**
 * Formats YYYY-MM-DD into a human-friendly format, e.g. "Sun, Oct 11, 2026"
 */
export function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Returns today's ISO date string (YYYY-MM-DD) in local time
 */
export function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a planned date is in the past compared to today
 */
export function isDatePast(dateStr: string): boolean {
  return dateStr < getTodayIso();
}

/**
 * Calculates current study day number based on actual calendar date.
 * If today is the start date (e.g. 2026-10-25), returns 1.
 * As midnight (00:00) strikes each day, it automatically advances to Day 2, Day 3, etc.
 */
export function getCalendarDayNumber(
  startDateStr: string,
  todayIso: string = getTodayIso(),
  totalDays: number = TOTAL_STUDY_DAYS
): number {
  if (!startDateStr) return 1;
  const parts = startDateStr.split('-').map(Number);
  const start = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  const tParts = todayIso.split('-').map(Number);
  const today = new Date(Date.UTC(tParts[0], tParts[1] - 1, tParts[2]));

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dayNum = diffDays + 1;
  return Math.min(Math.max(1, dayNum), totalDays);
}

/**
 * Returns remaining days until target summit deadline (e.g. 2026-11-16)
 */
export function getDaysRemainingUntilDeadline(
  deadlineStr: string = '2026-11-16',
  todayIso: string = getTodayIso()
): number {
  const dParts = deadlineStr.split('-').map(Number);
  const deadline = new Date(Date.UTC(dParts[0], dParts[1] - 1, dParts[2]));
  const tParts = todayIso.split('-').map(Number);
  const today = new Date(Date.UTC(tParts[0], tParts[1] - 1, tParts[2]));

  const diffMs = deadline.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

