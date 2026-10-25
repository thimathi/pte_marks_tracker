import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { calculateDayBreakdown } from '../../utils/scoring';
import { DEFAULT_ADDITIONAL_EXERCISES } from '../../config/constants';

interface CompletionGateProps {
  dayNumber: number;
}

export const CompletionGate: React.FC<CompletionGateProps> = ({ dayNumber }) => {
  const {
    days,
    studyPlan,
    currentDayData,
    updateGateItem,
    completeCurrentDay,
    emergencyUnlock
  } = usePteData();

  const [completing, setCompleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryReason, setRecoveryReason] = useState('');

  const targetDayData = days[dayNumber] || currentDayData;
  const isUnlocked = targetDayData?.gateStatus?.isUnlocked ?? (dayNumber === 1);
  const isCompleted = targetDayData?.status === 'completed';

  // Calculate live completion metrics for Day
  const breakdown = calculateDayBreakdown(targetDayData, studyPlan.questionTargets);
  const practiceDone = breakdown.totalCompleted >= breakdown.totalDailyTarget && breakdown.totalDailyTarget > 0;
  const practiceReviewDone = !!targetDayData?.gateStatus?.dailyPracticeReviewCompleted;

  // Check additional exercises
  const additionalDone = DEFAULT_ADDITIONAL_EXERCISES.every((ex) => {
    const record = targetDayData?.additionalExercises?.[ex.id];
    const targetCount = studyPlan.additionalExerciseTargets?.[ex.id] ?? ex.requiredCount;
    return record && record.completedCount >= targetCount;
  });

  // Mock exams: 2 mock exams every day (Days 1–20 = 40 Mock Exams total)
  const mockKeys = ['mock01', 'mock02'];

  const mockStatuses = mockKeys.map((key, idx) => {
    const examNum = (dayNumber - 1) * 2 + (idx + 1);
    const mockRec = targetDayData?.mockExams?.[key];
    const revRec = targetDayData?.mockReviews?.[`review0${idx + 1}`];
    return {
      key,
      examNum,
      isCompleted: !!mockRec?.isCompleted,
      score: mockRec?.overallScore,
      reviewCompleted: !!revRec?.isCompleted
    };
  });

  const allMocksDone = mockStatuses.every((m) => m.isCompleted);
  const allReviewsDone = mockStatuses.every((m) => m.reviewCompleted);

  // Priority #1: Mock Exams & Reviews
  const checklistItems: {
    id: string;
    label: string;
    done: boolean;
    canAutoDetect?: boolean;
    canToggle?: boolean;
    hint: string;
  }[] = [];

  mockStatuses.forEach((m) => {
    checklistItems.push({
      id: `mock_${m.key}`,
      label: `Mock Exam #${m.examNum} Completed (Score: ${m.score ?? '—'} / 90) [Priority #1]`,
      done: m.isCompleted,
      canAutoDetect: true,
      hint: `Complete Full Simulation Mock #${m.examNum} in the Mock Exam Center.`
    });
    checklistItems.push({
      id: `review_${m.key}`,
      label: `Mock Exam #${m.examNum} Deep Error Analysis Completed`,
      done: m.reviewCompleted,
      canAutoDetect: true,
      hint: `Complete mistake logging and error review for Mock #${m.examNum}.`
    });
  });

  // Priority #2: Practice Questions (300 required every day across 10 phases)
  checklistItems.push({
    id: 'practice',
    label: `All ${breakdown.totalDailyTarget} Practice Questions Completed & Scored (${breakdown.totalCompleted} / ${breakdown.totalDailyTarget})`,
    done: practiceDone,
    canAutoDetect: true,
    hint: `Scoring all ${breakdown.totalDailyTarget} practice questions (across 10 phases) is required.`
  });
  checklistItems.push({
    id: 'dailyPracticeReviewCompleted',
    label: 'Daily Practice Questions Review Completed',
    done: practiceReviewDone,
    canToggle: true,
    hint: 'Confirm you analyzed your mistakes and low-scoring questions in the Review Center.'
  });

  // Priority #3: Mandatory Daily Drills
  checklistItems.push({
    id: 'additional',
    label: 'All Mandatory Daily Drills Completed (Twisters 2x, Collocations 100, Essay Templates 2x)',
    done: additionalDone,
    canAutoDetect: true,
    hint: 'Log required repetition counts for all 3 daily repeat tasks.'
  });

  const allReady = allMocksDone && allReviewsDone && practiceDone && practiceReviewDone && additionalDone;

  const handleToggleCheck = async (id: string, currentVal: boolean) => {
    await updateGateItem(dayNumber, id, !currentVal);
  };

  const handleCompleteDay = async () => {
    setCompleting(true);
    setStatusMessage(null);

    // Sync computed gate states first
    await updateGateItem(dayNumber, 'practiceCompleted', practiceDone);
    await updateGateItem(dayNumber, 'dailyPracticeReviewCompleted', practiceReviewDone);
    await updateGateItem(dayNumber, 'mock1Completed', mockStatuses[0]?.isCompleted ?? true);
    await updateGateItem(dayNumber, 'mock1ReviewCompleted', mockStatuses[0]?.reviewCompleted ?? true);
    await updateGateItem(dayNumber, 'mock2Completed', mockStatuses[1]?.isCompleted ?? true);
    await updateGateItem(dayNumber, 'mock2ReviewCompleted', mockStatuses[1]?.reviewCompleted ?? true);
    await updateGateItem(dayNumber, 'additionalExercisesCompleted', additionalDone);

    const res = await completeCurrentDay(dayNumber);
    setCompleting(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleEmergencyUnlock = async () => {
    if (!recoveryReason.trim()) {
      alert('Please state a reason for emergency recovery audit logging.');
      return;
    }
    await emergencyUnlock(dayNumber + 1, recoveryReason);
    setShowRecoveryModal(false);
    setRecoveryReason('');
    setStatusMessage({
      type: 'success',
      text: `Emergency unlock applied. Day ${dayNumber + 1} is now accessible.`
    });
  };

  return (
    <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-5 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2b3856] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#edf2ff] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              Day {dayNumber} Completion Gate & Rollover Lock
            </h2>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Completed ✓
              </span>
            )}
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Mandatory Completion Gate: Day {dayNumber + 1} remains locked until all 7 criteria are 100% fulfilled. Unfinished work rolls over.
          </p>
        </div>

        {/* Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 self-start ${
          isCompleted
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : allReady
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{isCompleted ? 'Day Gate Passed' : allReady ? 'Ready To Unlock Next Day' : 'Prerequisites Pending'}</span>
        </div>
      </div>

      {/* Status Notice if any */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-red-500/10 text-red-300 border-red-500/30 whitespace-pre-line'
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 7-Criteria Checklist */}
      <div className="space-y-2.5">
        {checklistItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              item.done
                ? 'bg-[#10192c] border-emerald-500/30 text-[#edf2ff]'
                : 'bg-[#10192c]/50 border-[#2b3856] text-[#a9b5d0]'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.canToggle ? (
                <button
                  onClick={() => handleToggleCheck(item.id, item.done)}
                  disabled={isCompleted}
                  className="flex-shrink-0 focus:outline-none"
                  title="Click to toggle confirmation"
                >
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#a9b5d0] hover:text-blue-400" />
                  )}
                </button>
              ) : (
                <span className="flex-shrink-0">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#a9b5d0]" />
                  )}
                </span>
              )}

              <div>
                <span className={`text-xs font-semibold ${item.done ? 'text-emerald-300 line-through opacity-80' : 'text-[#edf2ff]'}`}>
                  {idx + 1}. {item.label}
                </span>
                <p className="text-[11px] text-[#a9b5d0]">{item.hint}</p>
              </div>
            </div>

            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              item.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#253655] text-amber-400'
            }`}>
              {item.done ? 'Fulfilled' : 'Required'}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <button
              onClick={handleCompleteDay}
              disabled={completing || !allReady}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
                allReady
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                  : 'bg-[#243553] text-[#a9b5d0] opacity-60 cursor-not-allowed border border-[#3a4b70]'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span>{completing ? 'Validating & Unlocking...' : `Complete Day ${dayNumber} & Unlock Day ${dayNumber + 1}`}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <Sparkles className="w-4 h-4" />
              <span>Day {dayNumber} is officially completed! Next day unlocked.</span>
            </div>
          )}
        </div>

        {/* Emergency Unlock Link */}
        {dayNumber < 21 && !isCompleted && (
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="text-xs text-[#a9b5d0] hover:text-red-400 underline flex items-center gap-1 cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Emergency Recovery Unlock (Data-Entry Fix)</span>
          </button>
        )}
      </div>

      {/* Emergency Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#141c31] border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-base font-bold text-[#edf2ff]">Emergency Recovery Unlock</h3>
            </div>
            <p className="text-xs text-[#a9b5d0] leading-relaxed">
              This recovery mechanism exists for accidental data-entry errors or external scoring sync issues. All recovery unlocks are permanently recorded in your study audit log.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Reason for Emergency Unlock (Required):
              </label>
              <textarea
                value={recoveryReason}
                onChange={(e) => setRecoveryReason(e.target.value)}
                placeholder="e.g. Completed offline mock test with instructor; scores recorded in paper log"
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-3 text-xs text-[#edf2ff] focus:outline-none focus:border-red-400 min-h-[80px]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-4 py-2 rounded-xl bg-[#243553] text-xs font-semibold text-[#edf2ff] hover:bg-[#30476c]"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyUnlock}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-lg shadow-red-600/30"
              >
                Confirm Unlock Day {dayNumber + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
