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

          {/* Read Aloud (RA) Deep Question-by-Question Review Section */}
          <div className="p-4 rounded-xl bg-[#0e1729] border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Read Aloud (RA) Detailed Question Breakdown
                </h4>
              </div>
              {raAverage !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  raAverage >= 79
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : raAverage >= 65
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  RA Avg: {raAverage}/90
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  RA Questions Count:
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={raQuestionCount}
                  onChange={(e) => setRaQuestionCount(Number(e.target.value))}
                  placeholder="e.g. 6 or 7"
                  className="w-full bg-[#141c31] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-400 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Individual RA Question Scores (Separated by Commas):
                </label>
                <input
                  type="text"
                  value={raScores}
                  onChange={(e) => setRaScores(e.target.value)}
                  placeholder="e.g. 78, 82, 65, 88, 70, 75"
                  className="w-full bg-[#141c31] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-400 font-mono font-medium"
                />
              </div>
            </div>

            {/* Live parsed score pills */}
            {parsedRaScores.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Parsed Scores:</span>
                {parsedRaScores.map((score, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      score >= 79
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : score >= 65
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-rose-500/20 text-rose-300'
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
                <label className="block text-[11px] font-semibold text-slate-300">
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
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors"
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
                className="w-full bg-[#141c31] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-400 resize-none"
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

          {/* Mandatory Review Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-300">Review Cannot Be Blank</p>
                <p className="text-[11px] text-red-400/90 mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          {/* Completion Toggle */}
          <div className="p-3.5 rounded-xl bg-[#10192c] border border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => handleToggleComplete(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-[#edf2ff] flex items-center gap-1.5">
                  Mark Review as 100% Completed
                  <span className="text-[10px] text-amber-400 font-normal">(Cannot be blank)</span>
                </span>
                <p className="text-[11px] text-[#a9b5d0]">
                  Required to unlock the next mock exam. Detailed error analysis mandatory.
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
