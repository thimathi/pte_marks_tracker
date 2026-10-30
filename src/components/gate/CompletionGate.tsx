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
import {
  DEFAULT_ADDITIONAL_EXERCISES,
  getMockExamsForDay,
  getExamNumberForMock,
  getAcademicCollocationsTarget
} from '../../config/constants';

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

  // Check additional exercises for the 5 phases
  const collocTarget = getAcademicCollocationsTarget(dayNumber);
  const twisterDone =
    (targetDayData?.additionalExercises?.['tongue_twister']?.completedCount ?? 0) >= 2 ||
    (targetDayData?.additionalExercises?.['tongue_twisters']?.completedCount ?? 0) >= 2;
  const collocFwdDone =
    (targetDayData?.additionalExercises?.['collocations_fwd']?.completedCount ?? 0) >= collocTarget ||
    (targetDayData?.additionalExercises?.['academic_collocations']?.completedCount ?? 0) >= 100;
  const collocBwdDone =
    (targetDayData?.additionalExercises?.['collocations_bwd']?.completedCount ?? 0) >= collocTarget;
  const essayP4Done =
    (targetDayData?.additionalExercises?.['essay_template_p4']?.completedCount ?? 0) >= 1 ||
    (targetDayData?.additionalExercises?.['essay_template']?.completedCount ?? 0) >= 1;
  const sgdP4Done = (targetDayData?.additionalExercises?.['sgd_template_p4']?.completedCount ?? 0) >= 1;
  const essayP5Done =
    (targetDayData?.additionalExercises?.['essay_template_p5']?.completedCount ?? 0) >= 1 ||
    (targetDayData?.additionalExercises?.['essay_template']?.completedCount ?? 0) >= 2;
  const sgdP5Done = (targetDayData?.additionalExercises?.['sgd_template_p5']?.completedCount ?? 0) >= 1;

  const additionalDone =
    twisterDone &&
    collocFwdDone &&
    collocBwdDone &&
    essayP4Done &&
    sgdP4Done &&
    essayP5Done &&
    sgdP5Done;

  // Mock exams: 5 Mocks every day
  const mockKeys = getMockExamsForDay(dayNumber);

  const mockStatuses = mockKeys.map((key, idx) => {
    const examNum = getExamNumberForMock(dayNumber, idx);
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

  // Grouped by 5 Phases
  const checklistItems: {
    id: string;
    label: string;
    done: boolean;
    canAutoDetect?: boolean;
    canToggle?: boolean;
    hint: string;
    phaseBadge?: string;
  }[] = [];

  // Phase 1
  checklistItems.push({
    id: `mock_${mockStatuses[0]?.key}`,
    phaseBadge: 'Phase 1',
    label: `Mock Exam #${mockStatuses[0]?.examNum} Completed (Score: ${mockStatuses[0]?.score ?? '—'}/90)`,
    done: !!mockStatuses[0]?.isCompleted,
    canAutoDetect: true,
    hint: 'Complete Session 1 Simulation Mock in Mock Exam Center.'
  });
  checklistItems.push({
    id: 'twister_p1',
    phaseBadge: 'Phase 1',
    label: 'Phase 1: Tongue Twisters 2 Reps Completed',
    done: twisterDone,
    canAutoDetect: true,
    hint: 'Complete 2 repetitions of 50 tongue twisters for oral fluency.'
  });

  // Phase 2
  checklistItems.push({
    id: `mock_${mockStatuses[1]?.key}`,
    phaseBadge: 'Phase 2',
    label: `Mock Exam #${mockStatuses[1]?.examNum} Completed (Score: ${mockStatuses[1]?.score ?? '—'}/90)`,
    done: !!mockStatuses[1]?.isCompleted,
    canAutoDetect: true,
    hint: 'Complete Session 2 Simulation Mock in Mock Exam Center.'
  });
  checklistItems.push({
    id: 'colloc_fwd_p2',
    phaseBadge: 'Phase 2',
    label: `Phase 2: Academic Collocations Forward (${collocTarget} Pairs)`,
    done: collocFwdDone,
    canAutoDetect: true,
    hint: `Day ${dayNumber}: Master ${collocTarget} Pearson collocations forward.`
  });

  // Phase 3
  checklistItems.push({
    id: `mock_${mockStatuses[2]?.key}`,
    phaseBadge: 'Phase 3',
    label: `Mock Exam #${mockStatuses[2]?.examNum} Completed (Score: ${mockStatuses[2]?.score ?? '—'}/90)`,
    done: !!mockStatuses[2]?.isCompleted,
    canAutoDetect: true,
    hint: 'Complete Session 3 Simulation Mock in Mock Exam Center.'
  });
  checklistItems.push({
    id: 'colloc_bwd_p3',
    phaseBadge: 'Phase 3',
    label: `Phase 3: Academic Collocations Backward (${collocTarget} Pairs)`,
    done: collocBwdDone,
    canAutoDetect: true,
    hint: `Day ${dayNumber}: Master ${collocTarget} Pearson collocations in reverse.`
  });

  // Phase 4
  checklistItems.push({
    id: `mock_${mockStatuses[3]?.key}`,
    phaseBadge: 'Phase 4',
    label: `Mock Exam #${mockStatuses[3]?.examNum} Completed (Score: ${mockStatuses[3]?.score ?? '—'}/90)`,
    done: !!mockStatuses[3]?.isCompleted,
    canAutoDetect: true,
    hint: 'Complete Session 4 Simulation Mock in Mock Exam Center.'
  });
  checklistItems.push({
    id: 'templates_p4',
    phaseBadge: 'Phase 4',
    label: 'Phase 4: Write Essay Template (1) & SGD Template (1)',
    done: essayP4Done && sgdP4Done,
    canAutoDetect: true,
    hint: 'Practice writing 1 Essay template & 1 SGD template.'
  });

  // Phase 5
  checklistItems.push({
    id: `mock_${mockStatuses[4]?.key}`,
    phaseBadge: 'Phase 5',
    label: `Mock Exam #${mockStatuses[4]?.examNum} Completed (Score: ${mockStatuses[4]?.score ?? '—'}/90)`,
    done: !!mockStatuses[4]?.isCompleted,
    canAutoDetect: true,
    hint: 'Complete Session 5 Simulation Mock in Mock Exam Center.'
  });
  checklistItems.push({
    id: 'templates_p5',
    phaseBadge: 'Phase 5',
    label: 'Phase 5: Write Essay Template (1) & SGD Template (1)',
    done: essayP5Done && sgdP5Done,
    canAutoDetect: true,
    hint: 'Practice writing 1 Essay template & 1 SGD template.'
  });

  // All 100 Questions & Review
  checklistItems.push({
    id: 'practice',
    phaseBadge: 'All Phases',
    label: `All 100 Practice Questions Completed (${breakdown.totalCompleted} / 100 Qs)`,
    done: practiceDone,
    canAutoDetect: true,
    hint: 'Complete and score all 100 questions across the 5 phases.'
  });
  checklistItems.push({
    id: 'dailyPracticeReviewCompleted',
    phaseBadge: 'Review',
    label: 'Daily Practice Error & Review Center Analysis Done',
    done: practiceReviewDone,
    canToggle: true,
    hint: 'Confirm review of mistaken questions in Review Center.'
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
    for (let i = 0; i < mockStatuses.length; i++) {
      await updateGateItem(dayNumber, `mock${i + 1}Completed`, mockStatuses[i]?.isCompleted ?? true);
      await updateGateItem(dayNumber, `mock${i + 1}ReviewCompleted`, mockStatuses[i]?.reviewCompleted ?? true);
    }
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
                <div className="flex items-center gap-2 flex-wrap">
                  {item.phaseBadge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {item.phaseBadge}
                    </span>
                  )}
                  <span className={`text-xs font-semibold ${item.done ? 'text-emerald-300 line-through opacity-80' : 'text-[#edf2ff]'}`}>
                    {idx + 1}. {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">{item.hint}</p>
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
