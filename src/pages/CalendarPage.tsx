import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Lock,
  Clock,
  AlertTriangle,
  ChevronRight,
  Flame,
  Calendar as CalendarIcon
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown } from '../utils/scoring';
import { formatDateFriendly, isDatePast, getTodayIso } from '../utils/dateUtils';
import { DAY_TARGET_SCORES, TOTAL_STUDY_DAYS } from '../config/constants';

export const CalendarPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDay);
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  const selectedDayData = days[selectedDayNum];
  const selectedBreakdown = calculateDayBreakdown(selectedDayData, studyPlan.questionTargets);
  const selectedTarget = DAY_TARGET_SCORES[selectedDayNum - 1];
  const todayIso = getTodayIso();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              PTE - Daily Study Plan – Superior English Calendar
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Started: <b className="text-blue-300">{formatDateFriendly(studyPlan.startDate)}</b> · {totalDays}-Day Study Schedule (2 Mocks + 300 questions daily across 10 phases).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
            Today: {formatDateFriendly(todayIso)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Matrix (2 cols on large) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
            <h3 className="text-sm font-bold text-[#edf2ff] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              Day 1 through Day {totalDays} Schedule Matrix
            </h3>
            <span className="text-xs text-[#a9b5d0]">Click any day to view details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5">
            {Array.from({ length: totalDays }, (_, i) => {
              const dNum = i + 1;
              const day = days[dNum];
              const isSelected = dNum === selectedDayNum;
              const isUnlocked = day?.gateStatus?.isUnlocked ?? (dNum === 1);
              const isCompleted = day?.status === 'completed';
              const isPast = day && isDatePast(day.date);
              const isOverdue = !isCompleted && isPast && isUnlocked;
              const isToday = day && day.date === todayIso;

              return (
                <button
                  key={dNum}
                  onClick={() => setSelectedDayNum(dNum)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative min-h-[90px] ${
                    isSelected
                      ? 'ring-2 ring-blue-400 bg-[#1e2a47] border-blue-500 shadow-lg'
                      : isCompleted
                      ? 'bg-[#10192c] border-emerald-500/40 hover:border-emerald-400'
                      : isOverdue
                      ? 'bg-red-500/10 border-red-500/30 hover:border-red-400'
                      : isUnlocked
                      ? 'bg-[#141c31] border-[#2b3856] hover:border-blue-400'
                      : 'bg-[#0d1424]/50 border-[#2b3856]/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#edf2ff]">D{dNum}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-red-400" />
                    ) : isOverdue ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    ) : null}
                  </div>

                  <div className="text-[10px] text-[#a9b5d0] leading-tight my-1">
                    {day ? day.date.split('-').slice(1).join('/') : ''}
                    {isToday && <span className="block text-blue-400 font-bold">Today</span>}
                  </div>

                  <div className="text-[9px] font-semibold">
                    {isCompleted ? (
                      <span className="text-emerald-400">Done ✓</span>
                    ) : isOverdue ? (
                      <span className="text-red-400 font-bold">Overdue</span>
                    ) : isUnlocked ? (
                      <span className="text-blue-300">Active</span>
                    ) : (
                      <span className="text-[#a9b5d0]">Locked</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#a9b5d0] pt-3 border-t border-[#2b3856]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500" />
              <span>Active / Unlocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40" />
              <span>Overdue (Rolled Forward)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#0d1424] border border-[#2b3856]" />
              <span>Locked</span>
            </div>
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Inspector</span>
                <h3 className="text-lg font-bold text-[#edf2ff]">Study Day {selectedDayNum}</h3>
              </div>
              <span className="text-xs text-blue-300 font-bold">Target: {selectedTarget}+</span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#a9b5d0]">
                Planned Date: <b className="text-[#edf2ff]">{formatDateFriendly(selectedDayData?.date || '')}</b>
              </p>
              <p className="text-[#a9b5d0]">
                Status: <b className="text-white capitalize">{selectedDayData?.status || 'Locked'}</b>
              </p>
              <p className="text-[#a9b5d0]">
                Practice Done: <b className="text-white">{selectedBreakdown.totalCompleted} / {selectedBreakdown.totalDailyTarget} Questions</b>
              </p>
              <p className="text-[#a9b5d0]">
                Practice Average: <b className="text-emerald-400">{selectedBreakdown.dailyAverage !== null ? `${selectedBreakdown.dailyAverage}/90` : '—'}</b>
              </p>
              <p className="text-[#a9b5d0]">
                Mock Exam (1/Day): <b className="text-white">{selectedDayData?.mockExams?.mock01?.overallScore !== null ? `${selectedDayData?.mockExams?.mock01?.overallScore}/90` : 'Pending'}</b>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2b3856]">
            <button
              onClick={() => {
                selectDay(selectedDayNum);
                alert(`Selected Day ${selectedDayNum} as active study day.`);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Make Day {selectedDayNum} Active View</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
