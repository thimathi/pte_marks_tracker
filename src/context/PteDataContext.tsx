import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  DayData,
  MockExamRecord,
  MockReviewRecord,
  QuestionAttempt,
  StudyPlan
} from '../types/pte';
import {
  completeDayAndUnlockNext,
  createDefaultDayData,
  createDefaultStudyPlan,
  emergencyUnlockDay,
  initializeUserData,
  saveAdditionalExercise,
  saveMockExamRecord,
  saveMockReviewRecord,
  saveQuestionAttempt,
  saveStudyPlan,
  subscribeConnectionStatus,
  subscribeToUserData,
  formatDayKey,
  batchSaveScores,
  batchSaveMockExams
} from '../services/databaseService';
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase';
import { calculate21StudyDates, getCalendarDayNumber, getTodayIso } from '../utils/dateUtils';
import { QUESTION_TYPES, DEFAULT_ADDITIONAL_EXERCISES, TOTAL_STUDY_DAYS, getMockExamsForDay, getExamNumberForMock } from '../config/constants';

interface PteDataContextType {
  studyPlan: StudyPlan;
  days: Record<number, DayData>;
  currentDay: number;
  currentDayData: DayData;
  loading: boolean;
  isConnected: boolean;
  syncStatus: 'saved' | 'syncing' | 'error' | 'offline';
  lastSavedAt: string | null;
  selectDay: (dayNumber: number) => void;
  updateScore: (dayNumber: number, typeId: string, qIndex: number, attempt: Partial<QuestionAttempt>) => Promise<void>;
  updateMockExam: (dayNumber: number, mockId: string, data: Partial<MockExamRecord>) => Promise<void>;
  updateMockReview: (dayNumber: number, reviewId: string, data: Partial<MockReviewRecord>) => Promise<void>;
  updateExerciseCount: (dayNumber: number, exerciseId: string, count: number, notes?: string) => Promise<void>;
  updateGateItem: (dayNumber: number, key: string, val: boolean) => Promise<void>;
  completeCurrentDay: (dayNumber: number) => Promise<{ success: boolean; message: string }>;
  emergencyUnlock: (dayNumber: number, reason: string) => Promise<void>;
  updatePlan: (newPlan: StudyPlan) => Promise<void>;
  importLegacyData: (migratedDays: DayData[]) => Promise<void>;
  completeAllQuestionsForDay: (dayNumber: number, defaultScore?: number) => Promise<void>;
  completeAllMocksForDay: (dayNumber: number, defaultScore?: number) => Promise<void>;
}

const PteDataContext = createContext<PteDataContextType | undefined>(undefined);

export const PteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => createDefaultStudyPlan());
  const [days, setDays] = useState<Record<number, DayData>>({});
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'syncing' | 'error' | 'offline'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Monitor RTDB network connection status
  useEffect(() => {
    const unsub = subscribeConnectionStatus((connected) => {
      setIsConnected(connected);
      if (!connected) setSyncStatus('offline');
      else if (syncStatus === 'offline') setSyncStatus('saved');
    });
    return () => unsub();
  }, [syncStatus]);

  // Load and listen to user's study records in Realtime Database
  useEffect(() => {
    if (!user) {
      setDays({});
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubListener: (() => void) | null = null;

    initializeUserData(user.uid, user.email || '')
      .then(({ plan }) => {
        setStudyPlan(plan);
        const calendarDay = getCalendarDayNumber(plan.startDate, getTodayIso(), plan.durationDays || TOTAL_STUDY_DAYS);
        setCurrentDay(calendarDay || plan.currentDay || 1);

        unsubListener = subscribeToUserData(
          user.uid,
          (updatedPlan, updatedDays) => {
            setStudyPlan(updatedPlan);
            setDays(updatedDays);
            setLoading(false);
            setSyncStatus('saved');
            setLastSavedAt(new Date().toLocaleTimeString());
          },
          (err) => {
            console.error('Firebase DB listener error:', err);
            setSyncStatus('error');
            setLoading(false);
          }
        );
      })
      .catch((err) => {
        console.error('Failed to initialize user data:', err);
        setSyncStatus('error');
        setLoading(false);
      });

    return () => {
      if (unsubListener) unsubListener();
    };
  }, [user]);

  // Midnight 00:00 Auto-Advance & Date Checker
  useEffect(() => {
    let lastDate = getTodayIso();
    const interval = setInterval(() => {
      const currentDate = getTodayIso();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        const newCalendarDay = getCalendarDayNumber(studyPlan.startDate, currentDate, studyPlan.durationDays || TOTAL_STUDY_DAYS);
        setCurrentDay(newCalendarDay);
        setDays((prev) => {
          const updated = { ...prev };
          if (updated[newCalendarDay]) {
            updated[newCalendarDay] = {
              ...updated[newCalendarDay],
              status: updated[newCalendarDay].status === 'completed' ? 'completed' : 'active',
              gateStatus: {
                ...updated[newCalendarDay].gateStatus,
                isUnlocked: true
              }
            };
          }
          return updated;
        });
      }
    }, 15000); // Check every 15s for midnight date roll

    return () => clearInterval(interval);
  }, [studyPlan.startDate, studyPlan.durationDays]);

  // Flexible day selector: user can jump between days freely to catch up or skip
  const selectDay = useCallback((dayNumber: number) => {
    if (dayNumber < 1 || dayNumber > 25) return;
    setCurrentDay(dayNumber);
  }, []);

  // Update a question score
  const updateScore = useCallback(
    async (dayNumber: number, typeId: string, qIndex: number, attempt: Partial<QuestionAttempt>) => {
      if (!user) return;
      setSyncStatus('syncing');

      // Optimistic local update
      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        const curQP = curDay.questionProgress || {};
        const typeProgress = curQP[typeId] || { attempts: {} };
        const curAttempts = typeProgress.attempts || {};
        const prevAttempt = curAttempts[qIndex] || { qIndex, score: null };

        const updatedAttempt: QuestionAttempt = {
          ...prevAttempt,
          ...attempt,
          updatedAt: new Date().toISOString()
        };

        const newAttempts = { ...curAttempts, [qIndex]: updatedAttempt };

        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            questionProgress: {
              ...curQP,
              [typeId]: {
                ...typeProgress,
                attempts: newAttempts
              }
            }
          }
        };
      });

      try {
        await saveQuestionAttempt(user.uid, dayNumber, typeId, qIndex, attempt);
        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error saving score:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  // Update Mock Exam
  const updateMockExam = useCallback(
    async (dayNumber: number, mockId: string, data: Partial<MockExamRecord>) => {
      if (!user) return;
      setSyncStatus('syncing');

      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        const curMocks = curDay.mockExams || {};
        const curMock = curMocks[mockId] || {
          id: mockId,
          examNumber: 1,
          date: curDay.date,
          overallScore: null,
          speakingScore: null,
          writingScore: null,
          readingScore: null,
          listeningScore: null,
          isCompleted: false
        };
        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            mockExams: {
              ...curMocks,
              [mockId]: { ...curMock, ...data }
            }
          }
        };
      });

      try {
        await saveMockExamRecord(user.uid, dayNumber, mockId, data);
        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error saving mock exam:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  // Update Mock Review
  const updateMockReview = useCallback(
    async (dayNumber: number, reviewId: string, data: Partial<MockReviewRecord>) => {
      if (!user) return;
      setSyncStatus('syncing');

      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        const curReviews = curDay.mockReviews || {};
        const curReview = curReviews[reviewId] || {
          id: reviewId,
          mockId: reviewId.replace('review', 'mock'),
          studyDay: dayNumber,
          examNumber: 1,
          durationMinutes: 30,
          isCompleted: false
        };
        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            mockReviews: {
              ...curReviews,
              [reviewId]: { ...curReview, ...data }
            }
          }
        };
      });

      try {
        await saveMockReviewRecord(user.uid, dayNumber, reviewId, data);
        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error saving mock review:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  // Update Exercise Count
  const updateExerciseCount = useCallback(
    async (dayNumber: number, exerciseId: string, count: number, notes?: string) => {
      if (!user) return;
      setSyncStatus('syncing');

      let isAllAdditionalDone = false;

      setDays((prev) => {
        const curDay = prev[dayNumber];
        if (!curDay) return prev;
        const curExercises = curDay.additionalExercises || {};
        const curEx = curExercises[exerciseId] || {
          id: exerciseId,
          name: exerciseId,
          requirement: '',
          requiredCount: 2,
          completedCount: 0,
          notes: ''
        };

        const updatedExercises = {
          ...curExercises,
          [exerciseId]: { ...curEx, completedCount: count, notes: notes ?? curEx.notes }
        };

        isAllAdditionalDone = DEFAULT_ADDITIONAL_EXERCISES.every((ex) => {
          const rec = updatedExercises[ex.id];
          const targetCount = studyPlan.additionalExerciseTargets?.[ex.id] ?? ex.requiredCount;
          return rec && rec.completedCount >= targetCount;
        });

        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            additionalExercises: updatedExercises,
            gateStatus: {
              ...curDay.gateStatus,
              additionalExercisesCompleted: isAllAdditionalDone
            }
          }
        };
      });

      try {
        await saveAdditionalExercise(user.uid, dayNumber, exerciseId, count, notes);

        const dayKey = formatDayKey(dayNumber);
        await update(ref(db, `users/${user.uid}/days/${dayKey}/gateStatus`), {
          additionalExercisesCompleted: isAllAdditionalDone,
          updatedAt: new Date().toISOString()
        });

        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error saving exercise count:', err);
        setSyncStatus('error');
      }
    },
    [user, studyPlan]
  );

  // Toggle or Update Gate checklist item
  const updateGateItem = useCallback(
    async (dayNumber: number, key: string, val: boolean) => {
      if (!user) return;
      setSyncStatus('syncing');

      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        const curGate = curDay.gateStatus || {
          practiceCompleted: false,
          dailyPracticeReviewCompleted: false,
          mock1Completed: false,
          mock1ReviewCompleted: false,
          mock2Completed: false,
          mock2ReviewCompleted: false,
          additionalExercisesCompleted: false,
          isUnlocked: dayNumber === 1
        };
        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            gateStatus: {
              ...curGate,
              [key]: val
            }
          }
        };
      });

      try {
        const dayKey = formatDayKey(dayNumber);
        await update(ref(db, `users/${user.uid}/days/${dayKey}/gateStatus`), {
          [key]: val,
          updatedAt: new Date().toISOString()
        });
        setSyncStatus('saved');
      } catch (err) {
        console.error('Error updating gate checklist item:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  // Complete Day and Unlock Next
  const completeCurrentDay = useCallback(
    async (dayNumber: number) => {
      if (!user) return { success: false, message: 'Please sign in first' };
      setSyncStatus('syncing');

      const result = await completeDayAndUnlockNext(user.uid, dayNumber);
      if (result.success) {
        setSyncStatus('saved');
        if (dayNumber < 21) {
          setCurrentDay(dayNumber + 1);
        }
      } else {
        setSyncStatus('saved');
      }
      return result;
    },
    [user]
  );

  // Emergency unlock
  const emergencyUnlock = useCallback(
    async (dayNumber: number, reason: string) => {
      if (!user) return;
      setSyncStatus('syncing');
      await emergencyUnlockDay(user.uid, dayNumber, reason);
      setCurrentDay(dayNumber);
      setSyncStatus('saved');
    },
    [user]
  );

  // Update Plan Settings
  const updatePlan = useCallback(
    async (newPlan: StudyPlan) => {
      if (!user) return;
      setSyncStatus('syncing');
      setStudyPlan(newPlan);
      await saveStudyPlan(user.uid, newPlan);
      setSyncStatus('saved');
    },
    [user]
  );

  // Migrate legacy data
  const importLegacyData = useCallback(
    async (migratedDays: DayData[]) => {
      if (!user) return;
      setSyncStatus('syncing');
      const updates: Record<string, any> = {};
      for (const day of migratedDays) {
        const dayKey = formatDayKey(day.dayNumber);
        updates[`users/${user.uid}/days/${dayKey}`] = day;
      }
      await update(ref(db), updates);
      setSyncStatus('saved');
    },
    [user]
  );

  // Batch complete all 300 practice questions for the day
  const completeAllQuestionsForDay = useCallback(
    async (dayNumber: number, defaultScore: number = 79) => {
      if (!user) return;
      setSyncStatus('syncing');

      const fullAttempts: Record<string, Record<number, QuestionAttempt>> = {};
      for (const meta of QUESTION_TYPES) {
        fullAttempts[meta.id] = {};
        for (let i = 0; i < meta.defaultTarget; i++) {
          fullAttempts[meta.id][i] = {
            qIndex: i,
            score: defaultScore,
            notes: 'High-Yield Drill Completed',
            isFlaggedForReview: false,
            updatedAt: new Date().toISOString()
          };
        }
      }

      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        const curQP = curDay.questionProgress || {};
        const updatedQP = { ...curQP };
        for (const meta of QUESTION_TYPES) {
          updatedQP[meta.id] = {
            attempts: {
              ...(updatedQP[meta.id]?.attempts || {}),
              ...fullAttempts[meta.id]
            }
          };
        }
        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            questionProgress: updatedQP
          }
        };
      });

      try {
        await batchSaveScores(user.uid, dayNumber, fullAttempts);
        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error batch completing questions:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  // Batch complete all 4 mock exams and their reviews for the day
  const completeAllMocksForDay = useCallback(
    async (dayNumber: number, defaultScore: number = 79) => {
      if (!user) return;
      setSyncStatus('syncing');

      const mockKeys = getMockExamsForDay(dayNumber);
      const mockUpdates: Record<string, MockExamRecord> = {};
      const reviewUpdates: Record<string, MockReviewRecord> = {};

      mockKeys.forEach((key, idx) => {
        const examNum = getExamNumberForMock(dayNumber, idx);
        const revKey = `review0${idx + 1}`;
        mockUpdates[key] = {
          id: key,
          studyDay: dayNumber,
          examNumber: examNum,
          date: getTodayIso(),
          targetQuestions: 60,
          questionsAttempted: 60,
          overallScore: defaultScore,
          speakingScore: defaultScore,
          writingScore: defaultScore,
          readingScore: defaultScore,
          listeningScore: defaultScore,
          isCompleted: true,
          notes: 'Full Test Simulation Completed'
        };
        reviewUpdates[revKey] = {
          id: revKey,
          mockId: key,
          studyDay: dayNumber,
          examNumber: examNum,
          durationMinutes: 45,
          isCompleted: true
        };
      });

      setDays((prev) => {
        const curDay = prev[dayNumber] || createDefaultDayData(dayNumber, '', false);
        return {
          ...prev,
          [dayNumber]: {
            ...curDay,
            mockExams: {
              ...(curDay.mockExams || {}),
              ...mockUpdates
            },
            mockReviews: {
              ...(curDay.mockReviews || {}),
              ...reviewUpdates
            }
          }
        };
      });

      try {
        await batchSaveMockExams(user.uid, dayNumber, mockUpdates, reviewUpdates);
        setSyncStatus('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Error batch completing mocks:', err);
        setSyncStatus('error');
      }
    },
    [user]
  );

  const fallbackDates = calculate21StudyDates(studyPlan.startDate);
  const currentDayData: DayData = days[currentDay] || createDefaultDayData(currentDay, fallbackDates[currentDay - 1] || studyPlan.startDate, currentDay === 1);

  return (
    <PteDataContext.Provider
      value={{
        studyPlan,
        days,
        currentDay,
        currentDayData,
        loading,
        isConnected,
        syncStatus,
        lastSavedAt,
        selectDay,
        updateScore,
        updateMockExam,
        updateMockReview,
        updateExerciseCount,
        updateGateItem,
        completeCurrentDay,
        emergencyUnlock,
        updatePlan,
        importLegacyData,
        completeAllQuestionsForDay,
        completeAllMocksForDay
      }}
    >
      {children}
    </PteDataContext.Provider>
  );
};

export const usePteData = () => {
  const context = useContext(PteDataContext);
  if (!context) {
    throw new Error('usePteData must be used within a PteDataProvider');
  }
  return context;
};
