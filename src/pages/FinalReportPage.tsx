import React, { useState } from 'react';
import {
  Printer,
  Download,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown, calculateAverage } from '../utils/scoring';
import { exportPracticeScoresCsv, exportMockExamsCsv } from '../utils/csvExport';
import { formatDateFriendly } from '../utils/dateUtils';
import { QUESTION_TYPES, TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, TOTAL_PRACTICE_TARGET } from '../config/constants';

export const FinalReportPage: React.FC = () => {
  const { studyPlan, days } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = TOTAL_MOCK_TARGET;
  const totalPracticeTarget = TOTAL_PRACTICE_TARGET;

  const [personalNotes, setPersonalNotes] = useState(
    () => localStorage.getItem('pte_21day_lessons_learned') || ''
  );

  const handleNotesChange = (val: string) => {
    setPersonalNotes(val);
    localStorage.setItem('pte_21day_lessons_learned', val);
  };

  // Compile full journey statistics
  let totalPracticeQuestionsScored = 0;
  let totalMocksDone = 0;
  let totalMockReviewsDone = 0;
  let completedDaysCount = 0;

  const allPracticeScores: number[] = [];
  const skillScores: Record<string, number[]> = {
    speaking: [],
    writing: [],
    reading: [],
    listening: []
  };

  const typeScores: Record<string, number[]> = {};
  QUESTION_TYPES.forEach((q) => {
    typeScores[q.id] = [];
  });

  const mockScores: { examNum: number; score: number }[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const day = days[d];
    if (day) {
      if (day.status === 'completed') completedDaysCount++;

      const b = calculateDayBreakdown(day, studyPlan.questionTargets);
      totalPracticeQuestionsScored += b.totalCompleted;

      // Collect scores by question type
      for (const meta of QUESTION_TYPES) {
        const atts = day.questionProgress?.[meta.id]?.attempts || {};
        for (const [_, a] of Object.entries(atts)) {
          if (a && a.score !== null) {
            allPracticeScores.push(a.score);
            typeScores[meta.id].push(a.score);
            skillScores[meta.skill].push(a.score);
            if (meta.secondarySkill) {
              skillScores[meta.secondarySkill].push(a.score);
            }
          }
        }
      }

      // Collect mocks for day
      const mocks = day.mockExams || {};
      for (const [mId, m] of Object.entries(mocks)) {
        if (m?.isCompleted && m.overallScore !== null) {
          totalMocksDone++;
          mockScores.push({ examNum: m.examNumber || mockScores.length + 1, score: m.overallScore });
        }
      }
      const revs = day.mockReviews || {};
      for (const [rId, r] of Object.entries(revs)) {
        if (r?.isCompleted) totalMockReviewsDone++;
      }
    }
  }

  const overallAvg = calculateAverage(allPracticeScores).average;
  const speakingAvg = calculateAverage(skillScores.speaking).average;
  const writingAvg = calculateAverage(skillScores.writing).average;
  const readingAvg = calculateAverage(skillScores.reading).average;
  const listeningAvg = calculateAverage(skillScores.listening).average;

  // Best and weakest question types
  const typeRankings = QUESTION_TYPES.map((meta) => {
    const avg = calculateAverage(typeScores[meta.id]).average;
    return {
      meta,
      average: avg,
      count: typeScores[meta.id].length
    };
  }).filter((t) => t.average !== null);

  typeRankings.sort((a, b) => (b.average || 0) - (a.average || 0));
  const bestTypes = typeRankings.slice(0, 3);
  const weakestTypes = [...typeRankings].reverse().slice(0, 3);

  // Mock improvement calculation
  const firstMock = mockScores.length > 0 ? mockScores[0].score : null;
  const latestMock = mockScores.length > 0 ? mockScores[mockScores.length - 1].score : null;
  const mockImprovement = firstMock !== null && latestMock !== null ? latestMock - firstMock : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Final Report — PTE - Daily Study Plan – Superior English
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete executive performance audit across {totalPracticeTarget.toLocaleString()} practice questions and {totalMocks} mock exams. Print-friendly layout.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print to PDF</span>
          </button>

          <button
            onClick={() => exportPracticeScoresCsv(days, studyPlan)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="card-print bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                PTE BRIDGE OFFICIAL AUDIT
              </span>
              <span className="text-xs text-slate-500">
                {formatDateFriendly(new Date().toISOString().split('T')[0])}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              PTE - Daily Study Plan – Superior English
            </h2>
            <p className="text-xs text-slate-500">
              Started: <b className="text-slate-800">{formatDateFriendly(studyPlan.startDate)}</b> · 15h Daily Protocol (~280 Qs / Day) · Target: S:{studyPlan.targetScores.speaking || 87} · W:{studyPlan.targetScores.writing || 84} · Overall {studyPlan.targetScores.overall}+
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-3xl font-extrabold text-blue-600">
              {overallAvg !== null ? `${overallAvg}/90` : '—'}
            </div>
            <span className="text-xs text-slate-500">Practice Average Across All Attempts</span>
          </div>
        </div>

        {/* Executive Summary Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Days Completed</span>
            <div className="text-2xl font-bold text-slate-900">{completedDaysCount} / {totalDays}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {Math.round((completedDaysCount / totalDays) * 100)}% Journey Progress
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Practice Questions</span>
            <div className="text-2xl font-bold text-slate-900">{totalPracticeQuestionsScored} / {totalPracticeTarget.toLocaleString()}</div>
            <span className="text-[10px] text-blue-600 font-semibold">
              Target: 300 Qs / Day (High Score Weight Priority)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Mock Simulations</span>
            <div className="text-2xl font-bold text-slate-900">{totalMocksDone} / {totalMocks}</div>
            <span className="text-[10px] text-purple-600 font-semibold">
              1 Mock / Day + Error Audit
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Mock Reviews</span>
            <div className="text-2xl font-bold text-slate-900">{totalMockReviewsDone} / {totalMocks}</div>
            <span className="text-[10px] text-amber-600 font-semibold">
              Deep Error Analysis
            </span>
          </div>
        </div>

        {/* Skill Averages Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Four Skills Competency Breakdown
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-xs font-semibold text-blue-700">Speaking</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {speakingAvg !== null ? `${speakingAvg}/90` : '—'}
              </div>
              <span className="text-[10px] text-slate-500">Target: {studyPlan.targetScores.speaking}+</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
              <span className="text-xs font-semibold text-purple-700">Writing</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {writingAvg !== null ? `${writingAvg}/90` : '—'}
              </div>
              <span className="text-[10px] text-slate-500">Target: {studyPlan.targetScores.writing}+</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-700">Reading</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {readingAvg !== null ? `${readingAvg}/90` : '—'}
              </div>
              <span className="text-[10px] text-slate-500">Target: {studyPlan.targetScores.reading}+</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-semibold text-amber-700">Listening</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {listeningAvg !== null ? `${listeningAvg}/90` : '—'}
              </div>
              <span className="text-[10px] text-slate-500">Target: {studyPlan.targetScores.listening}+</span>
            </div>
          </div>
        </div>

        {/* Mock Exam Score Progression & Net Improvement */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Mock Simulation Trajectory & Net Gain
            </h3>
            {mockImprovement !== null && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                mockImprovement >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {mockImprovement >= 0 ? `+${mockImprovement.toFixed(1)} Points Gain` : `${mockImprovement.toFixed(1)} Points`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">First Mock Exam (Mock 1):</span>
              <span className="text-base font-bold text-slate-900">
                {firstMock !== null ? `${firstMock} / 90` : 'Not recorded yet'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Latest Recorded Mock:</span>
              <span className="text-base font-bold text-blue-600">
                {latestMock !== null ? `${latestMock} / 90` : 'Not recorded yet'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Target Mock Benchmark:</span>
              <span className="text-base font-bold text-emerald-600">
                {studyPlan.targetScores.mockExam}+ / 90
              </span>
            </div>
          </div>
        </div>

        {/* Best and Weakest Question Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Best Performing Modules
            </span>
            {bestTypes.length > 0 ? (
              <div className="space-y-1.5">
                {bestTypes.map((t) => (
                  <div key={t.meta.id} className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">{t.meta.name}</span>
                    <span className="font-bold text-emerald-700">{t.average?.toFixed(1)} / 90</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Score practice questions to populate</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Focus & Weak Modules
            </span>
            {weakestTypes.length > 0 ? (
              <div className="space-y-1.5">
                {weakestTypes.map((t) => (
                  <div key={t.meta.id} className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">{t.meta.name}</span>
                    <span className="font-bold text-amber-700">{t.average?.toFixed(1)} / 90</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Score practice questions to populate</p>
            )}
          </div>
        </div>

        {/* Personal Notes and Lessons Learned */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-900">
            Personal Study Notes & Lessons Learned (Printed in PDF Report):
          </label>
          <textarea
            value={personalNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Document key takeaways, exam day strategies, microphone placement tips, and mindset notes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[100px]"
          />
        </div>

        {/* Footer verification note */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>PTE Academic {totalDays}-Day Preparation Progress Tracking Application</span>
          <span>Verified Firebase Realtime Database Records · Asian Southeast (Singapore)</span>
        </div>
      </div>
    </div>
  );
};
