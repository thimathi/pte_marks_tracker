import { DayData, QuestionAttempt, QuestionTypeProgress } from '../types/pte';
import { DEFAULT_ADDITIONAL_EXERCISES, QUESTION_TYPES } from '../config/constants';

const LEGACY_TYPE_MAP: Record<string, string> = {
  'speaking_0': 'read_aloud',
  'speaking_1': 'repeat_sentence',
  'speaking_2': 'describe_image',
  'speaking_3': 'retell_lecture',
  'speaking_4': 'respond_to_situation',
  'speaking_5': 'summarize_group_discussion',
  'speaking_6': 'answer_short_question',
  'writing_0': 'summarize_written_text',
  'writing_1': 'write_essay',
  'reading_0': 'rw_fill_in_blanks',
  'reading_1': 'r_fill_in_blanks',
  'reading_2': 'reorder_paragraph',
  'listening_0': 'write_from_dictation',
  'listening_1': 'listening_fill_in_blanks',
  'listening_2': 'highlight_incorrect_words',
  'listening_3': 'summarize_spoken_text',
};

export interface LegacyScanResult {
  foundDaysCount: number;
  foundDates: string[];
  totalScoresCount: number;
  hasMockExams: boolean;
  rawEntries: Record<string, any>;
}

/**
 * Scans localStorage for legacy v3 PTE tracker keys
 */
export function scanForLegacyData(): LegacyScanResult {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { foundDaysCount: 0, foundDates: [], totalScoresCount: 0, hasMockExams: false, rawEntries: {} };
  }

  const rawEntries: Record<string, any> = {};
  const foundDates: string[] = [];
  let totalScoresCount = 0;
  let hasMockExams = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('pte_daily_tracker_v3_')) {
      const date = key.replace('pte_daily_tracker_v3_', '');
      try {
        const val = JSON.parse(localStorage.getItem(key) || '{}');
        rawEntries[key] = val;
        foundDates.push(date);

        // Count scores
        for (const [legacyKey, targetKey] of Object.entries(LEGACY_TYPE_MAP)) {
          if (val[legacyKey] && Array.isArray(val[legacyKey].qs)) {
            const count = val[legacyKey].qs.filter((v: any) => v !== '' && v !== null && !isNaN(Number(v))).length;
            totalScoresCount += count;
          }
        }

        if (val['mock_1'] && val['mock_1'].score) {
          hasMockExams = true;
        }
      } catch (e) {
        console.warn(`Failed to parse legacy key ${key}`, e);
      }
    }
  }

  return {
    foundDaysCount: foundDates.length,
    foundDates,
    totalScoresCount,
    hasMockExams,
    rawEntries
  };
}

/**
 * Migrates a legacy day object into the modern DayData structure
 */
export function convertLegacyDayToModern(dateStr: string, legacyData: any, dayNumber: number): DayData {
  const questionProgress: Record<string, QuestionTypeProgress> = {};

  for (const [legacyKey, modernTypeId] of Object.entries(LEGACY_TYPE_MAP)) {
    const rawQs = legacyData[legacyKey]?.qs;
    const attempts: Record<number, QuestionAttempt> = {};

    if (Array.isArray(rawQs)) {
      rawQs.forEach((scoreVal: any, qIdx: number) => {
        if (scoreVal !== '' && scoreVal !== null && !isNaN(Number(scoreVal))) {
          const score = Number(scoreVal);
          attempts[qIdx] = {
            qIndex: qIdx,
            score,
            isFlaggedForReview: score < 65,
            reviewed: false,
            updatedAt: new Date().toISOString()
          };
        }
      });
    }

    questionProgress[modernTypeId] = { attempts };
  }

  // Ensure all 16 question types have an entry
  for (const q of QUESTION_TYPES) {
    if (!questionProgress[q.id]) {
      questionProgress[q.id] = { attempts: {} };
    }
  }

  // Mock exam 1
  const mock1Score = legacyData['mock_1']?.score ? Number(legacyData['mock_1'].score) : null;
  const mock1Mistake = legacyData['mock_1']?.mistake || '';

  // Gate status check
  let legacyGate: any = {};
  try {
    const gateStr = localStorage.getItem(`pte_gate_day_${dayNumber}`);
    if (gateStr) legacyGate = JSON.parse(gateStr);
  } catch (e) {
    // ignore
  }

  const additionalExercises: Record<string, any> = {};
  DEFAULT_ADDITIONAL_EXERCISES.forEach((ex, idx) => {
    const rawVal = legacyData[`additional_${idx}`]?.count;
    const count = rawVal ? Number(rawVal) : 0;
    additionalExercises[ex.id] = {
      id: ex.id,
      name: ex.name,
      requirement: ex.requirement,
      requiredCount: ex.requiredCount,
      completedCount: count,
      notes: ''
    };
  });

  return {
    dayNumber,
    date: dateStr,
    status: legacyGate.practice ? 'completed' : 'active',
    questionProgress,
    mockExams: {
      mock01: {
        id: 'mock01',
        studyDay: dayNumber,
        examNumber: (dayNumber * 2) - 1,
        date: dateStr,
        targetQuestions: 60,
        questionsAttempted: mock1Score !== null ? 60 : 0,
        overallScore: mock1Score,
        speakingScore: null,
        writingScore: null,
        readingScore: null,
        listeningScore: null,
        mainMistakes: mock1Mistake,
        isCompleted: mock1Score !== null,
        completedAt: mock1Score !== null ? new Date().toISOString() : undefined
      },
      mock02: {
        id: 'mock02',
        studyDay: dayNumber,
        examNumber: dayNumber * 2,
        date: dateStr,
        targetQuestions: 60,
        questionsAttempted: 0,
        overallScore: null,
        speakingScore: null,
        writingScore: null,
        readingScore: null,
        listeningScore: null,
        isCompleted: false
      }
    },
    mockReviews: {
      review01: {
        id: 'review01',
        mockId: 'mock01',
        studyDay: dayNumber,
        examNumber: (dayNumber * 2) - 1,
        durationMinutes: legacyGate.review_time ? 60 : 0,
        isCompleted: !!legacyGate.review_time,
        reviewNotes: mock1Mistake
      },
      review02: {
        id: 'review02',
        mockId: 'mock02',
        studyDay: dayNumber,
        examNumber: dayNumber * 2,
        durationMinutes: 0,
        isCompleted: false
      }
    },
    additionalExercises,
    gateStatus: {
      practiceCompleted: !!legacyGate.practice,
      dailyPracticeReviewCompleted: !!legacyGate.review_time,
      mock1Completed: !!legacyGate.mock1,
      mock1ReviewCompleted: !!legacyGate.review_time,
      mock2Completed: false,
      mock2ReviewCompleted: false,
      additionalExercisesCompleted: !!(legacyGate.essay_template && legacyGate.tongue_twister && legacyGate.academic_collocations),
      isUnlocked: dayNumber === 1 || !!legacyGate.practice
    },
    updatedAt: new Date().toISOString()
  };
}
