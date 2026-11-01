import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown } from '../utils/scoring';
import { formatDateFriendly, isDatePast } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  TOTAL_STUDY_DAYS,
  getMockExamsForDay,
  TOTAL_MOCK_TARGET,
  TOTAL_PRACTICE_TARGET,
  PHASE_DEFINITIONS
} from '../config/constants';

export const RoadmapPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const navigate = useNavigate();

  const handleSelectDay = (dayNum: number) => {
    selectDay(dayNum);
    navigate('/practice');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#141c31] border border-slate-800 p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-[#edf2ff]">Do or Die · 90-Mock Exam Journey Roadmap</h1>
        </div>
        <p className="text-xs text-[#a9b5d0] leading-relaxed max-w-3xl">
          Started: <b className="text-blue-300">{formatDateFriendly(studyPlan?.startDate || '2026-11-01')}</b> · {totalDays}-Day Do or Die Plan (Target Baseline ➔ 79+ Superior).
          {' '}Structured into <b>{TOTAL_MOCK_TARGET} Mock Exams (6 Mocks/Day · 5,400 Questions)</b> with Mandatory Deep Error Reviews and Daily Core Drills.
        </p>
      </div>

      {/* Day Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
          const dayData = days[dayNum];
          const isUnlocked = dayData?.gateStatus?.isUnlocked ?? (dayNum === 1);
          const isCompleted = dayData?.status === 'completed';
          const isCurrent = dayNum === currentDay;
          const targetScore = DAY_TARGET_SCORES[dayNum - 1];
          const isOverdue = !isCompleted && dayData && isDatePast(dayData.date) && isUnlocked;

          const breakdown = calculateDayBreakdown(dayData, studyPlan.questionTargets);
          const mockKeys = getMockExamsForDay(dayNum);
          const completedMocksCount = mockKeys.filter((k) => dayData?.mockExams?.[k]?.isCompleted).length;

          return (
            <div
              key={dayNum}
              onClick={() => handleSelectDay(dayNum)}
              className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between space-y-4 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-br from-[#192746] to-[#141c31] border-blue-500 shadow-sm '
                  : isCompleted
                  ? 'bg-[#10192c] border-emerald-500/40 hover:border-emerald-400'
                  : isUnlocked
                  ? 'bg-[#141c31] border-slate-800 hover:border-blue-400'
                  : 'bg-[#141c31]/80 border-slate-800 hover:border-[#3d4f7a]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isCurrent
                      ? 'bg-blue-600 text-white border-blue-400'
                      : isUnlocked
                      ? 'bg-[#253655] text-blue-300 border-[#3a4b70]'
                      : 'bg-[#10192c] text-[#a9b5d0] border-slate-800'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : `D${dayNum}`}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#edf2ff] flex items-center gap-1.5">
                      Day {dayNum}
                      {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-normal">Active</span>}
                    </h3>
                    <p className="text-[11px] text-[#a9b5d0] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateFriendly(dayData?.date || studyPlan.startDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-blue-300 block">
                    Target: {targetScore}+
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isOverdue
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isCompleted ? 'Completed ✓' : isOverdue ? 'Catchup' : '6 Mocks/Day'}
                  </span>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-[#a9b5d0] mb-1">
                    <span>Mock Simulations (6 Daily)</span>
                    <span>{completedMocksCount} / 6 ({Math.round((completedMocksCount / 6) * 100)}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0e1729] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-blue-500'}`}
                      style={{ width: `${Math.round((completedMocksCount / 6) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Score and Mocks */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#0e1729] border border-slate-800">
                    <span className="text-[#a9b5d0] block text-[10px]">Mock Questions:</span>
                    <span className="font-bold text-[#edf2ff]">
                      {completedMocksCount * 60} / 360 Qs
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0e1729] border border-slate-800">
                    <span className="text-[#a9b5d0] block text-[10px]">6 Mocks Status:</span>
                    <span className={`font-bold ${completedMocksCount === 6 ? 'text-emerald-400' : 'text-[#edf2ff]'}`}>
                      {completedMocksCount} / 6 Done
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#a9b5d0]">
                  {isCompleted
                    ? 'Day gate passed'
                    : isOverdue
                    ? 'Missed day · Catch up anytime'
                    : '6 Mocks · 360 Qs · Reviews Required'}
                </span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Day <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
