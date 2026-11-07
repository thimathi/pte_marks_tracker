import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Lock,
  Clock,
  AlertTriangle,
  ChevronRight,
  Flame,
  GraduationCap,
  Layers,
  Calendar as CalendarIcon
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown } from '../utils/scoring';
import { formatDateFriendly, isDatePast, getTodayIso } from '../utils/dateUtils';
import { DAY_TARGET_SCORES, TOTAL_STUDY_DAYS, getMockExamsForDay, getExamNumberForMock, TOTAL_MOCK_TARGET, TOTAL_PRACTICE_TARGET, getSectionTestForDay, FINAL_TARGET_DATE, DEFAULT_TARGET_SCORES } from '../config/constants';

export const CalendarPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDay);
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  const selectedDayData = days[selectedDayNum];
  const selectedBreakdown = calculateDayBreakdown(selectedDayData, studyPlan.questionTargets);
  const selectedTarget = DAY_TARGET_SCORES[selectedDayNum - 1];
  const todayIso = getTodayIso();
  const selectedMockKeys = getMockExamsForDay(selectedDayNum);
  const selectedSectionTestDef = getSectionTestForDay(selectedDayNum);
  const selectedSectionTestRecord = selectedDayData?.sectionTest;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#151d2e] border border-slate-800 p-6 shadow-sm text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-extrabold text-slate-100">
              PTE - Daily Study Plan – Superior English Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Started: <b className="text-blue-400">{formatDateFriendly(studyPlan.startDate)}</b> · Exam: <b className="text-emerald-400">{formatDateFriendly(FINAL_TARGET_DATE)}</b> · {totalDays}-Day Protocol (Target: S:{studyPlan.targetScores?.speaking || DEFAULT_TARGET_SCORES.speaking} · W:{studyPlan.targetScores?.writing || DEFAULT_TARGET_SCORES.writing} · Overall {studyPlan.targetScores?.overall || DEFAULT_TARGET_SCORES.overall}+).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-950/50 text-blue-300 border border-blue-900/60 font-semibold">
            Today: {formatDateFriendly(todayIso)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Matrix (2 cols on large) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#151d2e] border border-slate-800 p-6 space-y-4 shadow-sm text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              Day 1 through Day {totalDays} Schedule Matrix
            </h3>
            <span className="text-xs text-slate-400">Click any day to view details</span>
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
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative min-h-[90px] shadow-2xs ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : isCompleted
                      ? 'bg-emerald-950/30 border-emerald-800/60 hover:border-emerald-700'
                      : isOverdue
                      ? 'bg-red-950/30 border-red-800/60 hover:border-red-700'
                      : isUnlocked
                      ? 'bg-[#0d131f] border-slate-800 hover:border-blue-500/60'
                      : 'bg-[#0a0e17]/80 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">D{dNum}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    ) : isOverdue ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    ) : null}
                  </div>

                  <div className="text-[10px] text-slate-400 leading-tight my-1">
                    {day ? day.date.split('-').slice(1).join('/') : ''}
                    {isToday && <span className="block text-blue-400 font-bold">Today</span>}
                  </div>

                  <div className="text-[9px] font-semibold">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-bold">Done ✓</span>
                    ) : isOverdue ? (
                      <span className="text-rose-400 font-bold">Overdue</span>
                    ) : isUnlocked ? (
                      <span className="text-blue-400">Active</span>
                    ) : (
                      <span className="text-slate-500">Locked</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-900/60 border border-blue-600" />
              <span>Active / Unlocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-900/60 border border-rose-600" />
              <span>Overdue (Rolled Forward)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
              <span>Locked</span>
            </div>
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="rounded-2xl bg-[#151d2e] border border-slate-800 p-6 space-y-4 flex flex-col justify-between shadow-sm text-slate-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Inspector</span>
                <h3 className="text-lg font-bold text-slate-100">Study Day {selectedDayNum}</h3>
              </div>
              <span className="text-xs text-blue-400 font-bold">Target: {selectedTarget}+</span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">
                Planned Date: <b className="text-slate-200">{formatDateFriendly(selectedDayData?.date || '')}</b>
              </p>
              <p className="text-slate-400">
                Status: <b className="text-slate-200 capitalize">{selectedDayData?.status || 'Locked'}</b>
              </p>
              <p className="text-slate-400">
                Practice: <b className="text-slate-200">
                  {selectedDayNum === 1
                    ? 'Rescheduled across Days 2–17 (+19 Qs/day)'
                    : `${selectedBreakdown.totalCompleted} / ${selectedBreakdown.totalDailyTarget || 153} Questions`}
                </b>
              </p>
              {selectedDayNum !== 1 && (
                <p className="text-slate-400">
                  Practice Average: <b className="text-emerald-400">{selectedBreakdown.dailyAverage !== null ? `${selectedBreakdown.dailyAverage}/90` : '—'}</b>
                </p>
              )}

              {/* Dynamic Mocks List for Day */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-purple-400 block mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Mock Exams ({selectedMockKeys.length} Scheduled):
                </span>
                <div className="space-y-1.5">
                  {selectedMockKeys.map((mKey, idx) => {
                    const examNum = getExamNumberForMock(selectedDayNum, idx);
                    const mockRec = selectedDayData?.mockExams?.[mKey];
                    const isDone = !!mockRec?.isCompleted;
                    return (
                      <div key={mKey} className="flex items-center justify-between p-2 rounded-lg bg-[#0d131f] border border-slate-800 text-[11px]">
                        <span className="font-semibold text-slate-300">Mock #{examNum}</span>
                        <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {isDone ? `${mockRec?.overallScore}/90 ✓` : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedSectionTestDef && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-purple-400 block mb-1.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Daily Section Test:
                  </span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d131f] border border-slate-800 text-[11px]">
                    <span className="font-semibold text-slate-300 truncate mr-2">
                      {selectedSectionTestDef.title}
                    </span>
                    <span className={selectedSectionTestRecord?.isCompleted ? 'text-emerald-400 font-bold shrink-0' : 'text-slate-500 shrink-0'}>
                      {selectedSectionTestRecord?.isCompleted ? `${selectedSectionTestRecord.score ?? 0}/90 ✓` : 'Pending'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                selectDay(selectedDayNum);
                alert(`Selected Day ${selectedDayNum} as active study day.`);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
