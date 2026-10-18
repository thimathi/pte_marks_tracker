import {
  ref,
  get,
  set,
  update,
  onValue,
  off,
  runTransaction,
  serverTimestamp
} from 'firebase/database';
import { db } from '../config/firebase';
import {
  DayData,
  MockExamRecord,
  MockReviewRecord,
  QuestionAttempt,
  StudyPlan,
  UserProfile
} from '../types/pte';
import {
  DEFAULT_ADDITIONAL_EXERCISES,
  DEFAULT_ADDITIONAL_TARGETS,
  DEFAULT_QUESTION_TARGETS,
  DEFAULT_START_DATE,
  DEFAULT_TARGET_SCORES,
  QUESTION_TYPES,
  TOTAL_STUDY_DAYS
} from '../config/constants';
import { calculate21StudyDates } from '../utils/dateUtils';

/**
 * Creates default initial DayData object for a given dayNumber
 */
export function createDefaultDayData(dayNumber: number, dateStr: string, isUnlocked: boolean): DayData {
  const questionProgress: Record<string, { attempts: Record<number, QuestionAttempt> }> = {};
  for (const q of QUESTION_TYPES) {
    questionProgress[q.id] = { attempts: {} };
  }

  const additionalExercises: Record<string, any> = {};
  for (const ex of DEFAULT_ADDITIONAL_EXERCISES) {
    additionalExercises[ex.id] = {
      id: ex.id,
      name: ex.name,
      requirement: ex.requirement,
      requiredCount: ex.requiredCount,
      completedCount: 0,
      notes: ''
    };
  }

  const mock1Number = (dayNumber * 2) - 1;
  const mock2Number = dayNumber * 2;

  return {
    dayNumber,
    date: dateStr,
    status: isUnlocked ? 'active' : 'locked',
    questionProgress,
    mockExams: {
      mock01: {
        id: 'mock01',
        studyDay: dayNumber,
        examNumber: mock1Number,
        date: dateStr,
        targetQuestions: 60,
        questionsAttempted: 0,
        overallScore: null,
        speakingScore: null,
        writingScore: null,
        readingScore: null,
        listeningScore: null,
        isCompleted: false,
      },
      mock02: {
        id: 'mock02',
        studyDay: dayNumber,
        examNumber: mock2Number,
        date: dateStr,
        targetQuestions: 60,
        questionsAttempted: 0,
        overallScore: null,
        speakingScore: null,
        writingScore: null,
        readingScore: null,
        listeningScore: null,
        isCompleted: false,
      }
    },
    mockReviews: {
      review01: {
        id: 'review01',
        mockId: 'mock01',
        studyDay: dayNumber,
        examNumber: mock1Number,
        durationMinutes: 0,
        isCompleted: false,
      },
      review02: {
        id: 'review02',
        mockId: 'mock02',
        studyDay: dayNumber,
        examNumber: mock2Number,
        durationMinutes: 0,
        isCompleted: false,
      }
    },
    additionalExercises,
    gateStatus: {
      practiceCompleted: false,
      dailyPracticeReviewCompleted: false,
      mock1Completed: false,
      mock1ReviewCompleted: false,
      mock2Completed: false,
      mock2ReviewCompleted: false,
      additionalExercisesCompleted: false,
      isUnlocked,
    },
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates a default StudyPlan structure
 */
export function createDefaultStudyPlan(startDate: string = DEFAULT_START_DATE): StudyPlan {
  return {
    startDate,
    durationDays: TOTAL_STUDY_DAYS,
    currentDay: 1,
    targetScores: { ...DEFAULT_TARGET_SCORES },
    questionTargets: { ...DEFAULT_QUESTION_TARGETS },
    additionalExerciseTargets: { ...DEFAULT_ADDITIONAL_TARGETS },
    shuffleSeed: 42,
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Formats day key: 1 -> "day01", 10 -> "day10"
 */
export function formatDayKey(dayNumber: number): string {
  return `day${String(dayNumber).padStart(2, '0')}`;
}

/**
 * Checks Firebase database connection status
 */
export function subscribeConnectionStatus(callback: (connected: boolean) => void) {
  const connectedRef = ref(db, '.info/connected');
  return onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
  });
}

/**
 * Loads or initializes user profile and study plan
 */
export async function initializeUserData(uid: string, email: string): Promise<{ plan: StudyPlan; profile: UserProfile }> {
  const userRef = ref(db, `users/${uid}`);
  const snap = await get(userRef);

  const profile: UserProfile = {
    uid,
    email,
    createdAt: new Date().toISOString()
  };

  if (!snap.exists()) {
    // New user initial setup
    const plan = createDefaultStudyPlan(DEFAULT_START_DATE);
    const totalDays = plan.durationDays || TOTAL_STUDY_DAYS;
    const dates = calculate21StudyDates(plan.startDate, totalDays);
    const initialDays: Record<string, DayData> = {};

    for (let d = 1; d <= totalDays; d++) {
      const key = formatDayKey(d);
      initialDays[key] = createDefaultDayData(d, dates[d - 1], d === 1);
    }

    await set(userRef, {
      profile,
      studyPlan: plan,
      days: initialDays,
      createdAt: serverTimestamp()
    });

    return { plan, profile };
  } else {
    const data = snap.val();
    let plan: StudyPlan = data.studyPlan;
    if (!plan) {
      plan = createDefaultStudyPlan(DEFAULT_START_DATE);
      await set(ref(db, `users/${uid}/studyPlan`), plan);
    }

    // Ensure all days exist in DB
    const totalDays = plan.durationDays || TOTAL_STUDY_DAYS;
    const dates = calculate21StudyDates(plan.startDate, totalDays);
    const existingDays = data.days || {};
    const updates: Record<string, any> = {};

    for (let d = 1; d <= totalDays; d++) {
      const key = formatDayKey(d);
      if (!existingDays[key]) {
        updates[`users/${uid}/days/${key}`] = createDefaultDayData(d, dates[d - 1], d === 1);
      }
    }

    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
    }

    return { plan, profile: data.profile || profile };
  }
}

/**
 * Saves study plan updates (e.g. startDate, targetScores)
 */
export async function saveStudyPlan(uid: string, plan: StudyPlan): Promise<void> {
  const planRef = ref(db, `users/${uid}/studyPlan`);
  const updatedPlan = {
    ...plan,
    updatedAt: new Date().toISOString()
  };
  await set(planRef, updatedPlan);

  // Recalculate planned dates for all days if startDate changed
  const totalDays = plan.durationDays || TOTAL_STUDY_DAYS;
  const dates = calculate21StudyDates(plan.startDate, totalDays);
  const updates: Record<string, any> = {};
  for (let d = 1; d <= totalDays; d++) {
    const key = formatDayKey(d);
    updates[`users/${uid}/days/${key}/date`] = dates[d - 1];
    updates[`users/${uid}/days/${key}/mockExams/mock01/date`] = dates[d - 1];
    updates[`users/${uid}/days/${key}/mockExams/mock02/date`] = dates[d - 1];
  }
  await update(ref(db), updates);
}

/**
 * Saves an individual question score efficiently without full document rewrite
 */
export async function saveQuestionAttempt(
  uid: string,
  dayNumber: number,
  questionTypeId: string,
  qIndex: number,
  attempt: Partial<QuestionAttempt>
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const attemptRef = ref(db, `users/${uid}/days/${dayKey}/questionProgress/${questionTypeId}/attempts/${qIndex}`);
  
  const existingSnap = await get(attemptRef);
  const prev = existingSnap.exists() ? existingSnap.val() : {};

  const merged: QuestionAttempt = {
    qIndex,
    score: attempt.score !== undefined ? attempt.score : (prev.score ?? null),
    notes: attempt.notes !== undefined ? attempt.notes : (prev.notes || ''),
    isFlaggedForReview: attempt.isFlaggedForReview !== undefined ? attempt.isFlaggedForReview : !!prev.isFlaggedForReview,
    reviewed: attempt.reviewed !== undefined ? attempt.reviewed : !!prev.reviewed,
    reviewNotes: attempt.reviewNotes !== undefined ? attempt.reviewNotes : (prev.reviewNotes || ''),
    updatedAt: new Date().toISOString()
  };

  await set(attemptRef, merged);
}

/**
 * Saves mock exam record
 */
export async function saveMockExamRecord(
  uid: string,
  dayNumber: number,
  mockId: 'mock01' | 'mock02',
  data: Partial<MockExamRecord>
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const mockRef = ref(db, `users/${uid}/days/${dayKey}/mockExams/${mockId}`);
  await update(mockRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Saves mock exam review record
 */
export async function saveMockReviewRecord(
  uid: string,
  dayNumber: number,
  reviewId: 'review01' | 'review02',
  data: Partial<MockReviewRecord>
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const revRef = ref(db, `users/${uid}/days/${dayKey}/mockReviews/${reviewId}`);
  await update(revRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Saves additional exercises count
 */
export async function saveAdditionalExercise(
  uid: string,
  dayNumber: number,
  exerciseId: string,
  count: number,
  notes?: string
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const exRef = ref(db, `users/${uid}/days/${dayKey}/additionalExercises/${exerciseId}`);
  await update(exRef, {
    completedCount: count,
    notes: notes !== undefined ? notes : '',
    updatedAt: new Date().toISOString()
  });
}

/**
 * Completes the daily gate and unlocks the next day atomically
 */
export async function completeDayAndUnlockNext(
  uid: string,
  dayNumber: number
): Promise<{ success: boolean; message: string }> {
  if (dayNumber < 1 || dayNumber > TOTAL_STUDY_DAYS) {
    return { success: false, message: 'Invalid day number' };
  }

  const currentDayKey = formatDayKey(dayNumber);
  const currentDayRef = ref(db, `users/${uid}/days/${currentDayKey}`);
  const snap = await get(currentDayRef);

  if (!snap.exists()) {
    return { success: false, message: 'Day data not found' };
  }

  const currentData: DayData = snap.val();

  // Validate all 7 completion requirements:
  const gate = currentData.gateStatus;
  const missingRequirements: string[] = [];

  if (!gate.practiceCompleted) missingRequirements.push('All 200 practice questions must be scored');
  if (!gate.dailyPracticeReviewCompleted) missingRequirements.push('Daily practice questions review must be confirmed');
  if (!gate.mock1Completed) missingRequirements.push('Mock Exam 1 must be completed and scored');
  if (!gate.mock1ReviewCompleted) missingRequirements.push('Mock Exam 1 review must be completed');
  if (!gate.mock2Completed) missingRequirements.push('Mock Exam 2 must be completed and scored');
  if (!gate.mock2ReviewCompleted) missingRequirements.push('Mock Exam 2 review must be completed');
  if (!gate.additionalExercisesCompleted) missingRequirements.push('All mandatory additional exercises must be completed');

  if (missingRequirements.length > 0) {
    return {
      success: false,
      message: `Cannot complete Day ${dayNumber}. Missing requirements:\n• ${missingRequirements.join('\n• ')}`
    };
  }

  const nowIso = new Date().toISOString();
  const updates: Record<string, any> = {};

  // Mark current day as completed
  updates[`users/${uid}/days/${currentDayKey}/status`] = 'completed';
  updates[`users/${uid}/days/${currentDayKey}/gateStatus/isUnlocked`] = true;
  updates[`users/${uid}/days/${currentDayKey}/gateStatus/completedAt`] = nowIso;
  updates[`users/${uid}/days/${currentDayKey}/updatedAt`] = nowIso;

  // If next day exists, unlock it!
  if (dayNumber < TOTAL_STUDY_DAYS) {
    const nextDayNumber = dayNumber + 1;
    const nextDayKey = formatDayKey(nextDayNumber);
    updates[`users/${uid}/days/${nextDayKey}/status`] = 'active';
    updates[`users/${uid}/days/${nextDayKey}/gateStatus/isUnlocked`] = true;
    updates[`users/${uid}/days/${nextDayKey}/gateStatus/unlockedAt`] = nowIso;
    updates[`users/${uid}/studyPlan/currentDay`] = nextDayNumber;
  }

  await update(ref(db), updates);

  return {
    success: true,
    message: dayNumber < TOTAL_STUDY_DAYS
      ? `🎉 Congratulations! Day ${dayNumber} completed and Day ${dayNumber + 1} is now unlocked!`
      : `🏆 INCREDIBLE! You have completed all ${TOTAL_STUDY_DAYS} study days of your PTE journey!`
  };
}

/**
 * Emergency recovery unlock for accidental data-entry errors.
 * Logs the recovery event and unlocks the specified day.
 */
export async function emergencyUnlockDay(uid: string, targetDayNumber: number, reason: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const targetKey = formatDayKey(targetDayNumber);
  const updates: Record<string, any> = {};

  updates[`users/${uid}/days/${targetKey}/status`] = 'active';
  updates[`users/${uid}/days/${targetKey}/gateStatus/isUnlocked`] = true;
  updates[`users/${uid}/days/${targetKey}/gateStatus/unlockedAt`] = nowIso;
  updates[`users/${uid}/studyPlan/currentDay`] = targetDayNumber;
  updates[`users/${uid}/activityLog/${Date.now()}`] = {
    type: 'EMERGENCY_RECOVERY_UNLOCK',
    dayNumber: targetDayNumber,
    reason,
    timestamp: nowIso
  };

  await update(ref(db), updates);
}

/**
 * Subscribes to full user study data (plan and days)
 */
export function subscribeToUserData(
  uid: string,
  onData: (plan: StudyPlan, days: Record<number, DayData>) => void,
  onError?: (err: Error) => void
) {
  const userRef = ref(db, `users/${uid}`);
  return onValue(userRef, (snap) => {
    if (snap.exists()) {
      const data = snap.val();
      const plan: StudyPlan = data.studyPlan || createDefaultStudyPlan();
      const rawDays = data.days || {};
      const days: Record<number, DayData> = {};
      const totalDays = plan.durationDays || TOTAL_STUDY_DAYS;
      const dates = calculate21StudyDates(plan.startDate, totalDays);

      for (let d = 1; d <= totalDays; d++) {
        const key = formatDayKey(d);
        if (rawDays[key]) {
          days[d] = rawDays[key];
        } else {
          days[d] = createDefaultDayData(d, dates[d - 1], d === 1);
        }
      }

      onData(plan, days);
    }
  }, onError);
}
