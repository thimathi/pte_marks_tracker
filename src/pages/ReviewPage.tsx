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
  ArrowRight
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { QUESTION_TYPE_MAP, QUESTION_TYPES, SKILL_COLORS } from '../config/constants';
import { QuestionAttempt } from '../types/pte';

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
  const { currentDay, currentDayData, studyPlan, updateScore, updateGateItem } = usePteData();
  const [filter, setFilter] = useState<'all' | 'flagged' | 'lowScore' | 'unresolved'>('all');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

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
        const isUnreviewed = !a.reviewed;

        // Include if flagged, low score, or has mistake notes
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Day {currentDay} Daily Practice Review Center
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Analyze low-scoring questions, repeated errors, and flagged questions. Resolution is required for Day Completion Gate #2.
          </p>
        </div>

        {/* Status Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmDailyReview}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isPracticeReviewDone
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : unresolvedCount === 0
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 animate-pulse'
                : 'bg-[#243553] text-[#a9b5d0] border border-[#3a4b70] hover:bg-[#30476c]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPracticeReviewDone ? 'Daily Review Confirmed ✓' : 'Confirm Practice Review Done'}</span>
          </button>
        </div>
      </div>

      {/* Day 1 Practice Reschedule Notice */}
      {currentDay === 1 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Day 1 Rescheduled
                </span>
                <span className="text-xs font-bold text-[#edf2ff]">
                  Practice Questions Distributed to Days 2–17 (+19 Qs / Day)
                </span>
              </div>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Practice review is automatically satisfied for Day 1. Focus your review on Mock Exam #1 (Diagnostic Baseline 45C) in the Mock Exam Center.
              </p>
            </div>
          </div>
          <Link
            to="/mock-exams"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-center transition-colors whitespace-nowrap"
          >
            <span>Review Mock #1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141c31] border border-[#2b3856] space-y-1">
          <span className="text-xs text-[#a9b5d0]">Items Needing Review</span>
          <div className="text-2xl font-bold text-[#edf2ff]">{reviewItems.length}</div>
          <p className="text-[11px] text-[#a9b5d0]">Low scores (&lt;65) or flagged questions</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141c31] border border-[#2b3856] space-y-1">
          <span className="text-xs text-[#a9b5d0]">Unresolved Items</span>
          <div className={`text-2xl font-bold ${unresolvedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {unresolvedCount}
          </div>
          <p className="text-[11px] text-[#a9b5d0]">Pending corrective notes & resolution</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141c31] border border-[#2b3856] space-y-1">
          <span className="text-xs text-[#a9b5d0]">Gate #2 Status</span>
          <div className={`text-2xl font-bold ${isPracticeReviewDone ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isPracticeReviewDone ? 'Satisfied ✓' : 'Pending Confirmation'}
          </div>
          <p className="text-[11px] text-[#a9b5d0]">Required to pass the daily gate</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2b3856] pb-3">
        {(['all', 'unresolved', 'flagged', 'lowScore'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-[#141c31] text-[#a9b5d0] hover:text-[#edf2ff] border border-[#2b3856]'
            }`}
          >
            {f === 'lowScore' ? 'Low Score (<65)' : f}
          </button>
        ))}
      </div>

      {/* Review Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#141c31] border border-[#2b3856] text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-[#edf2ff]">No Items Found in this Review Filter</h3>
          <p className="text-xs text-[#a9b5d0] max-w-md mx-auto">
            {reviewItems.length === 0
              ? 'Great work! No questions were flagged and all scored attempts met threshold. You can confirm your daily review above.'
              : 'All review items in this filter category have been resolved!'}
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
                    : 'bg-[#141c31] border-[#2b3856]'
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
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.reviewed ? 'Resolved ✓' : 'Mark Reviewed'}</span>
                    </button>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-[#a9b5d0] bg-[#0e1729] p-2.5 rounded-xl border border-[#2b3856]">
                    <b className="text-[#edf2ff]">Original Note:</b> {item.notes}
                  </p>
                )}

                {/* Correction Note input */}
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
                    className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
