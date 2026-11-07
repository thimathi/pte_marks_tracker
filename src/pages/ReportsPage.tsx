import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  TrendingUp,
  Award
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { exportMockExamsCsv } from '../utils/csvExport';
import { DAY_TARGET_SCORES, TOTAL_STUDY_DAYS, TOTAL_MOCK_TARGET, getMockExamsForDay, getExamNumberForMock } from '../config/constants';

export const ReportsPage: React.FC = () => {
  const { studyPlan, days } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = TOTAL_MOCK_TARGET;

  // Prepare chart data for all planned mock exams across study days
  const mockProgressionData: { mock: string; score: number | null; target: number }[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const day = days[d];
    const target = DAY_TARGET_SCORES[d - 1] || 79;
    const mockIds = getMockExamsForDay(d);
    mockIds.forEach((mId, idx) => {
      const examNum = getExamNumberForMock(d, idx);
      const score = day?.mockExams?.[mId]?.overallScore ?? null;
      mockProgressionData.push({
        mock: `M${examNum}`,
        score,
        target
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#151d2e] border border-slate-800 p-6 shadow-xs text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              Analytics, Score Trends &amp; Data Export
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {totalDays}-Day trajectory, {totalMocks}-mock simulation score progression, and CSV export.
          </p>
        </div>

        {/* CSV Export Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportMockExamsCsv(days)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export {totalMocks} Mocks CSV</span>
          </button>
        </div>
      </div>

      {/* Chart: Mock Exams Progression */}
      <div className="rounded-2xl bg-[#151d2e] border border-slate-800 p-6 space-y-4 shadow-xs text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-slate-100">
              All {totalMocks} Mock Simulations Progression (Mock #1 to #{totalMocks})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Target: {studyPlan.targetScores?.overall || 78}+ / 90</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockProgressionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26334d" />
              <XAxis dataKey="mock" stroke="#94a3b8" interval={2} tick={{ fontSize: 9 }} />
              <YAxis domain={[50, 90]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151d2e', borderColor: '#26334d', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
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
    </div>
  );
};
