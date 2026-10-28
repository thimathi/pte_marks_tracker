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
  QUESTION_TYPE_MAP,
  TOTAL_STUDY_DAYS
} from '../config/constants';
import { calculate21StudyDates, getCalendarDayNumber, getTodayIso } from '../utils/dateUtils';

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

  const mockExams: Record<string, MockExamRecord> = {};
  const mockReviews: Record<string, MockReviewRecord> = {};

  const mockIds = ['mock01', 'mock02', 'mock03'];

  mockIds.forEach((id, idx) => {
    const examNum = (dayNumber - 1) * 3 + (idx + 1);
    const reviewId = `review0${idx + 1}`;

    const isDay1Mock1 = dayNumber === 1 && id === 'mock01';

    mockExams[id] = {
      id,
      studyDay: dayNumber,
      examNumber: examNum,
      date: dateStr,
      targetQuestions: 60,
      questionsAttempted: isDay1Mock1 ? 60 : 0,
      overallScore: isDay1Mock1 ? 59 : null,
      speakingScore: isDay1Mock1 ? 72 : null,
      writingScore: isDay1Mock1 ? 61 : null,
      readingScore: isDay1Mock1 ? 40 : null,
      listeningScore: isDay1Mock1 ? 64 : null,
      isCompleted: isDay1Mock1,
      notes: isDay1Mock1 ? 'Baseline Diagnostic (APEUni VIP Mock Test 45C)' : undefined,
    };

    mockReviews[reviewId] = {
      id: reviewId,
      mockId: id,
      studyDay: dayNumber,
      examNumber: examNum,
      durationMinutes: 0,
      isCompleted: false,
    };
  });

  return {
    dayNumber,
    date: dateStr,
    status: isUnlocked ? 'active' : 'locked',
    questionProgress,
    mockExams,
    mockReviews,
    additionalExercises,
    gateStatus: {
      practiceCompleted: dayNumber === 1,
      dailyPracticeReviewCompleted: dayNumber === 1,
      mock1Completed: dayNumber === 1,
      mock1ReviewCompleted: false,
      mock2Completed: false,
      mock2ReviewCompleted: false,
      mock3Completed: false,
      mock3ReviewCompleted: false,
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
    } else {
      let needsPlanUpdate = false;
      const planUpdates: Partial<StudyPlan> = {};

      // Migrate start date to 2026-10-25
      if (plan.startDate !== DEFAULT_START_DATE || !plan.startDate) {
        plan.startDate = DEFAULT_START_DATE;
        planUpdates.startDate = DEFAULT_START_DATE;
        needsPlanUpdate = true;
      }

      if (plan.durationDays !== TOTAL_STUDY_DAYS) {
        plan.durationDays = TOTAL_STUDY_DAYS;
        planUpdates.durationDays = TOTAL_STUDY_DAYS;
        needsPlanUpdate = true;
      }

      // Check if targets need updating to 300 (Speaking 170 + Writing 10 + Reading 60 + Listening 60)
      const totalTargets = Object.values(plan.questionTargets || {}).reduce((a, b) => a + b, 0);
      if (totalTargets !== 300) {
        plan.questionTargets = { ...DEFAULT_QUESTION_TARGETS };
        planUpdates.questionTargets = { ...DEFAULT_QUESTION_TARGETS };
        needsPlanUpdate = true;
      }

      if (needsPlanUpdate) {
        planUpdates.updatedAt = new Date().toISOString();
        await update(ref(db, `users/${uid}/studyPlan`), planUpdates);
      }
    }

    // Ensure all days exist in DB and reflect the correct date
    const totalDays = plan.durationDays || TOTAL_STUDY_DAYS;
    const dates = calculate21StudyDates(plan.startDate, totalDays);
    const existingDays = data.days || {};
    const updates: Record<string, any> = {};

    for (let d = 1; d <= totalDays; d++) {
      const key = formatDayKey(d);
      const expectedDate = dates[d - 1];
      if (!existingDays[key]) {
        updates[`users/${uid}/days/${key}`] = createDefaultDayData(d, expectedDate, d === 1);
      } else {
        if (existingDays[key].date !== expectedDate) {
          updates[`users/${uid}/days/${key}/date`] = expectedDate;
        }
        // Ensure mock03 and review03 exist
        if (!existingDays[key].mockExams?.mock03) {
          const examNum = (d - 1) * 3 + 3;
          updates[`users/${uid}/days/${key}/mockExams/mock03`] = {
            id: 'mock03',
            studyDay: d,
            examNumber: examNum,
            date: expectedDate,
            targetQuestions: 60,
            questionsAttempted: 0,
            overallScore: null,
            speakingScore: null,
            writingScore: null,
            readingScore: null,
            listeningScore: null,
            isCompleted: false,
          };
          updates[`users/${uid}/days/${key}/mockReviews/review03`] = {
            id: 'review03',
            mockId: 'mock03',
            studyDay: d,
            examNumber: examNum,
            durationMinutes: 0,
            isCompleted: false,
          };
        }
        // Pre-populate Day 1 Mock 45C baseline if not yet set
        if (d === 1 && (!existingDays[key].mockExams?.mock01 || existingDays[key].mockExams?.mock01?.overallScore === null)) {
          updates[`users/${uid}/days/${key}/mockExams/mock01/overallScore`] = 59;
          updates[`users/${uid}/days/${key}/mockExams/mock01/listeningScore`] = 64;
          updates[`users/${uid}/days/${key}/mockExams/mock01/readingScore`] = 40;
          updates[`users/${uid}/days/${key}/mockExams/mock01/speakingScore`] = 72;
          updates[`users/${uid}/days/${key}/mockExams/mock01/writingScore`] = 61;
          updates[`users/${uid}/days/${key}/mockExams/mock01/questionsAttempted`] = 60;
          updates[`users/${uid}/days/${key}/mockExams/mock01/isCompleted`] = true;
          updates[`users/${uid}/days/${key}/mockExams/mock01/notes`] = 'Baseline Diagnostic (APEUni VIP Mock Test 45C)';
          updates[`users/${uid}/days/${key}/gateStatus/mock1Completed`] = true;
        }
      }
    }

    // Rebalance any overflow attempts across days (e.g. extra questions answered count for subsequent days)
    const targets = plan.questionTargets || DEFAULT_QUESTION_TARGETS;
    for (let d = 1; d <= totalDays - 1; d++) {
      const currentKey = formatDayKey(d);
      const nextKey = formatDayKey(d + 1);
      const currentDay = existingDays[currentKey];
      const nextDay = existingDays[nextKey];
      if (!currentDay || !nextDay) continue;

      for (const meta of QUESTION_TYPES) {
        const target = targets[meta.id] ?? meta.defaultTarget;
        const atts = (currentDay.questionProgress?.[meta.id]?.attempts || {}) as Record<string, QuestionAttempt>;
        const scoredAttempts = Object.entries(atts)
          .map(([idx, a]) => ({ index: Number(idx), attempt: a }))
          .filter(x => x.attempt && typeof x.attempt.score === 'number')
          .sort((a, b) => a.index - b.index);

        if (scoredAttempts.length > target) {
          const validForCurrent = scoredAttempts.slice(0, target);
          const overflow = scoredAttempts.slice(target);

          const newCurrentAttempts: Record<number, QuestionAttempt> = {};
          validForCurrent.forEach((item, newIdx) => {
            newCurrentAttempts[newIdx] = { ...item.attempt, qIndex: newIdx };
          });
          updates[`users/${uid}/days/${currentKey}/questionProgress/${meta.id}/attempts`] = newCurrentAttempts;

          const nextAtts = (nextDay.questionProgress?.[meta.id]?.attempts || {}) as Record<string, QuestionAttempt>;
          const existingNextScored = Object.entries(nextAtts)
            .map(([idx, a]) => ({ index: Number(idx), attempt: a }))
            .filter(x => x.attempt && typeof x.attempt.score === 'number')
            .sort((a, b) => a.index - b.index);

          const combinedNext = [...overflow.map(x => x.attempt), ...existingNextScored.map(x => x.attempt)];
          const newNextAttempts: Record<number, QuestionAttempt> = {};
          combinedNext.forEach((item, newIdx) => {
            newNextAttempts[newIdx] = { ...item, qIndex: newIdx };
          });
          updates[`users/${uid}/days/${nextKey}/questionProgress/${meta.id}/attempts`] = newNextAttempts;
        }
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
    updates[`users/${uid}/days/${key}/mockExams/mock03/date`] = dates[d - 1];
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
  attempt: Partial<QuestionAttempt>,
  customTarget?: number
): Promise<void> {
  const meta = QUESTION_TYPE_MAP.get(questionTypeId);
  const target = customTarget ?? meta?.defaultTarget ?? 20;

  // Rollover: If user answered more than daily target, count toward next day(s)
  let targetDay = dayNumber;
  let targetIndex = qIndex;
  if (target > 0 && qIndex >= target) {
    const dayOffset = Math.floor(qIndex / target);
    targetDay = Math.min(dayNumber + dayOffset, TOTAL_STUDY_DAYS);
    targetIndex = qIndex % target;
  }

  const dayKey = formatDayKey(targetDay);
  const attemptRef = ref(db, `users/${uid}/days/${dayKey}/questionProgress/${questionTypeId}/attempts/${targetIndex}`);
  
  const existingSnap = await get(attemptRef);
  const prev = existingSnap.exists() ? existingSnap.val() : {};

  const merged: QuestionAttempt = {
    qIndex: targetIndex,
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
 * Strips all undefined properties from an object so Firebase RTDB update never throws
 */
export function cleanUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Saves mock exam record
 */
export async function saveMockExamRecord(
  uid: string,
  dayNumber: number,
  mockId: string,
  data: Partial<MockExamRecord>
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const mockRef = ref(db, `users/${uid}/days/${dayKey}/mockExams/${mockId}`);
  const payload = cleanUndefined({
    ...data,
    updatedAt: new Date().toISOString()
  });
  await update(mockRef, payload);
}

/**
 * Saves mock exam review record
 */
export async function saveMockReviewRecord(
  uid: string,
  dayNumber: number,
  reviewId: string,
  data: Partial<MockReviewRecord>
): Promise<void> {
  const dayKey = formatDayKey(dayNumber);
  const revRef = ref(db, `users/${uid}/days/${dayKey}/mockReviews/${reviewId}`);
  const payload = cleanUndefined({
    ...data,
    updatedAt: new Date().toISOString()
  });
  await update(revRef, payload);
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

  // Validate completion requirements:
  // Priority #1: Mock Exams & Reviews (3 Mocks every day across 17 days = 51 Mocks total)
  const mockKeys = ['mock01', 'mock02', 'mock03'];

  const gate = currentData.gateStatus;
  const missingRequirements: string[] = [];

  mockKeys.forEach((key, idx) => {
    const examNum = (dayNumber - 1) * 3 + (idx + 1);
    const mock = currentData.mockExams?.[key];
    const rev = currentData.mockReviews?.[`review0${idx + 1}`];
    if (!mock?.isCompleted) {
      missingRequirements.push(`Mock Exam #${examNum} must be completed and scored`);
    }
    if (!rev?.isCompleted) {
      missingRequirements.push(`Mock Exam #${examNum} deep review must be completed`);
    }
  });

  // Priority #2: Practice Questions (300 practice questions required every day across 10 phases)
  if (!gate.practiceCompleted) missingRequirements.push('All 300 practice questions must be scored');
  if (!gate.dailyPracticeReviewCompleted) missingRequirements.push('Daily practice questions review must be confirmed');

  // Priority #3: Mandatory Daily Drills
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

      const calendarDay = getCalendarDayNumber(plan.startDate, getTodayIso(), totalDays);
      for (let d = 1; d <= totalDays; d++) {
        const key = formatDayKey(d);
        const raw = rawDays[key];
        // Automatically unlock any day up to current calendar date (00:00 timeout auto-unlock)
        const isCalendarActive = d <= calendarDay;
        const defaultDay = createDefaultDayData(d, raw?.date || dates[d - 1], isCalendarActive);
        if (raw) {
          days[d] = {
            ...defaultDay,
            ...raw,
            questionProgress: {
              ...defaultDay.questionProgress,
              ...(raw.questionProgress || {})
            },
            mockExams: {
              ...defaultDay.mockExams,
              ...(raw.mockExams || {})
            },
            mockReviews: {
              ...defaultDay.mockReviews,
              ...(raw.mockReviews || {})
            },
            additionalExercises: {
              ...defaultDay.additionalExercises,
              ...(raw.additionalExercises || {})
            },
            gateStatus: {
              ...defaultDay.gateStatus,
              ...(raw.gateStatus || {}),
              isUnlocked: isCalendarActive || !!raw.gateStatus?.isUnlocked
            }
          };
        } else {
          days[d] = defaultDay;
        }
      }

      onData(plan, days);
    }
  }, onError);
}
