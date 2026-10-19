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
  Clock
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown } from '../utils/scoring';
import { formatDateFriendly, isDatePast } from '../utils/dateUtils';
import { DAY_TARGET_SCORES } from '../config/constants';

export const RoadmapPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const totalDays = studyPlan.durationDays || 25;
  const navigate = useNavigate();

  const handleSelectDay = (dayNum: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      alert(`🔒 Day ${dayNum} is locked! Complete all 7 daily criteria for Day ${dayNum - 1} first.`);
      return;
    }
    selectDay(dayNum);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-[#edf2ff]">PTE - Daily Study Plan – Superior English Roadmap</h1>
        </div>
        <p className="text-xs text-[#a9b5d0] leading-relaxed max-w-3xl">
          Started: <b className="text-blue-300">{formatDateFriendly(studyPlan.startDate)}</b> · {totalDays}-Day Mountain Staircase (Target 62+ ➔ 86+). Strict sequential unlocking enforces mastery across 278 daily questions in 4 groups.
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
          const mock1 = dayData?.mockExams?.mock01;
          const mock2 = dayData?.mockExams?.mock02;

          return (
            <div
              key={dayNum}
              onClick={() => handleSelectDay(dayNum, isUnlocked)}
              className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between space-y-4 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-br from-[#192746] to-[#141c31] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-400'
                  : isCompleted
                  ? 'bg-[#10192c] border-emerald-500/40 hover:border-emerald-400'
                  : isUnlocked
                  ? 'bg-[#141c31] border-[#2b3856] hover:border-blue-400'
                  : 'bg-[#0d1424]/60 border-[#2b3856]/40 opacity-70 cursor-not-allowed'
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
                      : 'bg-[#10192c] text-[#a9b5d0] border-[#2b3856]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : !isUnlocked ? <Lock className="w-4 h-4 text-red-400" /> : `D${dayNum}`}
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
                      ? 'bg-red-500/20 text-red-400'
                      : isUnlocked
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-[#253655] text-[#a9b5d0]'
                  }`}>
                    {isCompleted ? 'Completed ✓' : isOverdue ? 'Overdue Rolled' : isUnlocked ? 'In Progress' : 'Locked 🔒'}
                  </span>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-[#a9b5d0] mb-1">
                    <span>Practice: {breakdown.totalCompleted} / {breakdown.totalDailyTarget || 200} Qs</span>
                    <span>{breakdown.completionPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0e1729] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-blue-500'}`}
                      style={{ width: `${breakdown.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Score and Mocks */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#0e1729] border border-[#2b3856]">
                    <span className="text-[#a9b5d0] block text-[10px]">Practice Avg:</span>
                    <span className="font-bold text-[#edf2ff]">
                      {breakdown.dailyAverage !== null ? `${breakdown.dailyAverage.toFixed(1)}/90` : '—'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0e1729] border border-[#2b3856]">
                    <span className="text-[#a9b5d0] block text-[10px]">Mocks (2 planned):</span>
                    <span className="font-bold text-[#edf2ff]">
                      {mock1?.overallScore !== null ? `M1:${mock1.overallScore}` : 'M1:—'} · {mock2?.overallScore !== null ? `M2:${mock2.overallScore}` : 'M2:—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-[#2b3856]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#a9b5d0]">
                  {isCompleted
                    ? 'Day gate passed'
                    : isUnlocked
                    ? 'All 7 criteria required'
                    : `Locked until Day ${dayNum - 1} complete`}
                </span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {isUnlocked ? 'Open Day' : 'Locked'} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
