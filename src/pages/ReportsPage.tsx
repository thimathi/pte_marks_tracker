import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  FileText,
  Download,
  TrendingUp,
  Award,
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { calculateDayBreakdown, calculateStreak } from '../utils/scoring';
import { exportPracticeScoresCsv, exportMockExamsCsv } from '../utils/csvExport';
import { DAY_TARGET_SCORES, TOTAL_STUDY_DAYS } from '../config/constants';

export const ReportsPage: React.FC = () => {
  const { studyPlan, days } = usePteData();
  const streak = calculateStreak(days);
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = totalDays * 2;

  // Prepare chart data for study days
  const practiceTrendData = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const day = days[dayNum];
    const b = calculateDayBreakdown(day, studyPlan.questionTargets);
    const target = DAY_TARGET_SCORES[i];

    return {
      day: `D${dayNum}`,
      average: b.dailyAverage,
      target,
      completed: b.totalCompleted,
      speaking: b.speakingAverage,
      writing: b.writingAverage,
      reading: b.readingAverage,
      listening: b.listeningAverage
    };
  });

  // Prepare chart data for mock exams
  const mockProgressionData: { mock: string; score: number | null; target: number }[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const day = days[d];
    const target = DAY_TARGET_SCORES[d - 1];

    const m1Score = day?.mockExams?.mock01?.overallScore ?? null;
    const m2Score = day?.mockExams?.mock02?.overallScore ?? null;

    mockProgressionData.push({
      mock: `M${(d * 2) - 1}`,
      score: m1Score,
      target
    });

    mockProgressionData.push({
      mock: `M${d * 2}`,
      score: m2Score,
      target
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Analytics, Score Trends & Data Export
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            {totalDays}-Day practice trajectory, {totalMocks}-mock simulation score progression, and CSV export.
          </p>
        </div>

        {/* CSV Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportPracticeScoresCsv(days, studyPlan)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Practice CSV</span>
          </button>

          <button
            onClick={() => exportMockExamsCsv(days)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export {totalMocks} Mocks CSV</span>
          </button>
        </div>
      </div>

      {/* Chart 1: Practice Score Progression vs Target */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              Daily Practice Average vs. Target Score Curve (Day 1 – {totalDays})
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">Scores out of 90</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={practiceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3856" />
              <XAxis dataKey="day" stroke="#a9b5d0" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 90]} stroke="#a9b5d0" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141c31', borderColor: '#2b3856', borderRadius: '12px' }}
                itemStyle={{ color: '#edf2ff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="average"
                name="Daily Practice Avg"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target Curve (62+ ➔ 86+)"
                stroke="#80a7ff"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Mock Exams Progression */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              All {totalMocks} Mock Simulations Progression (Mock 1 to {totalMocks})
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">Target: 80+ / 90</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockProgressionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3856" />
              <XAxis dataKey="mock" stroke="#a9b5d0" interval={1} tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 90]} stroke="#a9b5d0" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141c31', borderColor: '#2b3856', borderRadius: '12px' }}
                itemStyle={{ color: '#edf2ff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="score"
                name="Mock Exam Score"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 3, fill: '#a855f7' }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target Benchmark"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Daily Practice Questions Completed (out of 200) */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              Daily Practice Load Completed (200 Questions / Day)
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">Target: 200 / Day</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={practiceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3856" />
              <XAxis dataKey="day" stroke="#a9b5d0" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 220]} stroke="#a9b5d0" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141c31', borderColor: '#2b3856', borderRadius: '12px' }}
                itemStyle={{ color: '#edf2ff', fontSize: '12px' }}
              />
              <Bar dataKey="completed" name="Questions Scored" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
