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
  getAcademicCollocationsTarget,
  getSectionTestForDay,
  isReviewDay,
  getReviewDayDefinition,
  getDayAndSlotForExam,
  TOTAL_STUDY_DAYS
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

  // Additional exercises
  const collocTarget = getAcademicCollocationsTarget(dayNumber);
  const twisterDone =
    (targetDayData?.additionalExercises?.['tongue_twister']?.completedCount ?? 0) >= 2 ||
    (targetDayData?.additionalExercises?.['tongue_twisters']?.completedCount ?? 0) >= 2;
  const collocFwdDone =
    (targetDayData?.additionalExercises?.['collocations_fwd']?.completedCount ?? 0) >= collocTarget ||
    (targetDayData?.additionalExercises?.['academic_collocations']?.completedCount ?? 0) >= 100;
  const collocBwdDone =
    (targetDayData?.additionalExercises?.['collocations_bwd']?.completedCount ?? 0) >= collocTarget;
  const essayDone =
    (targetDayData?.additionalExercises?.['essay_template_p4']?.completedCount ?? 0) >= 1 ||
    (targetDayData?.additionalExercises?.['essay_template']?.completedCount ?? 0) >= 1;
  const swtDone =
    (targetDayData?.additionalExercises?.['swt_template']?.completedCount ?? 0) >= 1 ||
    (targetDayData?.additionalExercises?.['sgd_template_p4']?.completedCount ?? 0) >= 1;

  const additionalDone = twisterDone && (collocFwdDone || collocBwdDone) && (essayDone || swtDone);

  // Mock exams: 6 Mocks every day across 6 Timed Sessions
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
      reviewCompleted: !!revRec?.isCompleted,
      durationMinutes: revRec?.durationMinutes || 0
    };
  });

  const allMocksDone = mockStatuses.every((m) => m.isCompleted);
  const allReviewsDone = mockStatuses.every((m) => m.reviewCompleted);

  // Checklist for 6 Mocks & Core Drills
  const checklistItems: {
    id: string;
    label: string;
    done: boolean;
    canAutoDetect?: boolean;
    canToggle?: boolean;
    hint: string;
    phaseBadge?: string;
  }[] = [];

  const isRevDay = isReviewDay(dayNumber);
  const revDayDef = getReviewDayDefinition(dayNumber);

  if (isRevDay && revDayDef) {
    const cycleExams = revDayDef.examNumbers.map((eNum) => {
      const { dayNumber: dNum, reviewKey } = getDayAndSlotForExam(eNum);
      const isRevDone = !!days[dNum]?.mockReviews?.[reviewKey]?.isCompleted;
      return { examNum: eNum, isRevDone };
    });
    const doneCount = cycleExams.filter((e) => e.isRevDone).length;
    checklistItems.push({
      id: 'deep_review_cycle',
      phaseBadge: 'Deep Review',
      label: `${revDayDef.title} (${doneCount} / ${cycleExams.length} Reviewed)`,
      done: doneCount === cycleExams.length && cycleExams.length > 0,
      canAutoDetect: true,
      hint: `Complete A-to-Z review of all ${cycleExams.length} papers in Review Center.`
    });
  } else {
    mockStatuses.forEach((m, idx) => {
      checklistItems.push({
        id: `mock_${m.key}`,
        phaseBadge: `Session ${idx + 1}`,
        label: `Mock Exam #${m.examNum} Scored (${m.isCompleted ? `${m.score}/90` : 'Pending'})`,
        done: m.isCompleted,
        canAutoDetect: true,
        hint: `Complete Session ${idx + 1} timed simulation in Mock Exam Center.`
      });

      checklistItems.push({
        id: `review_${m.key}`,
        phaseBadge: `Session ${idx + 1}`,
        label: `Mock Exam #${m.examNum} Mandatory Review Logged (Cannot be blank)`,
        done: m.reviewCompleted,
        canAutoDetect: true,
        hint: `Complete error analysis & corrective actions for Mock #${m.examNum}.`
      });
    });
  }

  // Daily Drills
  checklistItems.push({
    id: 'twister_drill',
    phaseBadge: 'Drills',
    label: 'Tongue Twisters Enunciation Drill (2 Reps Completed)',
    done: twisterDone,
    canAutoDetect: true,
    hint: 'Complete 2 repetitions of tongue twisters for oral fluency.'
  });

  checklistItems.push({
    id: 'colloc_drill',
    phaseBadge: 'Drills',
    label: `Academic Collocations (${collocTarget} Pairs Target)`,
    done: collocFwdDone || collocBwdDone,
    canAutoDetect: true,
    hint: `Master ${collocTarget} Pearson collocations forward or backward.`
  });

  checklistItems.push({
    id: 'templates_drill',
    phaseBadge: 'Drills',
    label: 'Summarize Written Text (SWT) & Essay Templates Practiced',
    done: essayDone || swtDone,
    canAutoDetect: true,
    hint: 'Practice official PTE Bridge SWT and Essay templates.'
  });

  const secDef = getSectionTestForDay(dayNumber);
  const secRec = targetDayData?.sectionTest;
  const isSectionTestDone = secDef ? !!secRec?.isCompleted : true;

  if (secDef) {
    checklistItems.push({
      id: 'section_test',
      phaseBadge: 'Section Test',
      label: `${secDef.title} (${secRec?.isCompleted ? `${secRec.score ?? 0}/90` : 'Pending'})`,
      done: !!secRec?.isCompleted,
      canAutoDetect: true,
      hint: `Complete daily section test: ${secDef.title} in Mock Exam Center.`
    });
  }

  const allReady = isRevDay
    ? (checklistItems.find((i) => i.id === 'deep_review_cycle')?.done ?? false) && additionalDone && isSectionTestDone
    : allMocksDone && allReviewsDone && additionalDone && isSectionTestDone;

  const handleToggleCheck = async (id: string, currentVal: boolean) => {
    await updateGateItem(dayNumber, id, !currentVal);
  };

  const handleCompleteDay = async () => {
    setCompleting(true);
    setStatusMessage(null);

    // Sync computed gate states
    await updateGateItem(dayNumber, 'practiceCompleted', true);
    await updateGateItem(dayNumber, 'dailyPracticeReviewCompleted', true);
    for (let i = 0; i < mockStatuses.length; i++) {
      await updateGateItem(dayNumber, `mock${i + 1}Completed`, mockStatuses[i]?.isCompleted ?? false);
      await updateGateItem(dayNumber, `mock${i + 1}ReviewCompleted`, mockStatuses[i]?.reviewCompleted ?? false);
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
    <div className="rounded-2xl bg-white border border-slate-200 p-5 lg:p-6 space-y-5 text-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Day {dayNumber} Completion Gate & Rollover Lock
            </h2>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Completed ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory Completion Gate: Day {dayNumber + 1} remains locked until all criteria are fulfilled. Unfinished work rolls over.
          </p>
        </div>

        {/* Status Pill */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 self-start ${
          isCompleted
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : allReady
            ? 'bg-blue-50 text-blue-800 border-blue-300 animate-pulse'
            : 'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{isCompleted ? 'Day Gate Passed' : allReady ? 'Ready To Unlock Next Day' : 'Prerequisites Pending'}</span>
        </div>
      </div>

      {/* Status Notice if any */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-red-50 text-red-800 border-red-300 whitespace-pre-line'
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
                ? 'bg-emerald-50/50 border-emerald-300 text-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                  )}
                </button>
              ) : (
                <span className="flex-shrink-0">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {item.phaseBadge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {item.phaseBadge}
                    </span>
                  )}
                  <span className={`text-xs font-semibold ${item.done ? 'text-emerald-800 line-through opacity-80' : 'text-slate-900'}`}>
                    {idx + 1}. {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.hint}</p>
              </div>
            </div>

            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-100 text-slate-400 opacity-70 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span>{completing ? 'Validating & Unlocking...' : `Complete Day ${dayNumber} & Unlock Day ${dayNumber + 1}`}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              <Sparkles className="w-4 h-4" />
              <span>Day {dayNumber} is officially completed! Next day unlocked.</span>
            </div>
          )}
        </div>

        {/* Emergency Unlock Link */}
        {dayNumber < TOTAL_STUDY_DAYS && !isCompleted && (
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="text-xs text-slate-500 hover:text-red-600 underline flex items-center gap-1 cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Emergency Recovery Unlock (Data-Entry Fix)</span>
          </button>
        )}
      </div>

      {/* Emergency Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Emergency Recovery Unlock</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This recovery mechanism exists for accidental data-entry errors or external scoring sync issues. All recovery unlocks are permanently recorded in your study audit log.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Reason for Emergency Unlock (Required):
              </label>
              <textarea
                value={recoveryReason}
                onChange={(e) => setRecoveryReason(e.target.value)}
                placeholder="e.g. Completed offline mock test with instructor; scores recorded in paper log"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500 min-h-[80px]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyUnlock}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-sm"
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
