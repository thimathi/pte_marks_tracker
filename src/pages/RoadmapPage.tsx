import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Lock,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { formatDateFriendly, isDatePast } from '../utils/dateUtils';
import {
  DAY_TARGET_SCORES,
  TOTAL_STUDY_DAYS,
  getMockExamsForDay,
  getExamNumberForMock,
  getMockExamDetails,
  getDayAndSlotForExam,
  TOTAL_MOCK_TARGET,
  TOTAL_MOCK_EXAM_QUESTIONS
} from '../config/constants';

export const RoadmapPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const navigate = useNavigate();

  const [selectedPassFilter, setSelectedPassFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  const handleSelectDay = (dayNum: number) => {
    selectDay(dayNum);
    navigate('/mock-exams');
  };

  // Calculate overall mission-wide stats across all 80 mock exams
  let totalMocksDoneAllDays = 0;
  let totalReviewsDoneAllDays = 0;
  let scoreSum = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dayData = days[d];
    const mKeys = getMockExamsForDay(d);
    mKeys.forEach((k, idx) => {
      const mockRec = dayData?.mockExams?.[k];
      const revRec = dayData?.mockReviews?.[`review0${idx + 1}`];
      if (mockRec?.isCompleted) {
        totalMocksDoneAllDays++;
        if (mockRec.overallScore) scoreSum += mockRec.overallScore;
      }
      if (revRec?.isCompleted) {
        totalReviewsDoneAllDays++;
      }
    });
  }

  const overallPercent = Math.round((totalMocksDoneAllDays / TOTAL_MOCK_TARGET) * 100);
  const avgOverallScore = totalMocksDoneAllDays > 0 ? Math.round(scoreSum / totalMocksDoneAllDays) : null;
  const totalQuestionsDone = totalMocksDoneAllDays * 60;

  // Calculate progress for each of the 4 Passes (Rounds) of 20 papers each
  const getPassStats = (startExam: number, endExam: number) => {
    let done = 0;
    const total = endExam - startExam + 1;
    for (let e = startExam; e <= endExam; e++) {
      const { dayNumber, mockKey } = getDayAndSlotForExam(e);
      if (days[dayNumber]?.mockExams?.[mockKey]?.isCompleted) done++;
    }
    return { done, total, percent: Math.round((done / total) * 100) };
  };

  const pass1 = getPassStats(1, 20);
  const pass2 = getPassStats(21, 40);
  const pass3 = getPassStats(41, 60);
  const pass4 = getPassStats(61, 80);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-7 relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                80-Mock Exam Mastery Roadmap
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                20 Unique Papers × 4 Passes
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                28 Days · Nov 03 – Nov 30, 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              80-Mock Exam Mastery Journey (4,800 Questions)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Every day's mock schedule is synchronized below. Day 1 features <b>4 Full Simulations (Mock Test A, 37B, 40B, 45C)</b> as your First Attempt baseline, followed by 3 daily timed mocks through Day 26, the 80th mock on Day 27, and the Pearson Summit on Day 28.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Completed</span>
              <span className="text-lg font-extrabold text-blue-400 font-mono">
                {totalMocksDoneAllDays} <span className="text-xs text-slate-500">/ 80</span>
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Questions Done</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">
                {totalQuestionsDone.toLocaleString()} <span className="text-xs text-slate-500">/ 4,800</span>
              </span>
            </div>

            {avgOverallScore !== null && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Avg Score</span>
                <span className="text-lg font-extrabold text-purple-300 font-mono">
                  {avgOverallScore} <span className="text-xs text-slate-500">/ 90</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Passes / Rounds Milestone Architecture */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pass 1 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '1' ? 'all' : '1')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '1'
                ? 'bg-blue-950/50 border-blue-400 shadow-md ring-1 ring-blue-500/30'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                Pass 1 · First Attempt
              </span>
              <span className="text-xs font-mono font-bold text-blue-300">
                {pass1.done} / 20 ({pass1.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Diagnostic Baseline (Exams 1–20)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Days 1–7 · Day 1 starts with Mock Test A, 37B, 40B, 45C
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pass1.percent}%` }} />
            </div>
          </div>

          {/* Pass 2 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '2' ? 'all' : '2')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '2'
                ? 'bg-purple-950/50 border-purple-400 shadow-md ring-1 ring-purple-500/30'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                Pass 2 · Correction
              </span>
              <span className="text-xs font-mono font-bold text-purple-300">
                {pass2.done} / 20 ({pass2.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Error Rectification (Exams 21–40)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Days 7–14 · Fix FIB & Read Aloud deficiencies
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${pass2.percent}%` }} />
            </div>
          </div>

          {/* Pass 3 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '3' ? 'all' : '3')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '3'
                ? 'bg-amber-950/50 border-amber-400 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Pass 3 · Speed
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {pass3.done} / 20 ({pass3.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Fluency Mastery (Exams 41–60)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Days 14–21 · Time control & stamina reinforcement
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pass3.percent}%` }} />
            </div>
          </div>

          {/* Pass 4 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '4' ? 'all' : '4')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '4'
                ? 'bg-emerald-950/50 border-emerald-400 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Pass 4 · 79+ Peak
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {pass4.done} / 20 ({pass4.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">Summit Ready (Exams 61–80)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Days 21–27 · Superior English consistency
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pass4.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Filter by Pass:
          </span>
          {[
            { id: 'all', label: 'All 28 Days (80 Mocks)' },
            { id: '1', label: 'Pass 1 · First Attempt (D1–D7)' },
            { id: '2', label: 'Pass 2 · Correction (D7–D14)' },
            { id: '3', label: 'Pass 3 · Fluency (D14–D21)' },
            { id: '4', label: 'Pass 4 · 79+ Summit (D21–D28)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedPassFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPassFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Click any day to open in the <b>Mock Exam Center</b>
        </span>
      </div>

      {/* 28 Study Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: totalDays }, (_, i) => i + 1)
          .filter((dayNum) => {
            if (selectedPassFilter === 'all') return true;
            if (selectedPassFilter === '1') return dayNum >= 1 && dayNum <= 7;
            if (selectedPassFilter === '2') return dayNum >= 7 && dayNum <= 14;
            if (selectedPassFilter === '3') return dayNum >= 14 && dayNum <= 21;
            if (selectedPassFilter === '4') return dayNum >= 21 && dayNum <= 28;
            return true;
          })
          .map((dayNum) => {
            const dayData = days[dayNum];
            const isUnlocked = dayData?.gateStatus?.isUnlocked ?? (dayNum === 1);
            const isCompleted = dayData?.status === 'completed';
            const isCurrent = dayNum === currentDay;
            const targetScore = DAY_TARGET_SCORES[dayNum - 1] ?? 79;
            const isOverdue = !isCompleted && dayData && isDatePast(dayData.date) && isUnlocked;

            const mockKeys = getMockExamsForDay(dayNum);
            const dayMocksCount = mockKeys.length;
            const completedMocksCount = mockKeys.filter((k) => dayData?.mockExams?.[k]?.isCompleted).length;
            const completedReviewsCount = mockKeys.filter((_, idx) => dayData?.mockReviews?.[`review0${idx + 1}`]?.isCompleted).length;

            const dayExamNumbers = mockKeys.map((_, idx) => getExamNumberForMock(dayNum, idx));
            const firstExamNum = dayExamNumbers[0];
            const lastExamNum = dayExamNumbers[dayExamNumbers.length - 1];

            // Determine pass label for day
            let passBadge = 'Pass 1';
            let passBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (dayNum === 1) {
              passBadge = 'Pass 1 · First Attempt';
              passBadgeColor = 'bg-blue-500/25 text-blue-200 border-blue-400/40 font-bold';
            } else if (dayNum > 21) {
              passBadge = 'Pass 4 · 79+ Peak';
              passBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            } else if (dayNum > 14) {
              passBadge = 'Pass 3 · Speed';
              passBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            } else if (dayNum >= 7) {
              passBadge = 'Pass 2 · Rectify';
              passBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            }

            const isAllDayMocksDone = dayMocksCount > 0 && completedMocksCount === dayMocksCount;

            return (
              <div
                key={dayNum}
                onClick={() => handleSelectDay(dayNum)}
                className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between space-y-4 cursor-pointer hover:scale-[1.01] ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[#192746] to-[#141c31] border-blue-500 shadow-lg ring-1 ring-blue-500/40'
                    : isCompleted || isAllDayMocksDone
                    ? 'bg-[#10192c] border-emerald-500/40 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-900/50 border-slate-800/40 opacity-70'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                        isCompleted || isAllDayMocksDone
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : isCurrent
                          ? 'bg-blue-600 text-white border-blue-400'
                          : isUnlocked
                          ? 'bg-[#253655] text-blue-300 border-[#3a4b70]'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isCompleted || isAllDayMocksDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        `D${dayNum}`
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        Day {dayNum}
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 font-normal">
                            Active
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateFriendly(dayData?.date || studyPlan.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-300 block">
                      Target: {targetScore}+
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block mt-0.5 ${passBadgeColor}`}
                    >
                      {passBadge}
                    </span>
                  </div>
                </div>

                {/* Day Mocks Range & Count Banner */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    {dayNum === 28
                      ? 'Official Pearson Exam Day'
                      : dayMocksCount === 1
                      ? `Mock #${firstExamNum} (Final Simulation)`
                      : `Mocks #${firstExamNum} – #${lastExamNum} (${dayMocksCount} Tests)`}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {dayMocksCount * 60} Qs
                  </span>
                </div>

                {/* Dynamic List of Specific Mock Exams Scheduled for Day */}
                {dayMocksCount > 0 ? (
                  <div className="space-y-1.5">
                    {mockKeys.map((mKey, idx) => {
                      const examNum = getExamNumberForMock(dayNum, idx);
                      const details = getMockExamDetails(examNum);
                      const mockRec = dayData?.mockExams?.[mKey];
                      const revRec = dayData?.mockReviews?.[`review0${idx + 1}`];
                      const isDone = !!mockRec?.isCompleted;
                      const isReviewed = !!revRec?.isCompleted;

                      return (
                        <div
                          key={mKey}
                          className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-950/50 border border-slate-800/60"
                        >
                          <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                            <span className="text-[10px] font-mono text-blue-400 font-bold shrink-0">
                              #{examNum}
                            </span>
                            <span className="font-medium text-slate-200 truncate" title={details.testName}>
                              {details.testName.replace(/【.*?】/, '')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {isDone ? (
                              <span className="text-emerald-400 font-bold font-mono text-xs">
                                {mockRec?.overallScore}/90
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-300/80 font-medium">
                                {details.timeSlot.split('–')[0].trim()}
                              </span>
                            )}
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDone && isReviewed
                                  ? 'bg-emerald-400'
                                  : isDone
                                  ? 'bg-amber-400'
                                  : 'bg-slate-700'
                              }`}
                              title={isDone && isReviewed ? 'Complete & Reviewed' : isDone ? 'Exam Done (Review Pending)' : 'Pending'}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1">
                    <Sparkles className="w-5 h-5 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-emerald-300">PTE Academic Real Exam Summit</p>
                    <p className="text-[10px] text-slate-400">
                      Rest, mental priming, and execution of the 79+ Superior goal!
                    </p>
                  </div>
                )}

                {/* Day Summary Progress Statistics */}
                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/60">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Simulations Completed</span>
                    <span className="font-mono font-bold text-white">
                      {completedMocksCount} / {dayMocksCount} ({dayMocksCount > 0 ? Math.round((completedMocksCount / dayMocksCount) * 100) : 100}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isAllDayMocksDone ? 'bg-emerald-400' : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${dayMocksCount > 0 ? Math.round((completedMocksCount / dayMocksCount) * 100) : 100}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>
                      Questions: <b>{completedMocksCount * 60} / {dayMocksCount * 60} Qs</b>
                    </span>
                    <span className={completedReviewsCount === dayMocksCount && dayMocksCount > 0 ? 'text-emerald-400' : 'text-slate-500'}>
                      Reviews: {completedReviewsCount}/{dayMocksCount} Done
                    </span>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {dayNum === 1
                      ? '4 Baseline Diagnostic Tests'
                      : dayNum === 28
                      ? 'Summit Pearson Victory'
                      : `${dayMocksCount} Mocks (${dayMocksCount * 60} Qs)`}
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Open in Mocks <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
