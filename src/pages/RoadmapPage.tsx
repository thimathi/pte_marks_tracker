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
  Zap,
  Search
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
  TOTAL_MOCK_EXAM_QUESTIONS,
  isReviewDay,
  getReviewDayDefinition,
  getSectionTestForDay
} from '../config/constants';

export const RoadmapPage: React.FC = () => {
  const { studyPlan, days, currentDay, selectDay } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const navigate = useNavigate();

  const [selectedPassFilter, setSelectedPassFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const handleSelectDay = (dayNum: number) => {
    selectDay(dayNum);
    if (isReviewDay(dayNum)) {
      navigate('/review');
    } else {
      navigate('/mock-exams');
    }
  };

  // Calculate overall mission-wide stats across all 60 mock exams
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

  // Calculate progress for each of the 3 Passes (Rounds) of 20 papers each
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 lg:p-7 shadow-sm text-slate-900 relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                60-Mock Exam Mastery Roadmap
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                20 Unique Papers × 3 Passes
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                9 Dedicated Deep Review Days
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {totalDays} Days · Nov 04 – Dec 10, 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              PTE {totalDays}-Day Protocol Roadmap (Dec 10 Exam)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              14–15 Hours high-efficiency daily curriculum · Tailored for <b>Speaking {studyPlan.targetScores?.speaking || 87}</b>, <b>Writing {studyPlan.targetScores?.writing || 84}</b>, and <b>Overall {studyPlan.targetScores?.overall || 78}+</b> summit readiness on December 10.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Completed</span>
              <span className="text-lg font-extrabold text-blue-700 font-mono">
                {totalMocksDoneAllDays} <span className="text-xs text-slate-400">/ 60</span>
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Questions Done</span>
              <span className="text-lg font-extrabold text-emerald-700 font-mono">
                {totalQuestionsDone.toLocaleString()} <span className="text-xs text-slate-400">/ 3,600</span>
              </span>
            </div>

            {avgOverallScore !== null && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Avg Score</span>
                <span className="text-lg font-extrabold text-purple-700 font-mono">
                  {avgOverallScore} <span className="text-xs text-slate-400">/ 90</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Passes / Rounds Milestone Architecture */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pass 1 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '1' ? 'all' : '1')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '1'
                ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                Pass 1 · First Attempt
              </span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {pass1.done} / 20 ({pass1.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Diagnostic Baseline (Exams 1–20)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Days 1–8 · Day 1 starts with Mock Test A, 37B, 40B, 45C
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${pass1.percent}%` }} />
            </div>
          </div>

          {/* Pass 2 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '2' ? 'all' : '2')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '2'
                ? 'bg-purple-50 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                Pass 2 · Correction
              </span>
              <span className="text-xs font-mono font-bold text-purple-700">
                {pass2.done} / 20 ({pass2.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Error Rectification (Exams 21–40)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Days 10–17 · Fix FIB, WFD & Read Aloud deficiencies
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${pass2.percent}%` }} />
            </div>
          </div>

          {/* Pass 3 */}
          <div
            onClick={() => setSelectedPassFilter(selectedPassFilter === '3' ? 'all' : '3')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedPassFilter === '3'
                ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Pass 3 · 78+ Peak (Summit)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {pass3.done} / 20 ({pass3.percent}%)
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Summit Ready (Exams 41–60)</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Days 19–37 · Peak 78+ Mastery (Dec 10 Summit)
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${pass3.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            Filter by Pass:
          </span>
          {[
            { id: 'all', label: `All ${totalDays} Days (Dec 10 Summit)` },
            { id: '1', label: 'Pass 1 · Baseline (D1–D8)' },
            { id: '2', label: 'Pass 2 · Rectify (D10–D17)' },
            { id: '3', label: 'Pass 3 · Summit (D19–D37)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedPassFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPassFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Click any day to open in the <b>Mock Exam Center</b> or <b>Review Center</b>
        </span>
      </div>

      {/* All Study Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: totalDays }, (_, i) => i + 1)
          .filter((dayNum) => {
            if (selectedPassFilter === 'all') return true;
            if (selectedPassFilter === '1') return dayNum >= 1 && dayNum <= 9;
            if (selectedPassFilter === '2') return dayNum >= 10 && dayNum <= 18;
            if (selectedPassFilter === '3') return dayNum >= 19 && dayNum <= totalDays;
            return true;
          })
          .map((dayNum) => {
            const dayData = days[dayNum];
            const isUnlocked = dayData?.gateStatus?.isUnlocked ?? (dayNum === 1);
            const isCompleted = dayData?.status === 'completed';
            const isCurrent = dayNum === currentDay;
            const targetScore = DAY_TARGET_SCORES[dayNum - 1] ?? 79;
            const isRevDay = isReviewDay(dayNum);
            const revDef = getReviewDayDefinition(dayNum);

            const mockKeys = getMockExamsForDay(dayNum);
            const dayMocksCount = mockKeys.length;
            const completedMocksCount = mockKeys.filter((k) => dayData?.mockExams?.[k]?.isCompleted).length;
            const completedReviewsCount = mockKeys.filter((_, idx) => dayData?.mockReviews?.[`review0${idx + 1}`]?.isCompleted).length;
            const secDef = getSectionTestForDay(dayNum);
            const secRec = dayData?.sectionTest;

            const dayExamNumbers = mockKeys.map((_, idx) => getExamNumberForMock(dayNum, idx));
            const firstExamNum = dayExamNumbers[0];
            const lastExamNum = dayExamNumbers[dayExamNumbers.length - 1];

            // Determine pass label for day
            let passBadge = 'Pass 1';
            let passBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (isRevDay) {
              passBadge = '🔍 Deep Review Day';
              passBadgeColor = 'bg-purple-500/25 text-purple-200 border-purple-400/40 font-bold';
            } else if (dayNum === 1) {
              passBadge = 'Pass 1 · First Attempt';
              passBadgeColor = 'bg-blue-500/25 text-blue-200 border-blue-400/40 font-bold';
            } else if (dayNum > 18) {
              passBadge = 'Pass 3 · 79+ Peak';
              passBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            } else if (dayNum > 9) {
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
                    ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : isRevDay
                    ? 'bg-purple-50/60 border-purple-300 hover:border-purple-400'
                    : isCompleted || isAllDayMocksDone
                    ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                        isCompleted || isAllDayMocksDone
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isCurrent
                          ? 'bg-blue-600 text-white border-blue-500'
                          : isRevDay
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : isUnlocked
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {isCompleted || isAllDayMocksDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      ) : isRevDay ? (
                        <Search className="w-4 h-4 text-purple-700" />
                      ) : (
                        `D${dayNum}`
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        Day {dayNum}
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                            Active
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateFriendly(dayData?.date || studyPlan.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-700 block">
                      Target: {targetScore}+
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block mt-0.5 ${passBadgeColor}`}
                    >
                      {passBadge}
                    </span>
                  </div>
                </div>

                {/* Day Content */}
                {isRevDay && revDef ? (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-purple-700" />
                        {revDef.title}
                      </span>
                      <span className="text-[10px] font-mono text-purple-800 font-bold px-1.5 py-0.5 rounded bg-purple-100">
                        {revDef.examNumbers.length} Mocks
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      No new mocks. 8 hours dedicated for question-by-question mistake analysis & Read Aloud recordings review from Days {revDef.coveredDays.join(' & ')}.
                    </p>
                  </div>
                ) : dayMocksCount > 0 ? (
                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-bold flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        {`Mocks #${firstExamNum} – #${lastExamNum} (${dayMocksCount} Tests)`}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {dayMocksCount * 60} Qs
                      </span>
                    </div>

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
                          className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50/70 border border-slate-200"
                        >
                          <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                            <span className="text-[10px] font-mono text-blue-700 font-bold shrink-0">
                              #{examNum}
                            </span>
                            <span className="font-medium text-slate-800 truncate" title={details.testName}>
                              {details.testName.replace(/【.*?】/, '')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {isDone ? (
                              <span className="text-emerald-700 font-bold font-mono text-xs">
                                {mockRec?.overallScore}/90
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-medium">
                                {details.timeSlot.split('–')[0].trim()}
                              </span>
                            )}
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDone && isReviewed
                                    ? 'bg-emerald-600'
                                    : isDone
                                    ? 'bg-amber-500'
                                    : 'bg-slate-300'
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

                {/* Daily Assigned Section Test */}
                {secDef && (
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-purple-950/25 border border-purple-500/30">
                    <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                      <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-medium text-purple-200 truncate" title={secDef.title}>
                        {secDef.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      secRec?.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {secRec?.isCompleted ? `${secRec.score ?? 0}/90 ✓` : 'Section Test'}
                    </span>
                  </div>
                )}

                {/* Day Summary Progress Statistics */}
                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/60">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{isRevDay ? 'Review Progress' : 'Simulations Completed'}</span>
                    <span className="font-mono font-bold text-white">
                      {isRevDay && revDef
                        ? `${revDef.examNumbers.filter((e) => {
                            const { dayNumber: dNum, reviewKey } = getDayAndSlotForExam(e);
                            return !!days[dNum]?.mockReviews?.[reviewKey]?.isCompleted;
                          }).length} / ${revDef.examNumbers.length} Reviewed`
                        : `${completedMocksCount} / ${dayMocksCount} (${dayMocksCount > 0 ? Math.round((completedMocksCount / dayMocksCount) * 100) : 100}%)`}
                    </span>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {isRevDay
                      ? 'Review Hub · Mistakes & RA'
                      : dayNum === 1
                      ? '4 Baseline Diagnostic Tests'
                      : dayNum === 28
                      ? 'Summit Pearson Victory'
                      : `${dayMocksCount} Mocks (${dayMocksCount * 60} Qs)`}
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isRevDay ? 'Open in Reviews' : 'Open in Mocks'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
