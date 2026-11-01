import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Award,
  CheckCircle2,
  AlertOctagon,
  Flame,
  ArrowRight,
  BookOpen,
  PenTool,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateStreak } from '../utils/scoring';
import { formatDateFriendly } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  TOTAL_MOCK_TARGET,
  TOTAL_STUDY_DAYS,
  TOTAL_MOCK_EXAM_QUESTIONS,
  getMockExamsForDay,
  getExamNumberForMock,
  DAILY_MOCK_SCHEDULE,
  getAcademicCollocationsTarget
} from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();

  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const streak = calculateStreak(days);

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
      mistakes: mockRec?.mainMistakes || '',
      reviewCompleted: !!revRec?.isCompleted,
      reviewMinutes: revRec?.durationMinutes || 0
    };
  });

  const completedMocksCount = todayMocks.filter((m) => m.isCompleted).length;
  const completedReviewsCount = todayMocks.filter((m) => m.reviewCompleted).length;
  const mockPercent = Math.round((completedMocksCount / mockKeys.length) * 100);
  const reviewPercent = Math.round((completedReviewsCount / mockKeys.length) * 100);

  // Mission-Wide 90-Mock Journey Statistics across all 15 study days
  let totalMocksCompletedAllDays = 0;
  let totalReviewsCompletedAllDays = 0;
  for (let d = 1; d <= totalDays; d++) {
    const dayData = days[d];
    const mKeys = getMockExamsForDay(d);
    mKeys.forEach((k, idx) => {
      if (dayData?.mockExams?.[k]?.isCompleted) totalMocksCompletedAllDays++;
      if (dayData?.mockReviews?.[`review0${idx + 1}`]?.isCompleted) totalReviewsCompletedAllDays++;
    });
  }
  const totalQuestionsDoneAllDays = totalMocksCompletedAllDays * 60;
  const overallMockPercent = Math.round((totalMocksCompletedAllDays / TOTAL_MOCK_TARGET) * 100);

  // Day's Target Score
  const currentDayTarget = DAY_TARGET_SCORES[currentDay - 1] ?? 79;

  // Drills status for today
  const collocTarget = getAcademicCollocationsTarget(currentDay);
  const twisterDone = (currentDayData?.additionalExercises?.['tongue_twister']?.completedCount ?? 0) >= 2;
  const collocFwdDone = (currentDayData?.additionalExercises?.['collocations_fwd']?.completedCount ?? 0) >= collocTarget;
  const collocBwdDone = (currentDayData?.additionalExercises?.['collocations_bwd']?.completedCount ?? 0) >= collocTarget;
  const essayDone =
    (currentDayData?.additionalExercises?.['essay_template_p4']?.completedCount ?? 0) >= 1 ||
    (currentDayData?.additionalExercises?.['essay_template']?.completedCount ?? 0) >= 1;
  const swtDone = (currentDayData?.additionalExercises?.['swt_template']?.completedCount ?? 0) >= 1;

  return (
    <div className="space-y-6">
      {/* Top Protocol Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                PTE Superior 79+ Target
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                15-Day Do or Die Protocol
              </span>
              <span className="text-xs text-slate-400">
                Started {formatDateFriendly(studyPlan?.startDate || '2026-11-01')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Do or Die · 90-Mock Exam Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Strict 6-Session Daily Schedule: 6 Full Timed Simulations (360 Qs Daily · 5,400 Total) + Mandatory Non-Blank Reviews + Daily Core Drills.
            </p>
          </div>

          {/* Active Day Switcher & Streak */}
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
                      Study Day {d} (Target: {DAY_TARGET_SCORES[d - 1] ?? 79}+)
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

        {/* Overall 90-Mock Journey Progress Tracker Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Grand 90-Mock Ladder Progress:
              </span>
              <span className="text-xs font-mono font-bold text-blue-400">
                {totalMocksCompletedAllDays} / {TOTAL_MOCK_TARGET} Tests
              </span>
              <span className="text-xs text-slate-400">
                ({totalQuestionsDoneAllDays.toLocaleString()} / {TOTAL_MOCK_EXAM_QUESTIONS.toLocaleString()} Questions Done)
              </span>
            </div>
            <div className="w-full md:w-96 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallMockPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              Round 1 (M1-35)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Round 2 (M36-70)
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Summit (M71-90)
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Command Center (6 Mocks + Mandatory Reviews + Core Drills) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KPI 1: 6 Daily Mock Exams */}
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
              6 Timed Full Simulations (60 Qs each = 360 Exam Questions daily). Target: <b>{currentDayTarget}+</b>
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
                  <span className="text-[10px] font-bold text-slate-300">Mock #{m.examNum}</span>
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
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Mock Exam Center (6 Tests)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 2: Mandatory Deep Review Center (No Blanks Allowed) */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Mandatory Deep Reviews</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                completedReviewsCount === 6
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {completedReviewsCount} / 6 Reviewed
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Zero Blank Reviews Allowed. Detailed mistake analysis & corrective plan required.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reviewPercent}%` }}
              />
            </div>
          </div>

          {/* 6 Mock Review Chips */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {todayMocks.map((m, idx) => (
              <Link
                key={`rev-${m.key}`}
                to="/mock-exams"
                className={`p-2 rounded-xl border text-left transition-colors ${
                  m.reviewCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : m.isCompleted
                    ? 'bg-amber-500/10 border-amber-500/30 animate-pulse'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-slate-300">Rev #{idx + 1}</span>
                  <span className={`text-[9px] font-bold ${
                    m.reviewCompleted
                      ? 'text-emerald-400'
                      : m.isCompleted
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}>
                    {m.reviewCompleted ? '✓ Done' : m.isCompleted ? 'Pending!' : 'Waiting'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  {m.reviewCompleted ? `${m.reviewMinutes}m logged` : 'Review required'}
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/mock-exams"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Log & Review Mock Errors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 3: Daily Essential Drills & Templates */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Daily Core Drills</h2>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                4 Key Drills
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Essential drills alongside mocks: Collocations, Tongue Twisters, SWT, Essay Template.
            </p>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">Tongue Twisters (2x):</span>
              <span className={`font-bold ${twisterDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                {twisterDone ? '✓ Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">Collocations ({collocTarget} Qs):</span>
              <span className={`font-bold ${collocFwdDone || collocBwdDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                {collocFwdDone || collocBwdDone ? '✓ Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">SWT Template (2x):</span>
              <span className={`font-bold ${swtDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                {swtDone ? '✓ Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-medium">Write Essay Template (1-2x):</span>
              <span className={`font-bold ${essayDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                {essayDone ? '✓ Completed' : 'Pending'}
              </span>
            </div>
          </div>

          <a
            href="#drills"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Practice Drills & Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 24-HOUR DAILY TIMETABLE (6 Mocks + Mandatory Review Slots) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Daily 6-Session Mock & Review Timetable</h2>
          </div>
          <span className="text-xs text-slate-400">PTE Bridge Superior Timetable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAILY_MOCK_SCHEDULE.map((s, idx) => {
            const mock = todayMocks[idx];
            return (
              <div key={s.mockIndex} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Session {idx + 1}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {s.timeSlot}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate">{s.sessionName}</span>
                    <span className={mock?.isCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {mock?.isCompleted ? `✓ ${mock.score}/90` : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Mandatory Review:</span>
                  <span className={mock?.reviewCompleted ? 'text-emerald-400 font-bold' : mock?.isCompleted ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {mock?.reviewCompleted ? '✓ Completed' : mock?.isCompleted ? '⚠️ Review Required' : 'Waiting on Mock'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Daily Drills & Templates Section */}
      <div id="drills">
        <DailyDrillsCard dayNumber={currentDay} />
      </div>

      {/* Day Completion Gate */}
      <div id="gate">
        <CompletionGate dayNumber={currentDay} />
      </div>
    </div>
  );
};
