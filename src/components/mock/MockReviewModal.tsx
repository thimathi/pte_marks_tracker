import React, { useState } from 'react';
import { X, CheckCircle, Clock, BookOpen, AlertOctagon } from 'lucide-react';
import { MockExamRecord, MockReviewRecord } from '../../types/pte';

interface MockReviewModalProps {
  mockExam: MockExamRecord;
  reviewRecord: MockReviewRecord | undefined;
  onSave: (data: Partial<MockReviewRecord>) => Promise<void>;
  onClose: () => void;
}

export const MockReviewModal: React.FC<MockReviewModalProps> = ({
  mockExam,
  reviewRecord,
  onSave,
  onClose
}) => {
  const [durationMinutes, setDurationMinutes] = useState(reviewRecord?.durationMinutes || 60);
  const [incorrectSummary, setIncorrectSummary] = useState(reviewRecord?.incorrectQuestionsSummary || '');
  const [repeatedMistakes, setRepeatedMistakes] = useState(reviewRecord?.repeatedMistakes || '');
  const [vocabIssues, setVocabIssues] = useState(reviewRecord?.vocabularyIssues || '');
  const [grammarIssues, setGrammarIssues] = useState(reviewRecord?.grammarIssues || '');
  const [pronunciationIssues, setPronunciationIssues] = useState(reviewRecord?.pronunciationFluencyIssues || '');
  const [timeIssues, setTimeIssues] = useState(reviewRecord?.timeManagementIssues || '');
  const [correctiveActions, setCorrectiveActions] = useState(reviewRecord?.correctiveActions || '');
  const [repeatQuestions, setRepeatQuestions] = useState(reviewRecord?.questionsToRepeat || '');
  const [reviewNotes, setReviewNotes] = useState(reviewRecord?.reviewNotes || '');
  const [isCompleted, setIsCompleted] = useState(reviewRecord?.isCompleted || false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      durationMinutes: Number(durationMinutes) || 60,
      incorrectQuestionsSummary: incorrectSummary,
      repeatedMistakes,
      vocabularyIssues: vocabIssues,
      grammarIssues,
      pronunciationFluencyIssues: pronunciationIssues,
      timeManagementIssues: timeIssues,
      correctiveActions,
      questionsToRepeat: repeatQuestions,
      reviewNotes,
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#141c31] border border-slate-800 rounded-2xl p-6 max-w-2xl w-full my-8 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-[#edf2ff]">
                Mock Exam {mockExam.examNumber} (Day {mockExam.studyDay}) Deep Review
              </h3>
            </div>
            <p className="text-xs text-[#a9b5d0] mt-1">
              Minimum 60-Minute Error Analysis, Vocabulary Log & Corrective Action Plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a9b5d0] hover:text-[#edf2ff] hover:bg-[#19243d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Review Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl px-3 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                Repeated Mistakes
              </label>
              <input
                type="text"
                placeholder="e.g. Pausing on commas in Read Aloud, spelling in WFD"
                value={repeatedMistakes}
                onChange={(e) => setRepeatedMistakes(e.target.value)}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl px-3 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Pronunciation & Fluency Issues (Speaking)
              </label>
              <textarea
                placeholder="Document unnatural tone drops, word stress, hesitation"
                value={pronunciationIssues}
                onChange={(e) => setPronunciationIssues(e.target.value)}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Vocabulary & Collocation Gaps
              </label>
              <textarea
                placeholder="List unfamiliar words from R/W FIB and Listening"
                value={vocabIssues}
                onChange={(e) => setVocabIssues(e.target.value)}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 min-h-[60px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Grammar & Structure Issues
              </label>
              <textarea
                placeholder="Subject-verb agreement, SWT single sentence rule, prepositions"
                value={grammarIssues}
                onChange={(e) => setGrammarIssues(e.target.value)}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Time Management & Pacing
              </label>
              <textarea
                placeholder="Did you run out of time in Reading or Listening Section 2?"
                value={timeIssues}
                onChange={(e) => setTimeIssues(e.target.value)}
                className="w-full bg-[#0e1729] border border-slate-800 rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 min-h-[60px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
              Corrective Actions & Questions to Repeat Immediately
            </label>
            <textarea
              placeholder="e.g. Re-attempt the 3 missed R/W FIB passages; drill 10 WFDs from prediction file"
              value={correctiveActions}
              onChange={(e) => setCorrectiveActions(e.target.value)}
              className="w-full bg-[#0e1729] border border-slate-800 rounded-xl p-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 min-h-[65px]"
            />
          </div>

          {/* Completion Toggle */}
          <div className="p-3.5 rounded-xl bg-[#10192c] border border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-[#edf2ff]">
                  Mark Review as 100% Completed
                </span>
                <p className="text-[11px] text-[#a9b5d0]">
                  Required for Daily Completion Gate requirement #4 / #6.
                </p>
              </div>
            </label>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isCompleted ? 'Completed ✓' : 'Incomplete'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#243553] text-xs font-semibold text-[#edf2ff] hover:bg-[#30476c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Mock Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
