import React, { useMemo } from 'react';
import {
  Target,
  GraduationCap,
  Calendar,
  TrendingUp,
  Flame
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { calculateCumulativeProgress } from '../../utils/scoring';
import { getDaysRemainingUntilDeadline, formatDateFriendly } from '../../utils/dateUtils';
import { FINAL_TARGET_DATE, TOTAL_STUDY_DAYS, BASELINE_MOCK_45C_SCORES, TOTAL_MOCK_TARGET } from '../../config/constants';

export const MasterTargetTrackerCard: React.FC = () => {
  const { days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  const cumulative = useMemo(() => {
    return calculateCumulativeProgress(days, studyPlan.questionTargets, totalDays);
  }, [days, studyPlan.questionTargets, totalDays]);

  const daysRemaining = getDaysRemainingUntilDeadline(FINAL_TARGET_DATE);

  return (
    <div className="bg-[#141c31] border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              28-Day 60-Mock Exam Mission (Target 79+ Superior)
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-500/15 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Deadline: {formatDateFriendly(FINAL_TARGET_DATE)} ({daysRemaining} Days Left)
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#edf2ff] mt-2 flex items-center gap-2">
            <span>Mission: {TOTAL_MOCK_TARGET} Mock Exams (20 Papers × 3 Passes) + 9 Review Days</span>
          </h2>
          <p className="text-xs text-[#a9b5d0] mt-1 max-w-2xl leading-relaxed">
            Target tracking across {totalDays} days: 2 mock simulation days followed by 1 dedicated Deep Review day (40+ hours saved for error analysis).
          </p>
        </div>
      </div>

      {/* Baseline Diagnostic vs Target Comparison Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1c1836] via-[#161d33] to-[#122238] border border-purple-500/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">
              Diagnostic Baseline (Mock 45C) vs Target Summit (79+ Superior)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
            Emergency Focus: Reading (40 ➔ 72) &amp; Writing (61 ➔ 76)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#0e1729]/80 border border-slate-800">
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
              <div key={i} className="p-2 rounded-lg bg-[#0e1729] border border-slate-800 text-left">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Overall Mock Average */}
        <div className="p-4 rounded-2xl bg-[#0e1729] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a9b5d0]">
            <span className="font-semibold text-emerald-300">Cumulative Mock Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#edf2ff]">
              {cumulative.overallAverage !== null ? `${cumulative.overallAverage.toFixed(1)}` : '—'}
            </span>
            <span className="text-xs text-[#a9b5d0]">/ 90 Average</span>
          </div>
          <p className="text-[11px] text-[#a9b5d0] leading-snug">
            Calculated across all {cumulative.totalMocksCompleted} completed mock exams. Target: 79+ Superior English.
          </p>
        </div>
      </div>
    </div>
  );
};
