import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Flame,
  CheckCircle2,
  Clock,
  Shuffle,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  PenTool,
  Check,
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown, calculateStreak } from '../utils/scoring';
import { formatDateFriendly } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  TOTAL_MOCK_TARGET,
  TOTAL_STUDY_DAYS,
  getMockExamsForDay,
  getExamNumberForMock,
  PHASE_DEFINITIONS,
  QUESTION_TYPES,
  DAILY_MOCK_SCHEDULE
} from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay, updateScore } = usePteData();

  // Metrics for current active day
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const streak = calculateStreak(days);
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  // Modal state for direct question-wise quick scoring from Dashboard
  const [quickScoreModal, setQuickScoreModal] = useState<{
    typeId: string;
    typeName: string;
    qIndex: number;
    currentScore: number | null;
  } | null>(null);
  const [modalScoreVal, setModalScoreVal] = useState<string>('');

  // 6 Daily Mock Exams for currentDay
  const mockKeys = getMockExamsForDay(currentDay);

  const todayMocks = mockKeys.map((key, idx) => {
    const examNum = getExamNumberForMock(currentDay, idx);
    const mockRec = currentDayData?.mockExams?.[key];
    const revRec = currentDayData?.mockReviews?.[`review0${idx + 1}`];
    const schedule = DAILY_MOCK_SCHEDULE[idx];
    return {
      key,
      examNum,
      timeSlot: schedule?.timeSlot || '',
      sessionName: schedule?.sessionName || `Mock ${idx + 1}`,
      isCompleted: !!mockRec?.isCompleted,
      score: mockRec?.overallScore,
      speakingScore: mockRec?.speakingScore,
      writingScore: mockRec?.writingScore,
      readingScore: mockRec?.readingScore,
      listeningScore: mockRec?.listeningScore,
      reviewCompleted: !!revRec?.isCompleted
    };
  });

  const completedMocksCount = todayMocks.filter((m) => m.isCompleted).length;
  const mockPercent = Math.round((completedMocksCount / mockKeys.length) * 100);

  // 120 Daily Questions metrics
  const totalPracticeTarget = breakdown.totalDailyTarget || 120;
  const questionsCompleted = breakdown.totalCompleted;
  const practicePercent = Math.min(100, Math.round((questionsCompleted / totalPracticeTarget) * 100));

  // Write Essay tracking: 6 Essays in Mocks + 4 in Practice
  const mockEssaysDone = completedMocksCount; // Every mock includes 1 full essay
  const weAttempts = currentDayData?.questionProgress?.['write_essay']?.attempts || {};
  let practiceEssaysDone = 0;
  for (let i = 0; i < 4; i++) {
    if (weAttempts[i]?.score !== null && weAttempts[i]?.score !== undefined) {
      practiceEssaysDone++;
    }
  }
  const totalEssaysDone = mockEssaysDone + practiceEssaysDone;

  // Handle direct score saving from dashboard
  const handleSaveQuickScore = async () => {
    if (!quickScoreModal) return;
    const num = modalScoreVal.trim() === '' ? null : Number(modalScoreVal);
    const finalScore = num !== null && !isNaN(num) ? Math.min(Math.max(0, num), 90) : null;
    await updateScore(currentDay, quickScoreModal.typeId, quickScoreModal.qIndex, {
      score: finalScore
    });
    setQuickScoreModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                PTE Superior 79+
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                10-Day Intensive Protocol
              </span>
              <span className="text-xs text-slate-400">
                Started {formatDateFriendly(studyPlan?.startDate || '2026-11-01')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              6 Mock Exams · 120 Questions Daily Protocol
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Strict 6-Session Daily Schedule: 6 Full Timed Simulations + 120 High-Yield Questions in Breaks + 10 Write Essays (6 Mock + 4 Practice).
            </p>
          </div>

          {/* Active Day Switcher */}
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Viewing Day:</span>
                <select
                  value={currentDay}
                  onChange={(e) => selectDay(Number(e.target.value))}
                  className="bg-slate-900 text-sm font-bold text-blue-400 rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Study Day {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] text-slate-400 block">Streak</span>
                <span className="text-sm font-extrabold text-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {streak} Days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Command Center (6 Mocks + 120 Questions + 10 Write Essays) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KPI 1: 6 Mock Exams */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold text-white">6 Daily Mock Exams</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                completedMocksCount === 6
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {completedMocksCount} / 6 Done
              </span>
            </div>

            <p className="text-xs text-slate-400">
              6 Timed Full Simulations (60 Qs each = 360 Exam Qs daily).
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockPercent}%` }}
              />
            </div>
          </div>

          {/* 6 Mock Status Chips with exact User Timings */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {todayMocks.map((m, idx) => (
              <Link
                key={m.key}
                to="/mock-exams"
                className={`p-2 rounded-xl border text-left transition-colors ${
                  m.isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-slate-300">Mock {idx + 1}</span>
                  {m.isCompleted ? (
                    <span className="text-[10px] font-bold text-emerald-400">{m.score}/90</span>
                  ) : (
                    <span className="text-[9px] text-amber-400">Pending</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block font-mono truncate">{m.timeSlot}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/mock-exams"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Enter & Review Mock Scores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 2: 120 Practice Questions */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">120 Daily Questions</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                questionsCompleted >= 120
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {questionsCompleted} / 120 Scored
              </span>
            </div>

            <p className="text-xs text-slate-400">
              6 Phases × 20 Questions in breaks between mocks.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${practicePercent}%` }}
              />
            </div>
          </div>

          {/* 6 Phases mini progress badges */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {PHASE_DEFINITIONS.map((p) => {
              const attempts = currentDayData?.questionProgress || {};
              let pScored = 0;
              p.questionTypes.forEach((qt) => {
                const atts = attempts[qt.typeId]?.attempts || {};
                const startIndex =
                  p.phaseNumber === 6 && qt.typeId === 'repeat_sentence' ? 15
                  : p.phaseNumber === 6 && qt.typeId === 'write_from_dictation' ? 10
                  : p.phaseNumber === 6 && qt.typeId === 'read_aloud' ? 8
                  : p.phaseNumber === 6 && qt.typeId === 'rw_fill_in_blanks' ? 10
                  : p.phaseNumber === 6 && qt.typeId === 'write_essay' ? 2
                  : 0;
                for (let i = 0; i < qt.count; i++) {
                  if (atts[startIndex + i]?.score !== null && atts[startIndex + i]?.score !== undefined) {
                    pScored++;
                  }
                }
              });

              return (
                <Link
                  key={p.phaseNumber}
                  to="/practice"
                  className={`p-2 rounded-xl border text-center transition-colors ${
                    pScored >= 20
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-300 block">Phase {p.phaseNumber}</span>
                  <span className={`text-[11px] font-extrabold ${pScored >= 20 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {pScored} / 20
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/practice"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Practice Workspace (120 Qs)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 3: Write Essay Heavy Focus (10 Essays Daily) */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Write Essay Heavy Focus</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                totalEssaysDone >= 10
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {totalEssaysDone} / 10 Essays
              </span>
            </div>

            <p className="text-xs text-slate-400">
              6 Full Essays written in Mock Exams + 4 Individual Practice Essays.
            </p>

            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalEssaysDone / 10) * 100))}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">6 Mock Exam Essays:</span>
              <span className="font-bold text-purple-300">{mockEssaysDone} / 6 Completed</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">4 Practice Essays:</span>
              <span className="font-bold text-purple-300">{practiceEssaysDone} / 4 Scored</span>
            </div>
          </div>

          <Link
            to="/practice"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Write Essay Templates & Prompts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* QUESTION-WISE MASTER MATRIX (Question by Question Tracking) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Question-Wise Daily Tracker (120 Individual Questions)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track question by question. Click any question chip below to enter or update its mark directly.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Day {currentDay} Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Question Type</th>
                <th className="py-2.5 px-2 text-center">Score Weight</th>
                <th className="py-2.5 px-2 text-center">Daily Target</th>
                <th className="py-2.5 px-2 text-center">Scored</th>
                <th className="py-2.5 px-3">Question-by-Question Progress Chips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {QUESTION_TYPES.map((qt) => {
                const target = studyPlan.questionTargets[qt.id] ?? qt.defaultTarget;
                const attempts = currentDayData?.questionProgress?.[qt.id]?.attempts || {};

                let scoredCount = 0;
                for (let i = 0; i < target; i++) {
                  if (attempts[i]?.score !== null && attempts[i]?.score !== undefined) {
                    scoredCount++;
                  }
                }

                return (
                  <tr key={qt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{qt.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {qt.shortName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className="text-[11px] font-bold text-amber-300 font-mono">
                        {qt.scoreWeight}%
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center font-bold text-slate-300 font-mono">
                      {target} Qs
                    </td>

                    <td className="py-3 px-2 text-center font-bold font-mono">
                      <span className={scoredCount >= target ? 'text-emerald-400' : 'text-blue-400'}>
                        {scoredCount}/{target}
                      </span>
                    </td>

                    {/* Question Chips */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Array.from({ length: target }, (_, qIdx) => {
                          const att = attempts[qIdx];
                          const hasScore = att?.score !== null && att?.score !== undefined;

                          return (
                            <button
                              key={qIdx}
                              onClick={() => {
                                setQuickScoreModal({
                                  typeId: qt.id,
                                  typeName: qt.name,
                                  qIndex: qIdx,
                                  currentScore: hasScore ? att.score : null
                                });
                                setModalScoreVal(hasScore ? String(att.score) : '');
                              }}
                              className={`w-7 h-7 rounded-lg text-[10px] font-bold font-mono flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border ${
                                hasScore
                                  ? att.score! >= 79
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : att.score! >= 65
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                              }`}
                              title={`${qt.shortName} #${qIdx + 1}: ${hasScore ? `Score: ${att.score}/90` : 'Click to score'}`}
                            >
                              {hasScore ? att.score : qIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-HOUR DAILY TIMETABLE (6 Mocks + Break Sessions) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Daily 6-Session Timetable & Break Schedule</h2>
          </div>
          <span className="text-xs text-slate-400">Strict PTE Bridge Schedule</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHASE_DEFINITIONS.map((p, idx) => {
            const mock = todayMocks[idx];
            return (
              <div key={p.phaseNumber} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Phase {p.phaseNumber}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {p.timeSlot}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{p.mockName}</span>
                    <span className={mock?.isCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {mock?.isCompleted ? `✓ ${mock.score}/90` : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p className="font-medium text-slate-300">Break Task: 20 Practice Questions</p>
                  <p className="text-[10px] text-slate-500">
                    {p.questionTypes.map((q) => `${q.shortName} (${q.count})`).join(' + ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Phase Drills & Templates Card */}
      <DailyDrillsCard dayNumber={currentDay} />

      {/* Day Completion Gate */}
      <div id="gate">
        <CompletionGate dayNumber={currentDay} />
      </div>

      {/* Quick Score Modal */}
      {quickScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{quickScoreModal.typeName}</h3>
                <p className="text-xs text-slate-400">Question #{quickScoreModal.qIndex + 1} (Study Day {currentDay})</p>
              </div>
              <button
                onClick={() => setQuickScoreModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enter Score (0–90):
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  autoFocus
                  placeholder="0–90"
                  value={modalScoreVal}
                  onChange={(e) => setModalScoreVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveQuickScore();
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-lg font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick score pill buttons */}
              <div className="flex items-center gap-1.5 justify-center">
                {[90, 85, 79, 72, 65, 50].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setModalScoreVal(String(s))}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold font-mono text-slate-300 cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setQuickScoreModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickScore}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
