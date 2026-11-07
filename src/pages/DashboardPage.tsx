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
  Mic,
  Search
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
  DAILY_REVIEW_SCHEDULE,
  getSectionTestForDay,
  getAcademicCollocationsTarget,
  isReviewDay,
  getReviewDayDefinition,
  getDayAndSlotForExam,
  getMockExamDetails,
  FINAL_TARGET_DATE,
  DEFAULT_TARGET_SCORES
} from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';
import { DailyMaster15HourPlanCard } from '../components/analytics/DailyMaster15HourPlanCard';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();

  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const streak = calculateStreak(days);

  // Check if today is a dedicated Deep Review Day
  const isRevDay = isReviewDay(currentDay);
  const revDayDef = getReviewDayDefinition(currentDay);

  // On Review Days, gather the mock exams covered in this review cycle
  const reviewCycleMocks = revDayDef
    ? revDayDef.examNumbers.map((eNum) => {
        const { dayNumber, mockKey, reviewKey } = getDayAndSlotForExam(eNum);
        const dayRec = days[dayNumber];
        const mockRec = dayRec?.mockExams?.[mockKey];
        const revRec = dayRec?.mockReviews?.[reviewKey];
        const details = getMockExamDetails(eNum);
        return {
          examNum: eNum,
          dayNumber,
          mockKey,
          reviewKey,
          details,
          mockRec,
          revRec,
          isCompleted: !!mockRec?.isCompleted,
          score: mockRec?.overallScore,
          speakingScore: mockRec?.speakingScore,
          writingScore: mockRec?.writingScore,
          readingScore: mockRec?.readingScore,
          listeningScore: mockRec?.listeningScore,
          reviewCompleted: !!revRec?.isCompleted,
          reviewMinutes: revRec?.durationMinutes || 0,
          raAverage: revRec?.raAverageScore,
          raScores: revRec?.raScores,
          raDeficiencies: revRec?.raDeficiencies
        };
      })
    : [];

  const completedReviewsInCycle = reviewCycleMocks.filter((m) => m.reviewCompleted).length;
  const reviewCyclePercent = reviewCycleMocks.length > 0
    ? Math.round((completedReviewsInCycle / reviewCycleMocks.length) * 100)
    : 0;

  // Daily Mock Exams for currentDay (when not a review day)
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
  const mockPercent = mockKeys.length > 0 ? Math.round((completedMocksCount / mockKeys.length) * 100) : 0;
  const reviewPercent = mockKeys.length > 0 ? Math.round((completedReviewsCount / mockKeys.length) * 100) : 0;

  // Daily Section Test
  const sectionTestDef = getSectionTestForDay(currentDay);
  const sectionTestRecord = currentDayData?.sectionTest;

  // Mission-Wide 60 Mock Journey Statistics across all 28 study days
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
                14–15h Daily Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Target: S:{studyPlan.targetScores?.speaking || DEFAULT_TARGET_SCORES.speaking} · W:{studyPlan.targetScores?.writing || DEFAULT_TARGET_SCORES.writing}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {totalDays}-Day Protocol (Nov 04 – Dec 10)
              </span>
              <span className="text-xs text-slate-400">
                Exam Day: {formatDateFriendly(FINAL_TARGET_DATE)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>PTE Master Command Center ({totalDays} Days · Overall {studyPlan.targetScores?.overall || DEFAULT_TARGET_SCORES.overall}+)</span>
              {isRevDay && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                  🌟 Deep Review Day
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              15-hour high-yield daily curriculum · 1 Mock + 1 Section Test + 230 targeted practice questions per day · Tailored for Speaking {studyPlan.targetScores?.speaking || DEFAULT_TARGET_SCORES.speaking} &amp; Writing {studyPlan.targetScores?.writing || DEFAULT_TARGET_SCORES.writing} summit.
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
                      Study Day {d} {isReviewDay(d) ? '🔍 (Deep Review Day)' : `(Target: ${DAY_TARGET_SCORES[d - 1] ?? 79}+)`}
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

        {/* Overall 60 Mock Target Tracker Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                60-Mock Exam Mission:
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
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 font-mono">
              Speaking: {studyPlan.targetScores?.speaking || DEFAULT_TARGET_SCORES.speaking} (Peak)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              Writing: {studyPlan.targetScores?.writing || DEFAULT_TARGET_SCORES.writing} (Elite)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Reading: {studyPlan.targetScores?.reading || DEFAULT_TARGET_SCORES.reading}
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Listening: {studyPlan.targetScores?.listening || DEFAULT_TARGET_SCORES.listening}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              Overall: {studyPlan.targetScores?.overall || DEFAULT_TARGET_SCORES.overall}+
            </span>
          </div>
        </div>
      </div>

      {/* 14–15 HOURS DAILY MASTER WORK PLAN */}
      <DailyMaster15HourPlanCard dayNumber={currentDay} />

      {/* SPECIAL REVIEW DAY BANNER IF VIEWING A REVIEW DAY */}
      {isRevDay && revDayDef && (
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-purple-950/40 border border-purple-500/40 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    Dedicated Review Day
                  </span>
                  <span className="text-sm font-bold text-white">
                    {revDayDef.title}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  No new mocks scheduled today. Spend 1–2 hours per paper reviewing every incorrect question, Read Aloud pauses, intonation, and documenting deficiencies (අඩුපාඩු).
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">Cycle Review Progress:</span>
              <span className="text-base font-extrabold text-emerald-400">
                {completedReviewsInCycle} / {reviewCycleMocks.length} Reviewed
              </span>
            </div>
          </div>

          {/* Cards for all exams in this review cycle */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center justify-between">
              <span>Mock Papers to Review in Detail ({reviewCycleMocks.length} Tests):</span>
              <Link to="/review" className="text-blue-400 hover:underline text-xs flex items-center gap-1">
                <span>Open Full Review Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {reviewCycleMocks.map((m) => (
                <div
                  key={m.examNum}
                  className={`p-3 rounded-xl border space-y-2 transition-all ${
                    m.reviewCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : m.isCompleted
                      ? 'bg-slate-950 border-amber-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Mock #{m.examNum}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      Day {m.dayNumber}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-1 font-medium" title={m.details.testName}>
                    {m.details.testName}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Score:</span>
                    <span className="font-bold text-white">
                      {m.score !== null && m.score !== undefined ? `${m.score}/90` : 'Not Scored'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">RA Average:</span>
                    <span className={m.raAverage ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {m.raAverage ? `${m.raAverage}/90` : '—'}
                    </span>
                  </div>

                  <Link
                    to="/review"
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      m.reviewCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <span>{m.reviewCompleted ? 'Edit Review ✓' : 'Start Review'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Day Assigned Section Test Card */}
      {isRevDay && sectionTestDef && (
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-purple-950/40 border border-purple-500/40 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    Daily Section Test
                  </span>
                  <span className="text-sm font-bold text-white">
                    {sectionTestDef.title} ({sectionTestDef.targetQuestions} Qs · {sectionTestDef.estMinutes})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {sectionTestDef.description} · Recommended slot: <span className="text-amber-300 font-mono">{sectionTestDef.recommendedSlot}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                sectionTestRecord?.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}>
                {sectionTestRecord?.isCompleted ? `Score: ${sectionTestRecord.score ?? 0}/90 ✓` : 'Pending'}
              </span>
              <Link
                to="/mock-exams"
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
              >
                <span>Log Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Missed Sessions / Catch-Up Support Banner */}
      {!isRevDay && missedMocksCount > 0 && (
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

      {/* Primary KPI Command Center (Mock Exams + Read Aloud Reviews + Section Test) */}
      {!isRevDay && (
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

            {/* Mock Status Chips with User Timings */}
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
              <span>Open Mock Exam Center ({mockKeys.length} Tests)</span>
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

            {/* Mock Review Chips */}
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

          {/* KPI 3: Daily Section Test */}
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
                  {sectionTestRecord?.isCompleted ? 'Completed ✓' : sectionTestDef ? 'Scheduled' : 'Rest / Focus on Mocks'}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {sectionTestDef
                  ? `${sectionTestDef.title} (${sectionTestDef.targetQuestions} Qs · ${sectionTestDef.estMinutes})`
                  : 'Focus on your planned Mock Exams & Read Aloud reviews.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Test:</span>
                <span className="font-semibold text-white truncate">
                  {sectionTestDef?.title || 'Mock Focus Day'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-mono text-amber-300">
                  {sectionTestDef?.recommendedSlot || 'Integrated with Mocks'}
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
      )}

      {/* DAILY TIMETABLE (Review Schedule or Mock Schedule) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              {isRevDay ? 'Daily Deep Review Timetable (8 Hours Dedicated)' : 'Daily Mock Timetable'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {isRevDay ? 'PTE Bridge Error Correction Protocol' : 'PTE Bridge Structured Schedule'}
          </span>
        </div>

        {isRevDay ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DAILY_REVIEW_SCHEDULE.map((s) => (
              <div key={s.slotIndex} className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Block {s.slotIndex + 1}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {s.timeSlot}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-200">
                    {s.sessionName}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {s.focus}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DAILY_MOCK_SCHEDULE.slice(0, mockKeys.length).map((s, idx) => {
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
        )}
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
