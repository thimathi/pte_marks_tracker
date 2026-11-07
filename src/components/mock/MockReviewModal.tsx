import React, { useState } from 'react';
import { X, CheckCircle, Clock, BookOpen, AlertOctagon, Mic, Sparkles } from 'lucide-react';
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
  const [incorrectSummary, setIncorrectSummary] = useState(
    reviewRecord?.incorrectQuestionsSummary || mockExam.mainMistakes || ''
  );
  const [repeatedMistakes, setRepeatedMistakes] = useState(reviewRecord?.repeatedMistakes || '');
  const [vocabIssues, setVocabIssues] = useState(reviewRecord?.vocabularyIssues || '');
  const [grammarIssues, setGrammarIssues] = useState(reviewRecord?.grammarIssues || '');
  const [pronunciationIssues, setPronunciationIssues] = useState(reviewRecord?.pronunciationFluencyIssues || '');
  const [timeIssues, setTimeIssues] = useState(reviewRecord?.timeManagementIssues || '');
  const [correctiveActions, setCorrectiveActions] = useState(reviewRecord?.correctiveActions || '');
  const [repeatQuestions, setRepeatQuestions] = useState(reviewRecord?.questionsToRepeat || '');
  const [reviewNotes, setReviewNotes] = useState(reviewRecord?.reviewNotes || '');

  // Read Aloud (RA) Specific Breakdown State
  const [raQuestionCount, setRaQuestionCount] = useState<number>(reviewRecord?.raQuestionCount || 6);
  const [raScores, setRaScores] = useState<string>(reviewRecord?.raScores || '');
  const [raDeficiencies, setRaDeficiencies] = useState<string>(reviewRecord?.raDeficiencies || '');

  const [isCompleted, setIsCompleted] = useState(reviewRecord?.isCompleted || false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Parse comma-separated RA scores
  const parsedRaScores = raScores
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !isNaN(n));

  const raAverage =
    parsedRaScores.length > 0
      ? Math.round(parsedRaScores.reduce((a, b) => a + b, 0) / parsedRaScores.length)
      : null;

  // Quick tag helper for RA Deficiencies
  const addRaDeficiencyTag = (tag: string) => {
    setRaDeficiencies((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return tag;
      if (trimmed.includes(tag)) return prev;
      return `${trimmed}; ${tag}`;
    });
  };

  // Mandatory review check: Cannot be blank!
  const hasSubstantialNotes =
    (incorrectSummary && incorrectSummary.trim().length >= 5) ||
    (repeatedMistakes && repeatedMistakes.trim().length >= 5) ||
    (correctiveActions && correctiveActions.trim().length >= 5) ||
    (reviewNotes && reviewNotes.trim().length >= 5) ||
    (raDeficiencies && raDeficiencies.trim().length >= 5) ||
    parsedRaScores.length > 0;

  const handleToggleComplete = (checked: boolean) => {
    if (checked && !hasSubstantialNotes) {
      setValidationError('Review cannot be blank! Document your mistakes and corrective action plan before marking as complete.');
      return;
    }
    setValidationError(null);
    setIsCompleted(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompleted && !hasSubstantialNotes) {
      setValidationError('Review cannot be blank! Document your mistakes and corrective action plan before marking as complete.');
      return;
    }

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
      raQuestionCount: Number(raQuestionCount) || 6,
      raScores,
      raAverageScore: raAverage,
      raDeficiencies,
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl w-full my-8 space-y-5 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Mock Exam {mockExam.examNumber} (Day {mockExam.studyDay}) Deep Review
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Minimum 60-Minute Error Analysis, Vocabulary Log & Corrective Action Plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Review Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                Repeated Mistakes
              </label>
              <input
                type="text"
                placeholder="e.g. Pausing on commas in Read Aloud, spelling in WFD"
                value={repeatedMistakes}
                onChange={(e) => setRepeatedMistakes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Read Aloud (RA) Deep Question-by-Question Review Section */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Read Aloud (RA) Detailed Question Breakdown
                </h4>
              </div>
              {raAverage !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  raAverage >= 78
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  RA Avg: {raAverage}/90
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  RA Questions Count:
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={raQuestionCount}
                  onChange={(e) => setRaQuestionCount(Number(e.target.value))}
                  placeholder="e.g. 6 or 7"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Individual RA Question Scores (Separated by Commas):
                </label>
                <input
                  type="text"
                  value={raScores}
                  onChange={(e) => setRaScores(e.target.value)}
                  placeholder="e.g. 78, 82, 65, 88, 70, 75"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono font-medium"
                />
              </div>
            </div>

            {/* Live parsed score pills */}
            {parsedRaScores.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Parsed Scores:</span>
                {parsedRaScores.map((score, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      score >= 78
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : score >= 65
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    Q{i + 1}: {score}
                  </span>
                ))}
              </div>
            )}

            {/* RA Deficiencies / Weaknesses & Adupadu */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  RA Deficiencies, Errors & Weaknesses (අඩුපාඩු):
                </label>
                <span className="text-[10px] text-slate-500">Click tag to insert</span>
              </div>

              {/* Quick tags */}
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                {[
                  'Pausing on commas',
                  'Oral fluency drop',
                  'Pronunciation unclear',
                  'Dropped word endings',
                  'Rushed pacing',
                  'Hesitation & repetition'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addRaDeficiencyTag(tag)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 transition-colors shadow-2xs"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                placeholder="Describe specific weaknesses in RA questions (e.g. Q3 had long pause before commas, skipped ending 's' in 'demonstrates', flat intonation)"
                value={raDeficiencies}
                onChange={(e) => setRaDeficiencies(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Pronunciation & Fluency Issues (Speaking)
              </label>
              <textarea
                placeholder="Document unnatural tone drops, word stress, hesitation"
                value={pronunciationIssues}
                onChange={(e) => setPronunciationIssues(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Vocabulary & Collocation Gaps
              </label>
              <textarea
                placeholder="List unfamiliar words from R/W FIB and Listening"
                value={vocabIssues}
                onChange={(e) => setVocabIssues(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Grammar & Structure Issues
              </label>
              <textarea
                placeholder="Subject-verb agreement, SWT single sentence rule, prepositions"
                value={grammarIssues}
                onChange={(e) => setGrammarIssues(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Time Management & Pacing
              </label>
              <textarea
                placeholder="Did you run out of time in Reading or Listening Section 2?"
                value={timeIssues}
                onChange={(e) => setTimeIssues(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Corrective Actions & Questions to Repeat Immediately
            </label>
            <textarea
              placeholder="e.g. Re-attempt the 3 missed R/W FIB passages; drill 10 WFDs from prediction file"
              value={correctiveActions}
              onChange={(e) => setCorrectiveActions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 min-h-[65px]"
            />
          </div>

          {/* Mandatory Review Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-800">Review Cannot Be Blank</p>
                <p className="text-[11px] text-red-700 mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          {/* Completion Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => handleToggleComplete(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-emerald-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  Mark Review as 100% Completed
                  <span className="text-[10px] text-amber-700 font-normal">(Cannot be blank)</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Required to unlock the next mock exam. Detailed error analysis mandatory.
                </p>
              </div>
            </label>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isCompleted ? 'Completed ✓' : 'Incomplete'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-2 cursor-pointer"
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
