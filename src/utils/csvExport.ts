import { DayData, StudyPlan } from '../types/pte';
import { QUESTION_TYPE_MAP, QUESTION_TYPES, TOTAL_STUDY_DAYS } from '../config/constants';
import { calculateDayBreakdown } from './scoring';

/**
 * Escapes a field for safe CSV representation
 */
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates and downloads a complete CSV file of all practice scores across all study days
 */
export function exportPracticeScoresCsv(days: Record<number, DayData>, plan: StudyPlan) {
  const headers = [
    'Study Day',
    'Date',
    'Skill',
    'Question Type ID',
    'Question Type Name',
    'Prediction Priority',
    'Question Number',
    'Score / 90',
    'Flagged For Review',
    'Reviewed',
    'Notes',
    'Review Notes'
  ];

  const rows: string[][] = [];
  const maxDays = plan.durationDays || TOTAL_STUDY_DAYS;

  for (let d = 1; d <= maxDays; d++) {
    const dayData = days[d];
    if (!dayData) continue;

    for (const meta of QUESTION_TYPES) {
      const target = plan.questionTargets[meta.id] ?? meta.defaultTarget;
      const attempts = dayData.questionProgress?.[meta.id]?.attempts || {};

      for (let i = 0; i < target; i++) {
        const a = attempts[i];
        if (a && a.score !== null) {
          rows.push([
            `Day ${d}`,
            dayData.date,
            meta.skill.toUpperCase(),
            meta.id,
            meta.name,
            meta.isPrediction ? 'YES' : 'NO',
            `Q${i + 1}`,
            String(a.score),
            a.isFlaggedForReview ? 'YES' : 'NO',
            a.reviewed ? 'YES' : 'NO',
            a.notes || '',
            a.reviewNotes || ''
          ]);
        }
      }
    }
  }

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\n');

  downloadCsv(csvContent, `PTE_21Day_Practice_Scores_${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Generates and downloads a complete CSV of all planned Mock Exams and Reviews
 */
export function exportMockExamsCsv(days: Record<number, DayData>, maxDays: number = TOTAL_STUDY_DAYS) {
  const headers = [
    'Study Day',
    'Date',
    'Mock ID',
    'Exam #',
    'Overall Score',
    'Speaking Score',
    'Writing Score',
    'Reading Score',
    'Listening Score',
    'Exam Completed',
    'Main Mistakes',
    'Personal Notes',
    'Review Completed',
    'Review Duration (min)',
    'Review Notes',
    'Corrective Actions'
  ];

  const rows: string[][] = [];

  for (let d = 1; d <= maxDays; d++) {
    const dayData = days[d];
    if (!dayData) continue;

    const mocks: ('mock01' | 'mock02')[] = ['mock01', 'mock02'];
    for (const mId of mocks) {
      const mock = dayData.mockExams?.[mId];
      const rev = dayData.mockReviews?.[mId === 'mock01' ? 'review01' : 'review02'];
      if (!mock) continue;

      rows.push([
        `Day ${d}`,
        dayData.date,
        mId,
        String(mock.examNumber),
        mock.overallScore !== null ? String(mock.overallScore) : '',
        mock.speakingScore !== null ? String(mock.speakingScore) : '',
        mock.writingScore !== null ? String(mock.writingScore) : '',
        mock.readingScore !== null ? String(mock.readingScore) : '',
        mock.listeningScore !== null ? String(mock.listeningScore) : '',
        mock.isCompleted ? 'YES' : 'NO',
        mock.mainMistakes || '',
        mock.notes || '',
        rev?.isCompleted ? 'YES' : 'NO',
        rev ? String(rev.durationMinutes || 0) : '0',
        rev?.reviewNotes || '',
        rev?.correctiveActions || ''
      ]);
    }
  }

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\n');

  downloadCsv(csvContent, `PTE_42_Mock_Exams_Report_${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Triggers browser download for CSV string
 */
function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
