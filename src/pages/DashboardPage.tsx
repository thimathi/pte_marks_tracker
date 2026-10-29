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
  Mountain
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown, calculateStreak, getWeaknessAnalysis } from '../utils/scoring';
import { formatDateFriendly, isDatePast } from '../utils/dateUtils';
import { DAY_TARGET_SCORES, DEFAULT_ADDITIONAL_EXERCISES, TOTAL_MOCK_TARGET, TOTAL_PRACTICE_TARGET, TOTAL_STUDY_DAYS, getMockExamsForDay, getExamNumberForMock } from '../config/constants';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { CompletionGate } from '../components/gate/CompletionGate';
import { MasterTargetTrackerCard } from '../components/analytics/MasterTargetTrackerCard';

export const DashboardPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();

  // Metrics for current active day
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const streak = calculateStreak(days);

  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const isDay1 = currentDay === 1;

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

  // Mocks for currentDay (Day 1: 1, Days 2–3: 4 each, Days 4–17: 3 each = 51 Mocks total)
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

  // Determine next unfinished task - PRIORITY #1: Mock Exams & Reviews!
  let nextTask = {
    title: 'Start Mock Exam Simulation (Priority #1)',
    desc: 'Full mock simulation is your highest priority task',
    link: '/mock-exams',
    btnText: 'Go to Mock Exam'
  };

  const pendingMock = todayMocks.find((m) => !m.isCompleted);
  const pendingReview = todayMocks.find((m) => m.isCompleted && !m.reviewCompleted);

  if (pendingMock) {
    const mockIdx = mockKeys.indexOf(pendingMock.key) + 1;
    nextTask = {
      title: `Complete Mock Exam #${pendingMock.examNum} [Priority #1]`,
      desc: `Daily simulation ${mockIdx} of ${mockKeys.length} (60 Qs timed test)`,
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
  } else if (currentDay !== 1 && breakdown.totalCompleted < breakdown.totalDailyTarget) {
    nextTask = {
      title: 'Practice Questions (4 Sections)',
      desc: `${remainingQuestionsToday} questions remaining in today's ${breakdown.totalDailyTarget} practice queue`,
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
    const isAdditionalDone = DEFAULT_ADDITIONAL_EXERCISES.every((ex) => {
      const record = currentDayData?.additionalExercises?.[ex.id];
      const targetCount = studyPlan.additionalExerciseTargets?.[ex.id] ?? ex.requiredCount;
      return record && record.completedCount >= targetCount;
    });

    if (!isAdditionalDone) {
      nextTask = {
        title: 'Complete 3 Mandatory Daily Drills',
        desc: 'Twisters 2x, Collocations 100, Essay Templates 2x',
        link: '#daily-drills',
        btnText: 'Open Daily Drills'
      };
    } else {
      nextTask = {
        title: `Pass Day ${currentDay} Completion Gate`,
        desc: `Unlock Day ${currentDay + 1} and roll forward`,
        link: '#gate',
        btnText: 'View Gate'
      };
    }
  }

  const mocksDoneCount = todayMocks.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#192746] via-[#151d32] to-[#11192d] border border-[#2b3856] p-6 lg:p-8 relative overflow-hidden shadow-xl">
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
            PTE Bridge · Started: <b className="text-[#edf2ff]">{formatDateFriendly(studyPlan.startDate)}</b> · Target: <b className="text-blue-400">{studyPlan.targetScores.overall}+ Overall</b> (Day {currentDay} Target: <b className="text-emerald-400">{targetForToday}+</b>).
            {' '}Daily Focus: 5 Mock Exams (300 Exam Qs) + 100 High-Yield Practice Questions daily (Ordered by Score Weight Priority).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/mock-exams"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Take Mock Exam (Priority #1 · {todayMocks.length} Today)</span>
            </Link>
            <Link
              to="/practice"
              className="px-5 py-2.5 rounded-xl bg-[#243553] hover:bg-[#30476c] text-xs font-semibold text-[#edf2ff] border border-[#405477] flex items-center gap-2 transition-all"
            >
              <Shuffle className="w-4 h-4 text-blue-400" />
              <span>Practice Workspace ({breakdown.totalDailyTarget} Qs)</span>
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
        <div className="p-5 rounded-2xl bg-[#141c31] border border-[#2b3856] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span>{totalDays}-Day Mountain Climb</span>
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

        {/* Card 2: Today's Mock Exams (Priority #1) */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span className="font-semibold">Today's Mock Exams (Priority #1)</span>
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
            {todayMocks.length} Mock {todayMocks.length === 1 ? 'Exam' : 'Exams'} + reviews required today
          </p>
        </div>

        {/* Card 3: Today's Practice Target */}
        <div className="p-5 rounded-2xl bg-[#141c31] border border-[#2b3856] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span>Daily Practice Target</span>
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
        <div className="p-5 rounded-2xl bg-[#141c31] border border-[#2b3856] space-y-2">
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
        <div className="lg:col-span-2 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
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

          {/* Weakness Diagnostic Banner */}
          {weakness.weakestSkill && (
            <div className="p-3.5 rounded-xl bg-[#10192c] border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-300">
                  Identified Weak Skill: <span className="capitalize">{weakness.weakestSkill}</span> (Gap: -{weakness.gap} points from target)
                </p>
                <p className="text-[#a9b5d0]">
                  Recommended focus areas based on recorded scores: {weakness.recommendations.join(' · ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mountain Climb Staircase Stages */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">{totalDays}-Day Mountain Staircase (Target: {TOTAL_PRACTICE_TARGET.toLocaleString()} Questions & {TOTAL_MOCK_TARGET} Mocks)</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {totalDays}-Day Intensive
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Step 1 */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            currentDay <= 5 ? 'bg-blue-600/20 border-blue-500/50' : 'bg-[#0e1729] border-[#2b3856]'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Step 1: Calibration</span>
            <p className="font-bold text-[#edf2ff]">Days 1 – 5</p>
            <p className="text-[10px] text-[#a9b5d0]">Target: 62+ ➔ 70+</p>
            <span className="text-[9px] text-purple-300 block font-semibold">2 Mocks + 300 Qs/Day</span>
          </div>

          {/* Step 2 */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            currentDay >= 6 && currentDay <= 10 ? 'bg-blue-600/20 border-blue-500/50' : 'bg-[#0e1729] border-[#2b3856]'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 2: Momentum</span>
            <p className="font-bold text-[#edf2ff]">Days 6 – 10</p>
            <p className="text-[10px] text-[#a9b5d0]">Target: 71+ ➔ 75+</p>
            <span className="text-[9px] text-blue-300 block font-semibold">2 Mocks + 300 Qs/Day</span>
          </div>

          {/* Step 3 */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            currentDay >= 11 && currentDay <= 15 ? 'bg-blue-600/20 border-blue-500/50' : 'bg-[#0e1729] border-[#2b3856]'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 3: The 75+ Push</span>
            <p className="font-bold text-[#edf2ff]">Days 11 – 15</p>
            <p className="text-[10px] text-[#a9b5d0]">Target: 76+ ➔ 80+</p>
            <span className="text-[9px] text-amber-400 block font-semibold">2 Mocks + 300 Qs/Day</span>
          </div>

          {/* Step 4 */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            currentDay >= 16 ? 'bg-blue-600/20 border-blue-500/50' : 'bg-[#0e1729] border-[#2b3856]'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 4: Summit Ridge</span>
            <p className="font-bold text-[#edf2ff]">Days 16 – 20</p>
            <p className="text-[10px] text-[#a9b5d0]">Target: 81+ ➔ 86+</p>
            <span className="text-[9px] text-emerald-400 block font-semibold">Final Peak Simulation</span>
          </div>
        </div>
      </div>

      {/* Target Progression Staircase Bar */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">{totalDays}-Day Target Score Staircase</h3>
          </div>
          <Link to="/roadmap" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            View Full Roadmap <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-11 gap-1.5">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
            const isCurrent = d === currentDay;
            const dayStatus = days[d]?.status;
            const isUnlocked = days[d]?.gateStatus?.isUnlocked ?? (d === 1);
            const targetScore = DAY_TARGET_SCORES[d - 1] || 79;

            return (
              <button
                key={d}
                onClick={() => selectDay(d)}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 font-bold scale-105'
                    : dayStatus === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : isUnlocked
                    ? 'bg-[#19243d] border-[#2b3856] text-[#edf2ff] hover:border-blue-400'
                    : 'bg-[#10192c]/50 border-[#2b3856]/40 text-[#a9b5d0]/50'
                }`}
                title={`Day ${d}: Target ${targetScore}+ · Status: ${dayStatus || (isUnlocked ? 'active' : 'locked')}`}
              >
                <div className="text-[11px] font-bold">D{d}</div>
                <div className="text-[10px] opacity-80">{targetScore}+</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Anchor: Mandatory Daily Repeat Tasks */}
      <div id="daily-drills">
        <DailyDrillsCard dayNumber={currentDay} />
      </div>

      {/* Section Anchor: Completion Gate */}
      <div id="gate">
        <CompletionGate dayNumber={currentDay} />
      </div>
    </div>
  );
};