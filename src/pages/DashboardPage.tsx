import React from 'react';
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
  Mountain,
  Layers,
  PenTool
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown, calculateStreak, getWeaknessAnalysis } from '../utils/scoring';
import { formatDateFriendly, isDatePast } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  DEFAULT_ADDITIONAL_EXERCISES,
  TOTAL_MOCK_TARGET,
  TOTAL_PRACTICE_TARGET,
  TOTAL_STUDY_DAYS,
  getMockExamsForDay,
  getExamNumberForMock,
  PHASE_DEFINITIONS,
  getAcademicCollocationsTarget
} from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';
import { MasterTargetTrackerCard } from '../components/analytics/MasterTargetTrackerCard';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();

  // Metrics for current active day
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const streak = calculateStreak(days);

  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  // Overall journey calculation
  let totalCompletedAcrossJourney = 0;
  let completedDaysCount = 0;
  let overdueDaysCount = 0;
  let totalMocksCompleted = 0;

  for (let d = 1; d <= totalDays; d++) {
    const day = days[d];
    if (day) {
      if (day.status === 'completed') {
        completedDaysCount++;
      } else if (isDatePast(day.date) && day.gateStatus?.isUnlocked) {
        overdueDaysCount++;
      }
      const b = calculateDayBreakdown(day, studyPlan.questionTargets);
      totalCompletedAcrossJourney += b.totalCompleted;

      // Count completed mocks
      const mocks = day.mockExams || {};
      for (const m of Object.values(mocks)) {
        if (m && m.isCompleted) {
          totalMocksCompleted++;
        }
      }
    }
  }

  const journeyPercent = Math.round((completedDaysCount / totalDays) * 100);
  const remainingQuestionsToday = Math.max(0, breakdown.totalDailyTarget - breakdown.totalCompleted);
  const targetForToday = DAY_TARGET_SCORES[currentDay - 1] || studyPlan.targetScores.overall;

  const weakness = getWeaknessAnalysis(
    {
      speaking: breakdown.speakingAverage,
      writing: breakdown.writingAverage,
      reading: breakdown.readingAverage,
      listening: breakdown.listeningAverage
    },
    studyPlan.targetScores
  );

  // Mocks for currentDay (5 Mocks every day across the 5 phases)
  const mockKeys = getMockExamsForDay(currentDay);

  const todayMocks = mockKeys.map((key, idx) => {
    const examNum = getExamNumberForMock(currentDay, idx);
    const mockRec = currentDayData?.mockExams?.[key];
    const revRec = currentDayData?.mockReviews?.[`review0${idx + 1}`];
    return {
      key,
      examNum,
      isCompleted: !!mockRec?.isCompleted,
      score: mockRec?.overallScore,
      reviewCompleted: !!revRec?.isCompleted
    };
  });

  // Determine next unfinished task based on the 5 phases
  let nextTask = {
    title: 'Start Phase 1: Mock Exam 1 & Fluency',
    desc: 'Mock Exam 1 + 20 Daily Questions + Tongue Twisters 2x',
    link: '/practice',
    btnText: 'Open Phase 1'
  };

  const pendingMock = todayMocks.find((m) => !m.isCompleted);
  const pendingReview = todayMocks.find((m) => m.isCompleted && !m.reviewCompleted);

  if (pendingMock) {
    const mockIdx = mockKeys.indexOf(pendingMock.key) + 1;
    nextTask = {
      title: `Complete Phase ${mockIdx}: Mock Exam #${pendingMock.examNum}`,
      desc: `Simulation ${mockIdx} of 5 (60 Qs timed test) + 20 Practice Qs`,
      link: '/mock-exams',
      btnText: 'Take Mock Exam'
    };
  } else if (pendingReview) {
    nextTask = {
      title: `Mock Exam #${pendingReview.examNum} Deep Error Review`,
      desc: 'Review mistakes, incorrect collocations, and oral fluency analysis',
      link: '/mock-exams',
      btnText: 'Review Mock Exam'
    };
  } else if (breakdown.totalCompleted < breakdown.totalDailyTarget) {
    nextTask = {
      title: 'Complete 20 Daily Practice Questions',
      desc: `${remainingQuestionsToday} questions remaining across today's 5 phases`,
      link: '/practice',
      btnText: 'Open Practice Workspace'
    };
  } else if (!currentDayData?.gateStatus?.dailyPracticeReviewCompleted) {
    nextTask = {
      title: 'Confirm Daily Practice Review',
      desc: 'Check low-scoring questions in the Review Center',
      link: '/review',
      btnText: 'Review Center'
    };
  } else {
    nextTask = {
      title: `Pass Day ${currentDay} Completion Gate`,
      desc: `Unlock Day ${currentDay + 1} and roll forward`,
      link: '#gate',
      btnText: 'View Gate'
    };
  }

  const mocksDoneCount = todayMocks.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#192746] via-[#151d32] to-[#11192d] border border-slate-800 p-6 lg:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Day {currentDay} of {totalDays} · {formatDateFriendly(currentDayData?.date || studyPlan.startDate)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {streak} Days Active Streak
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {totalMocksCompleted} / {TOTAL_MOCK_TARGET} Mocks Completed
            </span>
            {overdueDaysCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                {overdueDaysCount} Overdue Tasks Rolled Over
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#edf2ff] flex items-center gap-3">
            <span>PTE - Daily Study Plan – Superior English</span>
          </h1>
          <p className="text-sm text-[#a9b5d0] leading-relaxed">
            PTE Bridge · Started: <b className="text-[#edf2ff]">{formatDateFriendly(studyPlan.startDate || '2026-10-30')}</b> · Target: <b className="text-blue-400">{studyPlan.targetScores.overall}+ Overall</b> (Day {currentDay} Target: <b className="text-emerald-400">{targetForToday}+</b>).
            {' '}Structure: <b>5 Daily Phases</b> · 5 Mocks/Day · 100 Practice Questions/Day (20 Qs per phase).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/practice"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Open 5-Phase Plan (Day {currentDay})</span>
            </Link>
            <Link
              to="/mock-exams"
              className="px-5 py-2.5 rounded-xl bg-[#243553] hover:bg-[#30476c] text-xs font-semibold text-[#edf2ff] border border-[#405477] flex items-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Mock Exam Center (5 Today)</span>
            </Link>
          </div>
        </div>

        {/* Decorative target emblem */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <Target className="w-64 h-64 text-blue-400" />
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Journey Completion */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span>{totalDays}-Day Summit Plan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#edf2ff]">{completedDaysCount} / {totalDays}</span>
            <span className="text-xs text-[#a9b5d0]">Days ({journeyPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${journeyPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#a9b5d0]">{totalDays - completedDaysCount} days remaining until summit</p>
        </div>

        {/* Card 2: Today's Mock Exams (5/Day) */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span className="font-semibold">Today's Mock Exams (5/Day)</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#edf2ff]">
              {mocksDoneCount} / {todayMocks.length}
            </span>
            <span className="text-xs text-[#a9b5d0]">Done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${todayMocks.length > 0 ? (mocksDoneCount / todayMocks.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-[#a9b5d0]">
            {todayMocks.length} Mock {todayMocks.length === 1 ? 'Exam' : 'Exams'} (1 per phase)
          </p>
        </div>

        {/* Card 3: Today's Practice Target (100 Qs across 5 phases) */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span>100 Practice Qs (5 Phases)</span>
            <Shuffle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#edf2ff]">
              {breakdown.totalCompleted} / {breakdown.totalDailyTarget}
            </span>
            <span className="text-xs text-[#a9b5d0]">({breakdown.completionPercentage}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${breakdown.completionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-[#a9b5d0]">
            {remainingQuestionsToday > 0
              ? `${remainingQuestionsToday} questions left to score today`
              : `Daily ${breakdown.totalDailyTarget} questions target met!`}
          </p>
        </div>

        {/* Card 4: Daily Practice Avg */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span>Daily Practice Avg</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#edf2ff]">
              {breakdown.dailyAverage !== null ? breakdown.dailyAverage.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-[#a9b5d0]">/ 90</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-300">
            <Target className="w-3.5 h-3.5" />
            <span>Target: {targetForToday}+</span>
          </div>
          <p className="text-[11px] text-[#a9b5d0]">{breakdown.dailyCount} scored practice attempts</p>
        </div>
      </div>

      {/* 5 Daily Phases Mission Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-[#edf2ff]">
              Today's 5 Study Phases (Mission Checklist)
            </h2>
          </div>
          <Link
            to="/practice"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Practice Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PHASE_DEFINITIONS.map((phase) => {
            const mockKey = `mock0${phase.mockIndex + 1}`;
            const mockRec = currentDayData?.mockExams?.[mockKey];
            const examNum = getExamNumberForMock(currentDay, phase.mockIndex);
            const isMockDone = !!mockRec?.isCompleted;

            // Questions scored for this phase
            let phaseQuestionsScored = 0;
            phase.questionTypes.forEach((qt) => {
              const attempts = currentDayData?.questionProgress?.[qt.typeId]?.attempts || {};
              for (let i = 0; i < qt.count; i++) {
                if (attempts[i]?.score !== null && attempts[i]?.score !== undefined) {
                  phaseQuestionsScored++;
                }
              }
            });
            const isQuestionsDone = phaseQuestionsScored >= phase.questionCount;

            // Check drills for this phase
            let isDrillsDone = false;
            if (phase.phaseNumber === 1) {
              const twCount =
                (currentDayData?.additionalExercises?.['tongue_twister']?.completedCount ?? 0) ||
                (currentDayData?.additionalExercises?.['tongue_twisters']?.completedCount ?? 0);
              isDrillsDone = twCount >= 2;
            } else if (phase.phaseNumber === 2) {
              const cFwd =
                (currentDayData?.additionalExercises?.['collocations_fwd']?.completedCount ?? 0) ||
                (currentDayData?.additionalExercises?.['academic_collocations']?.completedCount ?? 0);
              isDrillsDone = cFwd >= getAcademicCollocationsTarget(currentDay);
            } else if (phase.phaseNumber === 3) {
              const cBwd = currentDayData?.additionalExercises?.['collocations_bwd']?.completedCount ?? 0;
              isDrillsDone = cBwd >= getAcademicCollocationsTarget(currentDay);
            } else if (phase.phaseNumber === 4) {
              const e4 =
                (currentDayData?.additionalExercises?.['essay_template_p4']?.completedCount ?? 0) ||
                (currentDayData?.additionalExercises?.['essay_template']?.completedCount ? 1 : 0);
              const s4 = currentDayData?.additionalExercises?.['sgd_template_p4']?.completedCount ?? 0;
              isDrillsDone = e4 >= 1 && s4 >= 1;
            } else if (phase.phaseNumber === 5) {
              const e5 =
                (currentDayData?.additionalExercises?.['essay_template_p5']?.completedCount ?? 0) ||
                (currentDayData?.additionalExercises?.['essay_template']?.completedCount &&
                currentDayData?.additionalExercises?.['essay_template']?.completedCount >= 2
                  ? 1
                  : 0);
              const s5 = currentDayData?.additionalExercises?.['sgd_template_p5']?.completedCount ?? 0;
              isDrillsDone = e5 >= 1 && s5 >= 1;
            }

            const isPhaseDone = isMockDone && isQuestionsDone && isDrillsDone;

            return (
              <div
                key={phase.phaseNumber}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isPhaseDone
                    ? 'bg-[#10192c] border-emerald-500/40 shadow-sm'
                    : 'bg-[#141c31] border-slate-800 hover:border-blue-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${phase.badgeBg} ${phase.badgeText} ${phase.badgeBorder}`}
                    >
                      Phase {phase.phaseNumber}
                    </span>
                    <span className={`text-[11px] font-bold ${isPhaseDone ? 'text-emerald-400' : 'text-[#a9b5d0]'}`}>
                      {isPhaseDone ? 'Done ✓' : isMockDone || phaseQuestionsScored > 0 ? 'In Progress' : 'Pending'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#edf2ff] line-clamp-1">{phase.title}</h3>
                    <p className="text-[10px] text-[#a9b5d0] mt-0.5">{phase.timeSlot}</p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a9b5d0] flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-purple-400" />
                        Mock #{examNum}
                      </span>
                      <span className={isMockDone ? 'text-emerald-400 font-semibold' : 'text-[#7182a6]'}>
                        {isMockDone ? `${mockRec?.overallScore}/90` : 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#a9b5d0] flex items-center gap-1">
                        <Shuffle className="w-3 h-3 text-blue-400" />
                        20 Questions
                      </span>
                      <span className={isQuestionsDone ? 'text-emerald-400 font-semibold' : 'text-[#edf2ff]'}>
                        {phaseQuestionsScored}/{phase.questionCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#a9b5d0] flex items-center gap-1">
                        <PenTool className="w-3 h-3 text-amber-400" />
                        Phase Drill
                      </span>
                      <span className={isDrillsDone ? 'text-emerald-400 font-semibold' : 'text-[#7182a6]'}>
                        {isDrillsDone ? 'Done ✓' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
                  <Link
                    to="/practice"
                    className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold text-center transition-colors"
                  >
                    Open Phase
                  </Link>
                  <Link
                    to="/mock-exams"
                    className="py-1.5 px-2 rounded-lg bg-[#1e2a47] hover:bg-[#28375c] text-[11px] text-[#a9b5d0] hover:text-white border border-slate-800 transition-colors"
                    title="Go to Mock Exam"
                  >
                    Mock
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* November 16 Master Target Tracker (Question-Wise & Mock Simulation Overall Progress) */}
      <MasterTargetTrackerCard />

      {/* Next Task Card & Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Task Action Box */}
        <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#19243d] to-[#141c31] border border-purple-500/30 p-6 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
              <span className="uppercase tracking-wider">Top Priority Task</span>
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#edf2ff]">{nextTask.title}</h3>
            <p className="text-xs text-[#a9b5d0] mt-1 leading-relaxed">{nextTask.desc}</p>
          </div>

          <div className="pt-2">
            {nextTask.link.startsWith('#') ? (
              <a
                href={nextTask.link}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{nextTask.btnText}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : (
              <Link
                to={nextTask.link}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              >
                <span>{nextTask.btnText}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* 4 Skills Live Averages */}
        <div className="lg:col-span-2 rounded-2xl bg-[#141c31] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#edf2ff] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Four-Skill Performance & Weakness Diagnostics
            </h3>
            <span className="text-xs text-[#a9b5d0]">Target: {studyPlan.targetScores.overall}+</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Speaking */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <span className="text-xs font-semibold text-blue-300">Speaking</span>
              <div className="text-xl font-bold text-[#edf2ff]">
                {breakdown.speakingAverage !== null ? breakdown.speakingAverage.toFixed(1) : '—'}
              </div>
              <p className="text-[10px] text-[#a9b5d0]">{breakdown.speakingCount} scored items</p>
            </div>

            {/* Writing */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <span className="text-xs font-semibold text-purple-300">Writing</span>
              <div className="text-xl font-bold text-[#edf2ff]">
                {breakdown.writingAverage !== null ? breakdown.writingAverage.toFixed(1) : '—'}
              </div>
              <p className="text-[10px] text-[#a9b5d0]">{breakdown.writingCount} scored items</p>
            </div>

            {/* Reading */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-xs font-semibold text-emerald-300">Reading</span>
              <div className="text-xl font-bold text-[#edf2ff]">
                {breakdown.readingAverage !== null ? breakdown.readingAverage.toFixed(1) : '—'}
              </div>
              <p className="text-[10px] text-[#a9b5d0]">{breakdown.readingCount} scored items</p>
            </div>

            {/* Listening */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-xs font-semibold text-amber-300">Listening</span>
              <div className="text-xl font-bold text-[#edf2ff]">
                {breakdown.listeningAverage !== null ? breakdown.listeningAverage.toFixed(1) : '—'}
              </div>
              <p className="text-[10px] text-[#a9b5d0]">{breakdown.listeningCount} scored items</p>
            </div>
          </div>

          {/* Actionable Weakness Warnings */}
          {weakness.weakestSkill && weakness.gap > 0 && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-300">Priority Intervention Required:</span>
                <p className="text-xs text-[#a9b5d0] mt-0.5">
                  Focus extra reps on {weakness.weakestSkill.toUpperCase()} ({weakness.gap.toFixed(1)} points below {studyPlan.targetScores.overall} target).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Daily Repeat Tasks (5 Phases) */}
      <div id="daily-drills">
        <DailyDrillsCard dayNumber={currentDay} />
      </div>

      {/* Completion Gate Checkpoint */}
      <div id="gate">
        <CompletionGate dayNumber={currentDay} />
      </div>
    </div>
  );
};
