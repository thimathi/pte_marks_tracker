import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  AlertTriangle,
  Flag,
  CheckCircle2,
  Filter,
  MessageSquare,
  Check,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Mic,
  Clock,
  BookOpen
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { QUESTION_TYPE_MAP, QUESTION_TYPES, SKILL_COLORS, getMockExamsForDay, getExamNumberForMock, getMockExamDetails } from '../config/constants';
import { QuestionAttempt, MockExamRecord, MockReviewRecord } from '../types/pte';
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

  // Gather review items from currentDayData
  const reviewItems: ReviewItem[] = [];

  for (const meta of QUESTION_TYPES) {
    const target = studyPlan.questionTargets[meta.id] ?? meta.defaultTarget;
    const attempts = currentDayData?.questionProgress?.[meta.id]?.attempts || {};

    for (let i = 0; i < target; i++) {
      const a = attempts[i];
      if (a) {
        const isLowScore = a.score !== null && a.score < 65;
        const isFlagged = !!a.isFlaggedForReview;

        if (isFlagged || isLowScore || (a.notes && a.notes.trim() !== '')) {
          reviewItems.push({
            typeId: meta.id,
            typeName: meta.name,
            skill: meta.skill,
            qIndex: i,
            score: a.score,
            notes: a.notes || '',
            reviewNotes: a.reviewNotes || '',
            isFlagged,
            reviewed: !!a.reviewed
          });
        }
      }
    }
  }

  const unresolvedCount = reviewItems.filter((item) => !item.reviewed).length;
  const isPracticeReviewDone = !!currentDayData?.gateStatus?.dailyPracticeReviewCompleted;

  const filteredItems = reviewItems.filter((item) => {
    if (filter === 'flagged') return item.isFlagged;
    if (filter === 'lowScore') return item.score !== null && item.score < 65;
    if (filter === 'unresolved') return !item.reviewed;
    return true;
  });

  const handleMarkItemReviewed = async (item: ReviewItem) => {
    const rNote = editingNotes[`${item.typeId}_${item.qIndex}`] ?? item.reviewNotes;
    await updateScore(currentDay, item.typeId, item.qIndex, {
      reviewed: !item.reviewed,
      reviewNotes: rNote
    });
  };

  const handleConfirmDailyReview = async () => {
    await updateGateItem(currentDay, 'dailyPracticeReviewCompleted', true);
  };

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
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {(['all', 'unresolved', 'flagged', 'lowScore'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#141c31] text-[#a9b5d0] hover:text-[#edf2ff] border border-slate-800'
                  }`}
                >
                  {f === 'lowScore' ? 'Low Score (<65)' : f}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmDailyReview}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPracticeReviewDone
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#243553] text-[#a9b5d0] border border-[#3a4b70] hover:bg-[#30476c]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isPracticeReviewDone ? 'Daily Review Confirmed ✓' : 'Confirm Practice Review Done'}</span>
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#141c31] border border-slate-800 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-[#edf2ff]">No Practice Items in this Review Filter</h3>
              <p className="text-xs text-[#a9b5d0] max-w-md mx-auto">
                All mock exam and practice reviews in this category are satisfied.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const key = `${item.typeId}_${item.qIndex}`;
                const skillStyle = SKILL_COLORS[item.skill] || SKILL_COLORS.speaking;

                return (
                  <div
                    key={key}
                    className={`rounded-2xl border p-5 transition-all space-y-3 ${
                      item.reviewed
                        ? 'bg-[#10192c]/50 border-emerald-500/30'
                        : 'bg-[#141c31] border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${skillStyle.badge} uppercase`}>
                          {item.skill}
                        </span>
                        <h3 className="text-sm font-bold text-[#edf2ff]">
                          {item.typeName} · Q{item.qIndex + 1}
                        </h3>
                        {item.isFlagged && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Flag className="w-3 h-3" /> FLAGGED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#a9b5d0]">
                          Score: <b className="text-white">{item.score !== null ? `${item.score}/90` : '—'}</b>
                        </span>
                        <button
                          onClick={() => handleMarkItemReviewed(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            item.reviewed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{item.reviewed ? 'Resolved ✓' : 'Mark Reviewed'}</span>
                        </button>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-[#a9b5d0] bg-[#0e1729] p-2.5 rounded-xl border border-slate-800">
                        <b className="text-[#edf2ff]">Original Note:</b> {item.notes}
                      </p>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">
                        Corrective Action / Solution Note:
                      </label>
                      <input
                        type="text"
                        defaultValue={item.reviewNotes}
                        placeholder="Enter what you learned, vocabulary fixes, or repeat action plan"
                        onChange={(e) =>
                          setEditingNotes((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full bg-[#0e1729] border border-slate-800 rounded-xl px-3 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
