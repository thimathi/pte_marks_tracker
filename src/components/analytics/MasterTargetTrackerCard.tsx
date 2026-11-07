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
import { FINAL_TARGET_DATE, TOTAL_STUDY_DAYS, BASELINE_MOCK_45C_SCORES, TOTAL_MOCK_TARGET, DEFAULT_TARGET_SCORES } from '../../config/constants';

export const MasterTargetTrackerCard: React.FC = () => {
  const { days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const targets = studyPlan.targetScores || DEFAULT_TARGET_SCORES;

  const cumulative = useMemo(() => {
    return calculateCumulativeProgress(days, studyPlan.questionTargets, totalDays);
  }, [days, studyPlan.questionTargets, totalDays]);

  const daysRemaining = getDaysRemainingUntilDeadline(FINAL_TARGET_DATE);

  const readingDiff = targets.reading - BASELINE_MOCK_45C_SCORES.reading;
  const writingDiff = targets.writing - BASELINE_MOCK_45C_SCORES.writing;
  const speakingDiff = targets.speaking - BASELINE_MOCK_45C_SCORES.speaking;
  const listeningDiff = targets.listening - BASELINE_MOCK_45C_SCORES.listening;
  const overallDiff = targets.overall - BASELINE_MOCK_45C_SCORES.overall;

  return (
    <div className="bg-[#151d2e] border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm relative overflow-hidden text-slate-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-purple-950/50 text-purple-300 font-bold text-xs border border-purple-800/60 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              {totalDays}-Day Protocol (Target: Overall {targets.overall} · S:{targets.speaking} · W:{targets.writing})
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-950/50 text-blue-300 text-xs font-semibold border border-blue-800/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Exam Day: {formatDateFriendly(FINAL_TARGET_DATE)} ({daysRemaining} Days Left)
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
            <span>Mission: 14–15h Daily Protocol &amp; Precision Target Mastery</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Personalized target tracking through {formatDateFriendly(FINAL_TARGET_DATE)}: Focused preparation tailored for <b>Speaking {targets.speaking}</b> and <b>Writing {targets.writing}</b> summits.
          </p>
        </div>
      </div>

      {/* Baseline Diagnostic vs Target Comparison Banner */}
      <div className="rounded-2xl bg-[#0d131f] border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Diagnostic Baseline (Mock 45C) vs Target Scores (Overall {targets.overall})
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-800/60">
            Summit Targets: Speaking ({BASELINE_MOCK_45C_SCORES.speaking} ➔ {targets.speaking}) &amp; Writing ({BASELINE_MOCK_45C_SCORES.writing} ➔ {targets.writing})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#151d2e] border border-slate-800 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-rose-400">{BASELINE_MOCK_45C_SCORES.overall}</span>
              <span className="text-xs text-slate-500">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">{targets.overall}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+{overallDiff} pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151d2e] border border-red-950/60 shadow-sm">
            <span className="text-[10px] text-red-400 uppercase font-bold block">Speaking (Top Priority)</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-blue-400">{BASELINE_MOCK_45C_SCORES.speaking}</span>
              <span className="text-xs text-slate-500">➔</span>
              <span className="text-lg font-extrabold text-red-400">{targets.speaking}</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold block mt-1">+{speakingDiff} pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151d2e] border border-emerald-950/60 shadow-sm">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Writing (Elite)</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-amber-400">{BASELINE_MOCK_45C_SCORES.writing}</span>
              <span className="text-xs text-slate-500">➔</span>
              <span className="text-lg font-extrabold text-emerald-400">{targets.writing}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+{writingDiff} pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151d2e] border border-amber-950/60 shadow-sm">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Reading</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-rose-400">{BASELINE_MOCK_45C_SCORES.reading}</span>
              <span className="text-xs text-slate-500">➔</span>
              <span className="text-lg font-extrabold text-amber-400">{targets.reading}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold block mt-1">+{readingDiff} pts needed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151d2e] border border-purple-950/60 shadow-sm">
            <span className="text-[10px] text-purple-400 uppercase font-bold block">Listening</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-amber-400">{BASELINE_MOCK_45C_SCORES.listening}</span>
              <span className="text-xs text-slate-500">➔</span>
              <span className="text-lg font-extrabold text-purple-400">{targets.listening}</span>
            </div>
            <span className="text-[10px] text-purple-400 font-bold block mt-1">+{listeningDiff} pts needed</span>
          </div>
        </div>

        {/* Weakness breakdown pills */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">Priority Error Correction Focus (from your Mock 45C diagnostic):</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {BASELINE_MOCK_45C_SCORES.weaknesses.map((w, i) => (
              <div key={i} className="p-2 rounded-lg bg-[#151d2e] border border-slate-800 text-left shadow-sm">
                <span className="text-[10px] font-bold text-slate-200 block truncate" title={w.item}>
                  {w.item}
                </span>
                <div className="flex items-baseline justify-between mt-1 text-[11px]">
                  <span className="text-rose-400 font-bold">{w.correctness}%</span>
                  <span className="text-slate-500 text-[9px]">Target: {w.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mock Exams Total */}
        <div className="p-4 rounded-2xl bg-[#0d131f] border border-purple-900/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-purple-400">Mock Exams Completed</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {cumulative.totalMocksCompleted}
            </span>
            <span className="text-xs text-slate-500">/ {cumulative.totalMocksGoal} Mocks</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, cumulative.mocksPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{cumulative.mocksPercent}% of {cumulative.totalMocksGoal} simulations</span>
            <span className="text-purple-400 font-bold">{cumulative.totalMockReviewsCompleted} Error Reviews</span>
          </div>
        </div>

        {/* Overall Mock Average */}
        <div className="p-4 rounded-2xl bg-[#0d131f] border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-emerald-400">Cumulative Mock Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {cumulative.overallAverage !== null ? `${cumulative.overallAverage.toFixed(1)}` : '—'}
            </span>
            <span className="text-xs text-slate-500">/ 90 Average</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Calculated across all {cumulative.totalMocksCompleted} completed mock exams. Target: 78+ Overall (S:87 · W:84 · R:69 · L:68).
          </p>
        </div>
      </div>
    </div>
  );
};
