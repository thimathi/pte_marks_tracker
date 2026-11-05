import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Flag,
  CheckCircle2,
  Check,
  GraduationCap,
  Mic,
  Clock,
  BookOpen
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { QUESTION_TYPES, SKILL_COLORS, getMockExamsForDay, getExamNumberForMock, getMockExamDetails } from '../config/constants';
import { MockExamRecord, MockReviewRecord } from '../types/pte';
import { MockReviewModal } from '../components/mock/MockReviewModal';

interface ReviewItem {
  typeId: string;
  typeName: string;
  skill: string;
  qIndex: number;
  score: number | null;
  notes: string;
  reviewNotes: string;
  isFlagged: boolean;
  reviewed: boolean;
}

export const ReviewPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateScore, updateGateItem, updateMockReview } = usePteData();
  const [activeTab, setActiveTab] = useState<'mock_ra' | 'practice'>('mock_ra');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'lowScore' | 'unresolved'>('all');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [activeModal, setActiveModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  // Today's Mock Exams & Reviews
  const mockKeys = getMockExamsForDay(currentDay);
  const todayMocks = mockKeys.map((key, idx) => {
    const examNum = getExamNumberForMock(currentDay, idx);
    const mockRec = currentDayData?.mockExams?.[key];
    const revRec = currentDayData?.mockReviews?.[`review0${idx + 1}`];
    const details = getMockExamDetails(examNum);
    return {
      key,
      examNum,
      details,
      mockRec,
      revRec
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-slate-800 p-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Day {currentDay} Deep Review & Error Center
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Analyze Mock Exam performance, Read Aloud (RA) scores with comma separation, deficiencies (අඩුපාඩු), and corrective actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/mock-exams"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mock Exam Center</span>
          </Link>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('mock_ra')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'mock_ra'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#141c31] text-[#a9b5d0] hover:text-[#edf2ff] border border-slate-800'
          }`}
        >
          <Mic className="w-4 h-4 text-blue-300" />
          <span>Mock Exam & Read Aloud (RA) Reviews</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#141c31] text-[#a9b5d0] hover:text-[#edf2ff] border border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Practice Question Items ({reviewItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Mock Exam & Read Aloud (RA) Deep Breakdown */}
      {activeTab === 'mock_ra' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayMocks.map(({ key, examNum, details, mockRec, revRec }) => {
              const raScoreList = (revRec?.raScores || '')
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s !== '')
                .map(Number)
                .filter((n) => !isNaN(n));

              return (
                <div
                  key={key}
                  className="rounded-2xl bg-[#141c31] border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-400 font-mono">
                            Mock #{examNum}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${details.roundBadgeColor}`}>
                            {details.timeSlot}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                          {details.testName}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          revRec?.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {revRec?.isCompleted ? 'Reviewed ✓' : 'Review Incomplete'}
                      </span>
                    </div>

                    {/* Overall Score Badge */}
                    <div className="flex items-center justify-between text-xs bg-[#0e1729] rounded-xl p-2.5 border border-slate-800">
                      <span className="text-slate-400">Overall Score:</span>
                      <span className="font-bold text-white">
                        {mockRec?.overallScore !== null && mockRec?.overallScore !== undefined
                          ? `${mockRec.overallScore} / 90`
                          : 'Not Scored'}
                      </span>
                    </div>

                    {/* Read Aloud (RA) Deep Section */}
                    <div className="rounded-xl bg-blue-950/20 border border-blue-500/30 p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Mic className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-blue-200">
                            Read Aloud (RA) Performance
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {revRec?.raAverageScore !== undefined && revRec?.raAverageScore !== null
                            ? `Average: ${revRec.raAverageScore} / 90`
                            : 'No RA scores logged'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Questions Count:</span>
                        <b className="text-white">{revRec?.raQuestionCount || 6} Questions</b>
                      </div>

                      {/* Comma-separated scores */}
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Individual Scores (Commas):
                        </span>
                        {raScoreList.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {raScoreList.map((sc, i) => (
                              <span
                                key={i}
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  sc >= 79
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : sc >= 65
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                Q{i + 1}: {sc}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            None entered (e.g. 78, 85, 62, 70, 80, 83)
                          </span>
                        )}
                      </div>

                      {/* Deficiencies / Adupadu */}
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Deficiencies & Weaknesses (අඩුපාඩු):
                        </span>
                        {revRec?.raDeficiencies ? (
                          <p className="text-xs text-amber-200/90 bg-[#0c1324] p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                            {revRec.raDeficiencies}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            No weaknesses documented yet. Document pauses, intonation drops, and pronunciation errors.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Repeated Mistakes / Observations */}
                    {revRec?.repeatedMistakes && (
                      <div className="text-xs text-slate-300 bg-[#0e1729] p-2.5 rounded-xl border border-slate-800">
                        <span className="font-semibold text-rose-300 block mb-0.5">Repeated Mistakes:</span>
                        {revRec.repeatedMistakes}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {revRec?.durationMinutes || 0} min review
                    </span>

                    <button
                      onClick={() =>
                        setActiveModal({
                          mock: mockRec || {
                            id: key,
                            examNumber: examNum,
                            studyDay: currentDay,
                            isCompleted: false
                          },
                          review: revRec
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{revRec?.isCompleted ? 'Edit RA & Review' : 'Log RA & Review'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Practice Question Review Items */}
      {activeTab === 'practice' && (
        <div className="p-8 rounded-2xl bg-[#141c31] border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-[#edf2ff]">Practice Question Tracking Removed</h3>
          <p className="text-xs text-[#a9b5d0] max-w-md mx-auto">
            This app now tracks 80 Mock Exams only. Use the Mock Exam Center for all practice.
          </p>
        </div>
      )}

      {/* Modal Popup */}
      {activeModal && (
        <MockReviewModal
          mockExam={activeModal.mock}
          reviewRecord={activeModal.review}
          onSave={async (data) => {
            const revId = activeModal.mock.id.replace('mock', 'review');
            await updateMockReview(activeModal.mock.studyDay, revId, data);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
