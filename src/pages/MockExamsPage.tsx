import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { MockReviewModal } from '../components/mock/MockReviewModal';
import { MockExamRecord, MockReviewRecord } from '../types/pte';
import { formatDateFriendly } from '../utils/dateUtils';

export const MockExamsPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateMockExam, updateMockReview, selectDay } = usePteData();
  const totalDays = studyPlan?.durationDays || 25;
  const totalMocks = totalDays * 1;
  const [activeReviewModal, setActiveReviewModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const mock1 = currentDayData?.mockExams?.mock01;
  const rev1 = currentDayData?.mockReviews?.review01;

  const handleScoreChange = async (
    mockId: 'mock01' | 'mock02',
    field: keyof MockExamRecord,
    val: string | number | null
  ) => {
    let parsedVal = val;
    if (typeof val === 'string' && val.trim() !== '') {
      parsedVal = Number(val);
    } else if (val === '') {
      parsedVal = null;
    }

    await updateMockExam(currentDay, mockId, {
      [field]: parsedVal,
      isCompleted: field === 'overallScore' ? parsedVal !== null : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Mock Exam Center · {totalMocks} Full Simulation Tests (1 / Day)
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            1 full mock exam required each day (60 Qs per mock simulation). Both score and deep review must be completed.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
            Day {currentDay} Focus: Mock #{currentDay}
          </span>
        </div>
      </div>

      {/* Active Day's Mock Exam Card */}
      <div className="max-w-4xl mx-auto w-full">
        {mock1 && (
          <div className="rounded-3xl bg-[#141c31] border border-[#2b3856] p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Daily Full Simulation (1 / Day)</span>
                <h3 className="text-xl font-bold text-[#edf2ff]">
                  Mock Exam #{currentDay} (Day {currentDay})
                </h3>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${
                mock1.isCompleted && rev1?.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {mock1.isCompleted && rev1?.isCompleted ? 'Exam & Review Complete ✓' : 'Review Required'}
              </span>
            </div>

            {/* Score inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-[#edf2ff] mb-1">
                  Overall Score / 90:
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="0–90"
                  value={mock1.overallScore !== null ? String(mock1.overallScore) : ''}
                  onChange={(e) => handleScoreChange('mock01', 'overallScore', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#3a4b70] rounded-xl px-3 py-2 text-base font-bold text-white text-center focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Speaking / 90:</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="—"
                  value={mock1.speakingScore !== null ? String(mock1.speakingScore) : ''}
                  onChange={(e) => handleScoreChange('mock01', 'speakingScore', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Writing / 90:</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="—"
                  value={mock1.writingScore !== null ? String(mock1.writingScore) : ''}
                  onChange={(e) => handleScoreChange('mock01', 'writingScore', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Reading / 90:</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="—"
                  value={mock1.readingScore !== null ? String(mock1.readingScore) : ''}
                  onChange={(e) => handleScoreChange('mock01', 'readingScore', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Listening / 90:</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="—"
                  value={mock1.listeningScore !== null ? String(mock1.listeningScore) : ''}
                  onChange={(e) => handleScoreChange('mock01', 'listeningScore', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Questions Done:</label>
                <input
                  type="number"
                  value={mock1.questionsAttempted || 60}
                  onChange={(e) => handleScoreChange('mock01', 'questionsAttempted', e.target.value)}
                  className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-white text-center"
                />
              </div>
            </div>

            {/* Mistakes & Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-[#edf2ff] mb-1">
                Main Mistakes & Strategy Observations:
              </label>
              <textarea
                placeholder="Document key mistakes: e.g. R/W FIB collocations, oral fluency stumbles, WFD spellings"
                value={mock1.mainMistakes || ''}
                onChange={(e) => handleScoreChange('mock01', 'mainMistakes', e.target.value)}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-3 text-xs text-[#edf2ff] focus:outline-none focus:border-purple-400 min-h-[60px]"
              />
            </div>

            {/* Launch Review Workflow Button */}
            <div className="pt-2 border-t border-[#2b3856] flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Review Duration: <b>{rev1?.durationMinutes || 0} min</b>
              </span>

              <button
                type="button"
                onClick={() => setActiveReviewModal({ mock: mock1, review: rev1 })}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{rev1?.isCompleted ? 'Edit Deep Review' : 'Start Mock Review (Required)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mock Exams Complete Progression Table */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              All {totalMocks} Planned Mock Exams Schedule & Score Register
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">1 Exam / Day × {totalDays} Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#2b3856] text-[#a9b5d0]">
                <th className="py-2.5 px-3">Exam #</th>
                <th className="py-2.5 px-3">Study Day</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Overall / 90</th>
                <th className="py-2.5 px-3">Speaking</th>
                <th className="py-2.5 px-3">Writing</th>
                <th className="py-2.5 px-3">Reading</th>
                <th className="py-2.5 px-3">Listening</th>
                <th className="py-2.5 px-3">Exam Status</th>
                <th className="py-2.5 px-3">Review Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3856]/40">
              {Array.from({ length: totalMocks }, (_, i) => {
                const examNum = i + 1;
                const dayNum = examNum;
                const mockId = 'mock01';
                const reviewId = 'review01';
                const dayRec = days[dayNum];
                const mockRec = dayRec?.mockExams?.[mockId];
                const revRec = dayRec?.mockReviews?.[reviewId];

                return (
                  <tr
                    key={examNum}
                    className={`hover:bg-[#19243d]/50 transition-colors ${
                      dayNum === currentDay ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold font-mono text-purple-300">
                      Mock #{examNum}
                    </td>
                    <td className="py-2.5 px-3 text-[#edf2ff] font-medium">
                      Day {dayNum}
                    </td>
                    <td className="py-2.5 px-3 text-[#a9b5d0]">
                      {dayRec ? formatDateFriendly(dayRec.date) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-[#a9b5d0]">60 Qs</td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {mockRec?.overallScore !== null && mockRec?.overallScore !== undefined
                        ? `${mockRec.overallScore}/90`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-blue-300">{mockRec?.speakingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-purple-300">{mockRec?.writingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-emerald-300">{mockRec?.readingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-amber-300">{mockRec?.listeningScore ?? '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        mockRec?.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#253655] text-[#a9b5d0]'
                      }`}>
                        {mockRec?.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        revRec?.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {revRec?.isCompleted ? 'Reviewed ✓' : 'Unreviewed'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => selectDay(dayNum)}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        Select Day {dayNum}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal popup */}
      {activeReviewModal && (
        <MockReviewModal
          mockExam={activeReviewModal.mock}
          reviewRecord={activeReviewModal.review}
          onSave={async (data) => {
            const reviewId = activeReviewModal.mock.id === 'mock01' ? 'review01' : 'review02';
            await updateMockReview(activeReviewModal.mock.studyDay, reviewId, data);
          }}
          onClose={() => setActiveReviewModal(null)}
        />
      )}
    </div>
  );
};
