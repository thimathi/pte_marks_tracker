import React, { useState, useMemo } from 'react';
import {
  Target,
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { calculateCumulativeProgress } from '../../utils/scoring';
import { getDaysRemainingUntilDeadline, formatDateFriendly } from '../../utils/dateUtils';
import { FINAL_TARGET_DATE, SKILL_COLORS, PRIORITY_STYLES, TOTAL_STUDY_DAYS, BASELINE_MOCK_45C_SCORES, TOTAL_PRACTICE_TARGET, TOTAL_MOCK_TARGET } from '../../config/constants';
import { SkillType } from '../../types/pte';

export const MasterTargetTrackerCard: React.FC = () => {
  const { days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  const [selectedSkill, setSelectedSkill] = useState<'all' | SkillType>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const cumulative = useMemo(() => {
    return calculateCumulativeProgress(days, studyPlan.questionTargets, totalDays);
  }, [days, studyPlan.questionTargets, totalDays]);

  const daysRemaining = getDaysRemainingUntilDeadline(FINAL_TARGET_DATE);

  const filteredQuestions = useMemo(() => {
    if (selectedSkill === 'all') return cumulative.questions;
    return cumulative.questions.filter((q) => q.meta.skill === selectedSkill);
  }, [cumulative.questions, selectedSkill]);

  return (
    <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b3856] pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              17-Day Summit Push (Target 79+ Superior)
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-500/15 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Deadline: {formatDateFriendly(FINAL_TARGET_DATE)} ({daysRemaining} Days Left)
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Cumulative Question & Mock Tracking
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#edf2ff] mt-2 flex items-center gap-2">
            <span>Summit Plan: {cumulative.totalPracticeGoal.toLocaleString()} Questions & {cumulative.totalMocksGoal} Mock Exams</span>
          </h2>
          <p className="text-xs text-[#a9b5d0] mt-1 max-w-2xl leading-relaxed">
            Missed a day or had a busy schedule? Questions and mock exams are tracked cumulatively towards November 13. Every completed item pushes your score closer to 79+.
          </p>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-[#a9b5d0] hover:text-[#edf2ff] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse Grid' : 'Expand All 16 Question Types'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Baseline Diagnostic vs Target Comparison Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1c1836] via-[#161d33] to-[#122238] border border-purple-500/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">
              Diagnostic Baseline (Mock 45C) vs Target Summit (79+ Superior)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
            Emergency Focus: Reading (40 ➔ 72) & Writing (61 ➔ 76)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-[#2b3856]">
            <span className="text-[10px] text-[#a9b5d0] uppercase font-semibold block">Overall</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-rose-400">{BASELINE_MOCK_45C_SCORES.overall}</span>
              <span className="text-xs text-[#a9b5d0]">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">79</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">+20 pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Reading (Critical)</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-rose-400">{BASELINE_MOCK_45C_SCORES.reading}</span>
              <span className="text-xs text-[#a9b5d0]">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">72</span>
            </div>
            <span className="text-[10px] text-rose-400 font-semibold">+32 pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-purple-500/40">
            <span className="text-[10px] text-purple-400 uppercase font-semibold block">Writing</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-amber-400">{BASELINE_MOCK_45C_SCORES.writing}</span>
              <span className="text-xs text-[#a9b5d0]">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">76</span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold">+15 pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-amber-500/40">
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">Listening</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-amber-400">{BASELINE_MOCK_45C_SCORES.listening}</span>
              <span className="text-xs text-[#a9b5d0]">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">76</span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold">+12 pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-blue-500/40">
            <span className="text-[10px] text-blue-400 uppercase font-semibold block">Speaking</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-blue-300">{BASELINE_MOCK_45C_SCORES.speaking}</span>
              <span className="text-xs text-[#a9b5d0]">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">79</span>
            </div>
            <span className="text-[10px] text-blue-300 font-semibold">+7 pts needed</span>
          </div>
        </div>

        {/* Weakness breakdown pills */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-[#a9b5d0] block mb-2">Priority Error Correction Focus (from your Mock 45C diagnostic):</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {BASELINE_MOCK_45C_SCORES.weaknesses.map((w, i) => (
              <div key={i} className="p-2 rounded-lg bg-[#0e1729] border border-[#2b3856] text-left">
                <span className="text-[10px] font-bold text-[#edf2ff] block truncate" title={w.item}>
                  {w.item}
                </span>
                <div className="flex items-baseline justify-between mt-1 text-[11px]">
                  <span className="text-rose-400 font-bold">{w.correctness}%</span>
                  <span className="text-[#a9b5d0] text-[9px]">Target: {w.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Practice Questions Total */}
        <div className="p-4 rounded-2xl bg-[#0e1729] border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span className="font-semibold text-blue-300">Total Practice Scored</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#edf2ff]">
              {cumulative.totalPracticeCompleted.toLocaleString()}
            </span>
            <span className="text-xs text-[#a9b5d0]">/ {cumulative.totalPracticeGoal.toLocaleString()} Qs</span>
          </div>
          <div className="w-full bg-[#141c31] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, cumulative.practicePercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#a9b5d0]">
            <span>{cumulative.practicePercent}% of {cumulative.totalPracticeGoal.toLocaleString()} target</span>
            <span className="text-emerald-400 font-semibold">Min 4,000+ benchmark</span>
          </div>
        </div>

        {/* Mock Exams Total */}
        <div className="p-4 rounded-2xl bg-[#0e1729] border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span className="font-semibold text-purple-300">Mock Exams Completed</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#edf2ff]">
              {cumulative.totalMocksCompleted}
            </span>
            <span className="text-xs text-[#a9b5d0]">/ {cumulative.totalMocksGoal} Mocks</span>
          </div>
          <div className="w-full bg-[#141c31] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, cumulative.mocksPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#a9b5d0]">
            <span>{cumulative.mocksPercent}% of {cumulative.totalMocksGoal} simulations</span>
            <span className="text-purple-300 font-semibold">{cumulative.totalMockReviewsCompleted} Error Reviews</span>
          </div>
        </div>

        {/* Overall Practice Average */}
        <div className="p-4 rounded-2xl bg-[#0e1729] border border-[#2b3856] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span className="font-semibold text-emerald-300">Cumulative Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#edf2ff]">
              {cumulative.overallAverage !== null ? `${cumulative.overallAverage.toFixed(1)}` : '—'}
            </span>
            <span className="text-xs text-[#a9b5d0]">/ 90 Average</span>
          </div>
          <p className="text-[11px] text-[#a9b5d0] leading-snug">
            Calculated across all {cumulative.totalPracticeCompleted.toLocaleString()} answered items. Target: 79+ Superior English.
          </p>
        </div>
      </div>

      {/* Question Type Filter Tabs */}
      {isExpanded && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#edf2ff] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              Question Types Progress toward Nov 13:
            </span>

            <div className="flex items-center gap-1 bg-[#10192c] p-1 rounded-xl border border-[#2b3856]">
              {(['all', 'speaking', 'writing', 'reading', 'listening'] as const).map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    selectedSkill === skill
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[#a9b5d0] hover:text-[#edf2ff]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* 16 Question Types Progress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredQuestions.map((q) => {
              const skillColor = SKILL_COLORS[q.meta.skill];
              const isGoalReached = q.completed >= q.totalTarget && q.totalTarget > 0;

              return (
                <div
                  key={q.meta.id}
                  className="p-3.5 rounded-2xl bg-[#0e1729] border border-[#2b3856] space-y-2 hover:border-[#3d4f7a] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${skillColor.badge} uppercase tracking-wider`}>
                        {q.meta.shortName}
                      </span>
                      {isGoalReached ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Goal Met
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-blue-300 font-semibold">
                          {q.percent}%
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#edf2ff] truncate" title={q.meta.name}>
                      {q.meta.name}
                    </h4>

                    <div className="flex items-baseline justify-between mt-1 text-xs">
                      <span className="font-extrabold text-[#edf2ff]">
                        {q.completed} <span className="text-[10px] font-normal text-[#a9b5d0]">/ {q.totalTarget}</span>
                      </span>
                      {q.average !== null && (
                        <span className="text-[10px] font-bold text-[#80a7ff]">
                          Avg: {q.average}/90
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#141c31] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${isGoalReached ? 'bg-emerald-400' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, q.percent)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px] text-[#a9b5d0]">
                      <span>{q.dailyTarget}/day × {totalDays}d</span>
                      <span>Weight: {q.meta.scoreWeight}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
