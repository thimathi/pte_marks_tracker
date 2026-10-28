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
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, getMockExamDetails, getMockExamsForDay, getExamNumberForMock } from '../config/constants';

export const MockExamsPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateMockExam, updateMockReview, selectDay } = usePteData();
  const totalDays = studyPlan?.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = TOTAL_MOCK_TARGET; // 51

  const [activeReviewModal, setActiveReviewModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const mockKeys = getMockExamsForDay(currentDay);

  const handleScoreChange = async (
    mockId: string,
    field: keyof MockExamRecord,
    val: string | number | null
  ) => {
    let parsedVal = val;
    if (typeof val === 'string' && val.trim() !== '') {
      parsedVal = Number(val);
    } else if (val === '') {
      parsedVal = null;
    }

    const payload: Partial<MockExamRecord> = {
      [field]: parsedVal
    };
    if (field === 'overallScore') {
      payload.isCompleted = parsedVal !== null;
    }

    await updateMockExam(currentDay, mockId, payload);
  };

  // Build the complete list of all 51 planned mock exams across 17 days
  const allMocksSchedule: {
    examNumber: number;
    dayNumber: number;
    mockId: string;
    reviewId: string;
  }[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const dayMocks = getMockExamsForDay(d);
    dayMocks.forEach((mockId, idx) => {
      allMocksSchedule.push({
        examNumber: getExamNumberForMock(d, idx),
        dayNumber: d,
        mockId,
        reviewId: `review0${idx + 1}`
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Mock Exam Center · {totalMocks} Full Simulation Tests (Priority #1)
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Daily Requirement: 3 Full Mock Exams per day (60 Qs each) + Deep error analysis reviews across 17 Days.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
            Day {currentDay} Focus: {mockKeys.length} {mockKeys.length === 1 ? 'Mock Exam' : 'Mock Exams'} ({mockKeys.map((_, i) => `#${getExamNumberForMock(currentDay, i)}`).join(', ')})
          </span>
        </div>
      </div>

      {/* Active Day's Mock Exam Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#edf2ff] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            Today's Scheduled Mock Exams ({mockKeys.length} Exams Required Daily)
          </h2>
          <span className="text-xs text-purple-300 font-medium">Study Day {currentDay}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockKeys.map((key, idx) => {
            const mock = currentDayData?.mockExams?.[key];
            const reviewId = `review0${idx + 1}`;
            const rev = currentDayData?.mockReviews?.[reviewId];
            const examNumber = getExamNumberForMock(currentDay, idx);
            const examDetails = getMockExamDetails(examNumber);

            return (
              <div
                key={key}
                className="rounded-3xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2 border-b border-[#2b3856] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                      Simulation {idx + 1} of {mockKeys.length}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${examDetails.roundBadgeColor}`}>
                      {examDetails.roundTitle.split(':')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#edf2ff] leading-tight">
                      Mock #{examNumber}: {examDetails.testName}
                    </h3>
                    <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                      {examDetails.roundTitle}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-xl border ${
                      mock?.isCompleted && rev?.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : mock?.isCompleted
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {mock?.isCompleted && rev?.isCompleted
                        ? 'Exam & Review Complete ✓'
                        : mock?.isCompleted
                        ? 'Review Pending'
                        : 'Exam Pending'}
                    </span>

                    {examNumber === 1 && !mock?.isCompleted && (
                      <button
                        type="button"
                        onClick={async () => {
                          await updateMockExam(currentDay, key, {
                            overallScore: 59,
                            listeningScore: 64,
                            readingScore: 40,
                            speakingScore: 72,
                            writingScore: 61,
                            questionsAttempted: 60,
                            isCompleted: true,
                            notes: 'Baseline Diagnostic (APEUni VIP Mock Test 45C)'
                          });
                        }}
                        className="py-1 px-2.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>⚡ Load Mock 45C Baseline (59/90)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Score inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-[#edf2ff] mb-1">
                      Overall Score / 90:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="0–90"
                      value={mock?.overallScore !== null && mock?.overallScore !== undefined ? String(mock.overallScore) : ''}
                      onChange={(e) => handleScoreChange(key, 'overallScore', e.target.value)}
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
                      value={mock?.speakingScore !== null && mock?.speakingScore !== undefined ? String(mock.speakingScore) : ''}
                      onChange={(e) => handleScoreChange(key, 'speakingScore', e.target.value)}
                      className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Writing / 90:</label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="—"
                      value={mock?.writingScore !== null && mock?.writingScore !== undefined ? String(mock.writingScore) : ''}
                      onChange={(e) => handleScoreChange(key, 'writingScore', e.target.value)}
                      className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Reading / 90:</label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="—"
                      value={mock?.readingScore !== null && mock?.readingScore !== undefined ? String(mock.readingScore) : ''}
                      onChange={(e) => handleScoreChange(key, 'readingScore', e.target.value)}
                      className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Listening / 90:</label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="—"
                      value={mock?.listeningScore !== null && mock?.listeningScore !== undefined ? String(mock.listeningScore) : ''}
                      onChange={(e) => handleScoreChange(key, 'listeningScore', e.target.value)}
                      className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-2.5 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Questions Done:</label>
                    <input
                      type="number"
                      value={mock?.questionsAttempted ?? 60}
                      onChange={(e) => handleScoreChange(key, 'questionsAttempted', e.target.value)}
                      className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-2.5 py-2 text-xs text-white text-center"
                    />
                  </div>
                </div>

                {/* Mistakes & Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#edf2ff] mb-1">
                    Main Mistakes & Observations:
                  </label>
                  <textarea
                    placeholder="Document mistakes: R/W FIB collocations, oral fluency stumbles, WFD spellings..."
                    value={mock?.mainMistakes || ''}
                    onChange={(e) => handleScoreChange(key, 'mainMistakes', e.target.value)}
                    className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-purple-400 min-h-[50px]"
                  />
                </div>

                {/* Launch Review Workflow Button */}
                <div className="pt-2 border-t border-[#2b3856] flex items-center justify-between">
                  <span className="text-xs text-[#a9b5d0] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Review: <b>{rev?.durationMinutes || 0} min</b>
                  </span>

                  {mock && (
                    <button
                      type="button"
                      onClick={() => setActiveReviewModal({ mock, review: rev })}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{rev?.isCompleted ? 'Edit Deep Review' : 'Start Mock Review'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Exams Complete Progression Table */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              All {totalMocks} Planned Mock Exams Schedule & Score Register
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">
            17 Unique VIP Tests × 3 Rounds = {totalMocks} Total Mocks (3 Mocks / Day)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#2b3856] text-[#a9b5d0]">
                <th className="py-2.5 px-3">Exam #</th>
                <th className="py-2.5 px-3">APEUni Test Name</th>
                <th className="py-2.5 px-3">Round</th>
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
              {allMocksSchedule.map((item) => {
                const dayRec = days[item.dayNumber];
                const mockRec = dayRec?.mockExams?.[item.mockId];
                const revRec = dayRec?.mockReviews?.[item.reviewId];
                const details = getMockExamDetails(item.examNumber);

                return (
                  <tr
                    key={item.examNumber}
                    className={`hover:bg-[#19243d]/50 transition-colors ${
                      item.dayNumber === currentDay ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold font-mono text-purple-300">
                      Mock #{item.examNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#edf2ff] max-w-xs truncate" title={details.testName}>
                      {details.testName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${details.roundBadgeColor}`}>
                        Round {details.roundNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#edf2ff] font-medium">
                      Day {item.dayNumber}
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
                        onClick={() => selectDay(item.dayNumber)}
                        className="text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        Select Day {item.dayNumber}
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
            const revId = activeReviewModal.mock.id.replace('mock', 'review');
            await updateMockReview(activeReviewModal.mock.studyDay, revId, data);
          }}
          onClose={() => setActiveReviewModal(null)}
        />
      )}
    </div>
  );
};