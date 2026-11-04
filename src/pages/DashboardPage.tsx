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
  Check,
  Layers,
  AlertTriangle,
  Mic
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateStreak } from '../utils/scoring';
import { formatDateFriendly } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  TOTAL_MOCK_TARGET,
  TOTAL_STUDY_DAYS,
  TOTAL_MOCK_EXAM_QUESTIONS,
  TOTAL_MISSION_QUESTIONS,
  TOTAL_SECTION_TESTS,
  getMockExamsForDay,
  getExamNumberForMock,
  DAILY_MOCK_SCHEDULE,
  getSectionTestForDay,
  getAcademicCollocationsTarget
} from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();

  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const streak = calculateStreak(days);

  // 4 Daily Mock Exams for currentDay
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
      reviewMinutes: revRec?.durationMinutes || 0,
      raAverage: revRec?.raAverageScore,
      raScores: revRec?.raScores
    };
  });

  const completedMocksCount = todayMocks.filter((m) => m.isCompleted).length;
  const completedReviewsCount = todayMocks.filter((m) => m.reviewCompleted).length;
  const mockPercent = Math.round((completedMocksCount / mockKeys.length) * 100);
  const reviewPercent = Math.round((completedReviewsCount / mockKeys.length) * 100);

  // Daily Section Test
  const sectionTestDef = getSectionTestForDay(currentDay);
  const sectionTestRecord = currentDayData?.sectionTest;

  // Mission-Wide 50+ Mock Journey Statistics across all 14 study days
  let totalMocksCompletedAllDays = 0;
  let totalReviewsCompletedAllDays = 0;
  let missedMocksCount = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dayData = days[d];
    const mKeys = getMockExamsForDay(d);
    mKeys.forEach((k, idx) => {
      const isDone = !!dayData?.mockExams?.[k]?.isCompleted;
      const isRev = !!dayData?.mockReviews?.[`review0${idx + 1}`]?.isCompleted;
      if (isDone) totalMocksCompletedAllDays++;
      if (isRev) totalReviewsCompletedAllDays++;

      if (d <= currentDay && (!isDone || !isRev)) {
        missedMocksCount++;
      }
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
                Target: 80 Mock Exams
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                20 Papers × 4 Passes
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                28-Day Mission (Nov 03 – Nov 30)
              </span>
              <span className="text-xs text-slate-400">
                Exam Day: Nov 30, 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              80-Mock Exam Mastery Mission (28 Days)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              20 Unique VIP Papers repeated 4 times across randomized passes · Flexible Daily Pace (~3 Mocks/Day) · Mandatory Read Aloud & Error Reviews · 4,800 Total Questions.
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

        {/* Overall 80 Mock Target Tracker Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                80-Mock Exam Mission:
              </span>
              <span className="text-xs font-mono font-bold text-blue-400">
                {totalMocksCompletedAllDays} / {TOTAL_MOCK_TARGET} Tests Completed
              </span>
              <span className="text-xs text-slate-400">
                ({totalQuestionsDoneAllDays.toLocaleString()} / {TOTAL_MOCK_EXAM_QUESTIONS.toLocaleString()} Mock Questions Done)
              </span>
            </div>
            <div className="w-full md:w-96 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallMockPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              Pass 1: Exams 1–20 (First Attempt)
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Pass 2: Exams 21–40 (Correction)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Pass 3: Exams 41–60 (Fluency)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              Pass 4: Exams 61–80 (79+ Summit)
            </span>
          </div>
        </div>
      </div>

      {/* Missed Sessions / Catch-Up Support Banner */}
      {missedMocksCount > 0 && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-200">
                Missed Session Catch-Up: {missedMocksCount} Mock Session{missedMocksCount > 1 ? 's' : ''} Pending
              </p>
              <p className="text-[11px] text-amber-300/80">
                Missed an earlier time slot? Don't stress — open the Mock Center to catch up anytime without falling behind.
              </p>
            </div>
          </div>

          <Link
            to="/mock-exams"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-colors"
          >
            Catch Up Now ➔
          </Link>
        </div>
      )}

      {/* Primary KPI Command Center (4 Mocks + Read Aloud Reviews + Section Test) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KPI 1: Daily Mock Exams */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Day {currentDay} Mock Exams</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                completedMocksCount === mockKeys.length && mockKeys.length > 0
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {completedMocksCount} / {mockKeys.length} Done
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {mockKeys.length} Timed Simulations ({mockKeys.length * 60} Qs today). Target: <b>{currentDayTarget}+</b>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Mock Status Chips with User Timings */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {todayMocks.map((m) => (
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
            <span>Open Mock Exam Center (4 Tests)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 2: Read Aloud & Deep Review Center */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">RA & Deep Error Reviews</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                completedReviewsCount === mockKeys.length && mockKeys.length > 0
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {completedReviewsCount} / {mockKeys.length} Reviewed
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Read Aloud (RA) scores with comma separation, deficiencies (අඩුපාඩු), and corrective actions.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reviewPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Mock Review Chips */}
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
                  {m.raAverage ? `RA: ${m.raAverage}/90` : m.reviewCompleted ? `${m.reviewMinutes}m logged` : 'Review required'}
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/review"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Read Aloud Review Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 3: Daily Section Test (12 Total across 14 Days) */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Daily Section Test</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                sectionTestRecord?.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {sectionTestRecord?.isCompleted ? 'Completed ✓' : sectionTestDef ? 'Scheduled' : 'Buffer Day'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {sectionTestDef
                ? `${sectionTestDef.title} (${sectionTestDef.targetQuestions} Qs · ${sectionTestDef.estMinutes})`
                : 'Day 7 & 14: Weekly Buffer Day for Error Reviews and Missed Mocks'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Test:</span>
              <span className="font-semibold text-white truncate">
                {sectionTestDef?.title || 'Weekly Catch-Up Day'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Time Slot:</span>
              <span className="font-mono text-amber-300">
                {sectionTestDef?.recommendedSlot || 'Free / Catch-Up'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Score:</span>
              <span className="font-bold text-emerald-400">
                {sectionTestRecord?.score !== null && sectionTestRecord?.score !== undefined
                  ? `${sectionTestRecord.score} / 90`
                  : 'Pending'}
              </span>
            </div>
          </div>

          <Link
            to="/mock-exams"
            className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Log Section Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 24-HOUR DAILY TIMETABLE (4 Mocks + Section Test Slot) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Daily 4-Mock + Section Test Timetable</h2>
          </div>
          <span className="text-xs text-slate-400">PTE Bridge Structured Schedule</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
