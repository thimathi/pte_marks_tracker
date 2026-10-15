import { describe, it, expect } from 'vitest';
import {
  calculateAverage,
  calculatePhaseAverage,
  calculateQuestionTypeStats,
  calculateDayBreakdown,
  calculateStreak,
  getWeaknessAnalysis
} from '../utils/scoring';
import { createDefaultDayData } from '../services/databaseService';
import { DEFAULT_QUESTION_TARGETS, DEFAULT_TARGET_SCORES } from '../config/constants';

describe('Scoring & Averages Calculation', () => {
  it('omits blank or null scores from averages', () => {
    const scores = [80, null, 90, undefined, 70];
    const { average, count } = calculateAverage(scores);
    expect(count).toBe(3);
    expect(average).toBe(80); // (80 + 90 + 70) / 3 = 80
  });

  it('handles completely blank question sets safely without NaN', () => {
    const scores = [null, null, undefined];
    const { average, count } = calculateAverage(scores);
    expect(count).toBe(0);
    expect(average).toBeNull();
  });

  it('correctly calculates 5-question phase averages', () => {
    const attempts = {
      0: { qIndex: 0, score: 85 },
      1: { qIndex: 1, score: 75 },
      2: { qIndex: 2, score: 80 },
      3: { qIndex: 3, score: null },
      4: { qIndex: 4, score: 90 },
    };

    const phaseResult = calculatePhaseAverage(attempts, 0, 5);
    expect(phaseResult.count).toBe(4);
    expect(phaseResult.total).toBe(5);
    expect(phaseResult.average).toBe(82.5); // (85 + 75 + 80 + 90) / 4 = 82.5
  });

  it('calculates question-type completion percentage accurately', () => {
    const attempts = {
      0: { qIndex: 0, score: 79 },
      1: { qIndex: 1, score: 81 },
      2: { qIndex: 2, score: 85 },
    };

    const stats = calculateQuestionTypeStats(attempts, 10);
    expect(stats.count).toBe(3);
    expect(stats.totalTarget).toBe(10);
    expect(stats.completedPercent).toBe(30);
    expect(stats.average).toBe(81.7);
  });

  it('correctly calculates study streak of consecutive completed days', () => {
    const days: any = {
      1: { dayNumber: 1, status: 'completed' },
      2: { dayNumber: 2, status: 'completed' },
      3: { dayNumber: 3, status: 'completed' },
      4: { dayNumber: 4, status: 'active' },
      5: { dayNumber: 5, status: 'locked' }
    };
    expect(calculateStreak(days)).toBe(3);
  });

  it('identifies weakest skill and calculates target score gap', () => {
    const skillAverages = {
      speaking: 84,
      writing: 81,
      reading: 68,
      listening: 79
    };
    const target = { ...DEFAULT_TARGET_SCORES, reading: 79 };
    const analysis = getWeaknessAnalysis(skillAverages, target);

    expect(analysis.weakestSkill).toBe('reading');
    expect(analysis.gap).toBe(11); // 79 - 68 = 11
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });
});
