import { DayData, QuestionAttempt, SkillType, TargetScores } from '../types/pte';
import { QUESTION_TYPE_MAP, QUESTION_TYPES, TOTAL_STUDY_DAYS } from '../config/constants';

export interface ScoreSummary {
  average: number | null;
  count: number;
  totalTarget: number;
  completedPercent: number;
}

/**
 * Calculates average and count from an array of numeric values, ignoring nulls and blanks.
 */
export function calculateAverage(scores: (number | null | undefined)[]): { average: number | null; count: number } {
  const valid = scores.filter((s): s is number => typeof s === 'number' && !isNaN(s) && isFinite(s));
  if (valid.length === 0) {
    return { average: null, count: 0 };
  }
  const sum = valid.reduce((a, b) => a + b, 0);
  return {
    average: Math.round((sum / valid.length) * 10) / 10,
    count: valid.length
  };
}

/**
 * Calculates phase average for up to 5 questions in a given range
 */
export function calculatePhaseAverage(
  attempts: Record<number, QuestionAttempt> | undefined,
  startIndex: number,
  endIndex: number
): { average: number | null; count: number; total: number } {
  const scores: (number | null)[] = [];
  const total = endIndex - startIndex;

  for (let i = startIndex; i < endIndex; i++) {
    const a = attempts?.[i];
    scores.push(a?.score ?? null);
  }

  const { average, count } = calculateAverage(scores);
  return { average, count, total };
}

/**
 * Calculates score metrics for a specific question type in a day
 */
export function calculateQuestionTypeStats(
  attempts: Record<number, QuestionAttempt> | undefined,
  target: number
): ScoreSummary {
  const scores: (number | null)[] = [];
  let completed = 0;

  for (let i = 0; i < target; i++) {
    const a = attempts?.[i];
    if (a && typeof a.score === 'number' && !isNaN(a.score)) {
      scores.push(a.score);
      completed++;
    }
  }

  const { average, count } = calculateAverage(scores);
  return {
    average,
    count,
    totalTarget: target,
    completedPercent: target > 0 ? Math.round((completed / target) * 100) : 0
  };
}

/**
 * Calculates daily performance breakdown for a given DayData
 */
export function calculateDayBreakdown(dayData: DayData | null | undefined, targets: Record<string, number>) {
  const skillScores: Record<SkillType, number[]> = {
    speaking: [],
    writing: [],
    reading: [],
    listening: []
  };

  const allScores: number[] = [];
  let totalCompleted = 0;
  let totalDailyTarget = 0;

  for (const meta of QUESTION_TYPES) {
    const target = targets[meta.id] ?? meta.defaultTarget;
    totalDailyTarget += target;

    const attempts = dayData?.questionProgress?.[meta.id]?.attempts || {};
    for (let i = 0; i < target; i++) {
      const a = attempts[i];
      if (a && typeof a.score === 'number' && !isNaN(a.score)) {
        allScores.push(a.score);
        totalCompleted++;
        skillScores[meta.skill].push(a.score);
        // If secondary skill exists (e.g. R&W FIB, WFD, RS), also contribute to secondary skill
        if (meta.secondarySkill) {
          skillScores[meta.secondarySkill].push(a.score);
        }
      }
    }
  }

  const dailyAvg = calculateAverage(allScores);
  const speakingAvg = calculateAverage(skillScores.speaking);
  const writingAvg = calculateAverage(skillScores.writing);
  const readingAvg = calculateAverage(skillScores.reading);
  const listeningAvg = calculateAverage(skillScores.listening);

  return {
    totalCompleted,
    totalDailyTarget,
    completionPercentage: totalDailyTarget > 0 ? Math.round((totalCompleted / totalDailyTarget) * 100) : 0,
    dailyAverage: dailyAvg.average,
    dailyCount: dailyAvg.count,
    speakingAverage: speakingAvg.average,
    speakingCount: speakingAvg.count,
    writingAverage: writingAvg.average,
    writingCount: writingAvg.count,
    readingAverage: readingAvg.average,
    readingCount: readingAvg.count,
    listeningAverage: listeningAvg.average,
    listeningCount: listeningAvg.count
  };
}

/**
 * Finds the weakest skill and recommended questions to review based on recorded attempts
 */
export function getWeaknessAnalysis(
  skillAverages: Record<SkillType, number | null>,
  targetScores: TargetScores
): {
  weakestSkill: SkillType | null;
  gap: number;
  recommendations: string[];
} {
  const skills: SkillType[] = ['speaking', 'writing', 'reading', 'listening'];
  let weakestSkill: SkillType | null = null;
  let maxGap = -Infinity;

  for (const s of skills) {
    const avg = skillAverages[s];
    if (avg !== null) {
      const target = targetScores[s];
      const gap = target - avg; // positive means below target
      if (gap > maxGap) {
        maxGap = gap;
        weakestSkill = s;
      }
    }
  }

  const recommendations: string[] = [];
  if (weakestSkill) {
    const relevantTypes = QUESTION_TYPES.filter(q => q.skill === weakestSkill || q.secondarySkill === weakestSkill);
    for (const t of relevantTypes) {
      if (t.isPrediction) {
        recommendations.push(`Priority: ${t.name} (${t.shortName}) - Critical Prediction focus`);
      } else {
        recommendations.push(`Drill: ${t.name} (${t.shortName})`);
      }
    }
  }

  return {
    weakestSkill,
    gap: maxGap > -Infinity ? Math.round(maxGap * 10) / 10 : 0,
    recommendations: recommendations.slice(0, 4)
  };
}

/**
 * Calculates current streak of fully completed consecutive study days
 */
export function calculateStreak(days: Record<number, DayData>, maxDays: number = TOTAL_STUDY_DAYS): number {
  let streak = 0;
  for (let d = 1; d <= maxDays; d++) {
    const day = days[d];
    if (day && day.status === 'completed') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export interface QuestionTypeCumulative {
  meta: (typeof QUESTION_TYPES)[0];
  dailyTarget: number;
  totalTarget: number; // e.g. 40 * 20 = 800
  completed: number;
  average: number | null;
  percent: number;
}

export interface CumulativeProgressSummary {
  questions: QuestionTypeCumulative[];
  totalPracticeCompleted: number;
  totalPracticeGoal: number; // e.g. 6,000
  practicePercent: number;
  totalMocksCompleted: number;
  totalMocksGoal: number; // 40
  mocksPercent: number;
  totalMockReviewsCompleted: number;
  overallAverage: number | null;
}

/**
 * Calculates global cumulative progress across all study days towards final deadline (November 16)
 * Question-wise tracking: e.g. Read Aloud 800 total, Repeat Sentence 1000 total, etc.
 */
export function calculateCumulativeProgress(
  days: Record<number, DayData>,
  targets: Record<string, number>,
  totalDays: number = TOTAL_STUDY_DAYS
): CumulativeProgressSummary {
  let totalPracticeCompleted = 0;
  let totalPracticeGoal = 0;
  let totalMocksCompleted = 0;
  let totalMockReviewsCompleted = 0;
  const allPracticeScores: number[] = [];

  const questions: QuestionTypeCumulative[] = QUESTION_TYPES.map((meta) => {
    const dailyTarget = targets[meta.id] ?? meta.defaultTarget;
    const totalTarget = dailyTarget * totalDays;
    totalPracticeGoal += totalTarget;

    const scoresForType: number[] = [];
    let completedForType = 0;

    for (let d = 1; d <= totalDays; d++) {
      const day = days[d];
      if (!day) continue;
      const atts = day.questionProgress?.[meta.id]?.attempts || {};
      for (const [_, a] of Object.entries(atts)) {
        if (a && typeof a.score === 'number' && !isNaN(a.score)) {
          scoresForType.push(a.score);
          allPracticeScores.push(a.score);
          completedForType++;
          totalPracticeCompleted++;
        }
      }
    }

    const avg = calculateAverage(scoresForType).average;
    const percent = totalTarget > 0 ? Math.round((completedForType / totalTarget) * 100) : 0;

    return {
      meta,
      dailyTarget,
      totalTarget,
      completed: completedForType,
      average: avg,
      percent
    };
  });

  const totalMocksGoal = 40;
  for (let d = 1; d <= totalDays; d++) {
    const day = days[d];
    if (!day) continue;
    const mocks = day.mockExams || {};
    for (const [_, m] of Object.entries(mocks)) {
      if (m && m.isCompleted) totalMocksCompleted++;
    }
    const revs = day.mockReviews || {};
    for (const [_, r] of Object.entries(revs)) {
      if (r && r.isCompleted) totalMockReviewsCompleted++;
    }
  }

  const overallAvg = calculateAverage(allPracticeScores).average;
  const practicePercent = totalPracticeGoal > 0 ? Math.round((totalPracticeCompleted / totalPracticeGoal) * 100) : 0;
  const mocksPercent = totalMocksGoal > 0 ? Math.round((totalMocksCompleted / totalMocksGoal) * 100) : 0;

  return {
    questions,
    totalPracticeCompleted,
    totalPracticeGoal,
    practicePercent,
    totalMocksCompleted,
    totalMocksGoal,
    mocksPercent,
    totalMockReviewsCompleted,
    overallAverage: overallAvg
  };
}

