/**
 * Utilities for calculating and formatting 21 study dates
 */

/**
 * Calculates ISO date strings (YYYY-MM-DD) for Day 1 through Day 21 based on startDate.
 */
export function calculate21StudyDates(startDateStr: string): string[] {
  const dates: string[] = [];
  const parts = startDateStr.split('-').map(Number);
  const start = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  for (let i = 0; i < 21; i++) {
    const cur = new Date(start);
    cur.setUTCDate(start.getUTCDate() + i);
    dates.push(cur.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Returns the planned date for a specific day number (1 to 21)
 */
export function getDateForDay(startDateStr: string, dayNumber: number): string {
  const dates = calculate21StudyDates(startDateStr);
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
