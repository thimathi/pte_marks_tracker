import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Mic,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  Zap
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { MockReviewModal } from '../components/mock/MockReviewModal';
import { MockExamRecord, MockReviewRecord, SectionTestRecord, FirstAttemptEntry } from '../types/pte';
import { formatDateFriendly } from '../utils/dateUtils';
import {
  TOTAL_MOCK_TARGET,
  TOTAL_STUDY_DAYS,
  TOTAL_UNIQUE_PAPERS,
  REPETITIONS_PER_PAPER,
  APEUNI_VIP_MOCKS,
  getMockExamDetails,
  getMockExamsForDay,
  getExamNumberForMock,
  getDayAndSlotForExam,
  getExamNumbersForPaper,
  DAILY_MOCK_SCHEDULE,
  getSectionTestForDay,
  DAY1_FIRST_ATTEMPT_TESTS,
  isReviewDay,
  getReviewDayDefinition
} from '../config/constants';

// ─── First Attempt Entry Card ────────────────────────────────────────────────
interface FirstAttemptCardProps {
  test: (typeof DAY1_FIRST_ATTEMPT_TESTS)[number];
  entry: FirstAttemptEntry | undefined;
  onSave: (testId: string, data: Partial<FirstAttemptEntry>) => Promise<void>;
}

const FirstAttemptEntryCard: React.FC<FirstAttemptCardProps> = ({ test, entry, onSave }) => {
  const [overall, setOverall] = useState<string>(
    entry?.overallScore !== null && entry?.overallScore !== undefined ? String(entry.overallScore) : ''
  );
  const [speaking, setSpeaking] = useState<string>(
    entry?.speakingScore !== null && entry?.speakingScore !== undefined ? String(entry.speakingScore) : ''
  );
  const [writing, setWriting] = useState<string>(
    entry?.writingScore !== null && entry?.writingScore !== undefined ? String(entry.writingScore) : ''
  );
  const [reading, setReading] = useState<string>(
    entry?.readingScore !== null && entry?.readingScore !== undefined ? String(entry.readingScore) : ''
  );
  const [listening, setListening] = useState<string>(
    entry?.listeningScore !== null && entry?.listeningScore !== undefined ? String(entry.listeningScore) : ''
  );
  const [notes, setNotes] = useState<string>(entry?.notes || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setOverall(entry?.overallScore !== null && entry?.overallScore !== undefined ? String(entry.overallScore) : '');
    setSpeaking(entry?.speakingScore !== null && entry?.speakingScore !== undefined ? String(entry.speakingScore) : '');
    setWriting(entry?.writingScore !== null && entry?.writingScore !== undefined ? String(entry.writingScore) : '');
    setReading(entry?.readingScore !== null && entry?.readingScore !== undefined ? String(entry.readingScore) : '');
    setListening(entry?.listeningScore !== null && entry?.listeningScore !== undefined ? String(entry.listeningScore) : '');
    setNotes(entry?.notes || '');
    setSaveStatus('idle');
  }, [entry?.overallScore, entry?.speakingScore, entry?.writingScore, entry?.readingScore, entry?.listeningScore, entry?.notes]);

  const parseScore = (val: string) => {
    const t = val.trim();
    if (t === '') return null;
    const n = Number(t);
    return isNaN(n) ? null : Math.min(Math.max(0, n), 90);
  };

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    const finalOverall = parseScore(overall);
    const payload: Partial<FirstAttemptEntry> = {
      testId: test.id,
      testName: test.testName,
      testType: test.testType,
      overallScore: finalOverall,
      speakingScore: parseScore(speaking),
      writingScore: parseScore(writing),
      readingScore: parseScore(reading),
      listeningScore: parseScore(listening),
      notes,
      isCompleted: finalOverall !== null && finalOverall > 0,
      completedAt: finalOverall !== null && finalOverall > 0 ? new Date().toISOString() : undefined
    };
    await onSave(test.id, payload);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus((p) => (p === 'saved' ? 'idle' : p)), 2500);
  }, [test, overall, speaking, writing, reading, listening, notes, onSave]);

  const isVip = test.testType === 'vip';
  const isCompleted = entry?.isCompleted;

  return (
    <div className={`rounded-xl border p-3.5 space-y-3 transition-colors ${
      isCompleted
        ? 'bg-emerald-950/30 border-emerald-500/30'
        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
    }`}>
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
            isVip
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
          }`}>
            {isVip ? '👑 VIP Test' : '🆓 Free Test'}
          </span>
          <span className="text-[10px] text-amber-300 font-medium">{test.timeSlot}</span>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">{test.sessionLabel}</p>
          <h4 className="text-xs font-bold text-white leading-snug mt-0.5 line-clamp-2" title={test.testName}>
            {test.testName}
          </h4>
        </div>
        {!isVip && (
          <div className="text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1">
            ⚠️ Free test — VIP subscription required to view official scores
          </div>
        )}
        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded border ${
          isCompleted
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {isCompleted ? '✓ Logged' : 'Pending'}
        </span>
      </div>

      {/* Overall Score */}
      <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800">
        <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center gap-1">
          <Award className="w-3 h-3 text-blue-400" /> Overall /90
        </label>
        <input
          type="number" min="0" max="90" placeholder="0–90"
          value={overall}
          onChange={(e) => { setOverall(e.target.value); setSaveStatus('dirty'); }}
          onBlur={handleSave}
          className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded py-1.5 px-2 text-base font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
        />
      </div>

      {/* Section Scores */}
      <div className="grid grid-cols-2 gap-1.5">
        {([
          { label: 'Speaking', val: speaking, set: setSpeaking, color: 'text-blue-300' },
          { label: 'Writing', val: writing, set: setWriting, color: 'text-purple-300' },
          { label: 'Reading', val: reading, set: setReading, color: 'text-emerald-300' },
          { label: 'Listening', val: listening, set: setListening, color: 'text-amber-300' }
        ] as const).map(({ label, val, set, color }) => (
          <div key={label} className="bg-slate-950/60 rounded p-1.5 border border-slate-800">
            <div className="flex items-center justify-between mb-0.5">
              <label className={`text-[10px] font-semibold ${color}`}>{label}</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number" min="0" max="90" placeholder="—"
              value={val}
              onChange={(e) => { set(e.target.value); setSaveStatus('dirty'); }}
              onBlur={handleSave}
              className="w-full bg-slate-900 border border-slate-700/80 rounded py-0.5 px-1.5 text-xs font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Notes */}
      <textarea
        rows={2}
        placeholder="Observations, weak areas..."
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaveStatus('dirty'); }}
        onBlur={handleSave}
        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-slate-600 placeholder-slate-600 resize-none"
      />

      {/* Save status */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <div className="text-[10px] text-slate-500">Auto-saves on blur</div>
        {saveStatus === 'dirty' ? (
          <button onClick={handleSave} className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer">Save</button>
        ) : saveStatus === 'saving' ? (
          <span className="text-[10px] text-amber-400">Saving...</span>
        ) : saveStatus === 'saved' ? (
          <span className="text-[10px] text-emerald-400 font-medium">✓ Saved</span>
        ) : null}
      </div>
    </div>
  );
};

// ─── Day 1 First Attempt Baseline Section ────────────────────────────────────
interface FirstAttemptSectionProps {
  firstAttempt: Record<string, FirstAttemptEntry> | undefined;
  onSave: (testId: string, data: Partial<FirstAttemptEntry>) => Promise<void>;
}

const FirstAttemptSection: React.FC<FirstAttemptSectionProps> = ({ firstAttempt, onSave }) => {
  const completedCount = DAY1_FIRST_ATTEMPT_TESTS.filter(t => firstAttempt?.[t.id]?.isCompleted).length;
  const allDone = completedCount === DAY1_FIRST_ATTEMPT_TESTS.length;

  const scores = DAY1_FIRST_ATTEMPT_TESTS
    .map(t => firstAttempt?.[t.id]?.overallScore)
    .filter((s): s is number => s !== null && s !== undefined);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${
      allDone
        ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-emerald-950/40 border-emerald-500/40'
        : 'bg-gradient-to-r from-[#1a1030] via-[#101830] to-[#101830] border-purple-500/30'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                Day 1 · First Attempt Baseline
              </span>
              <span className="text-[10px] text-slate-400">Nov 03, 2026</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Pre-Plan Diagnostic — 4 APEUni Mock Tests
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Initial baseline scores before the 80-Mock Mastery Mission begins. These results track your true starting point and are stored separately from the main mock schedule.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
            allDone
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {completedCount} / {DAY1_FIRST_ATTEMPT_TESTS.length} Logged
          </span>
          {avgScore !== null && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Avg: {avgScore}/90
            </span>
          )}
        </div>
      </div>

      {/* 4 Test Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DAY1_FIRST_ATTEMPT_TESTS.map((test) => (
          <FirstAttemptEntryCard
            key={test.id}
            test={test}
            entry={firstAttempt?.[test.id]}
            onSave={onSave}
          />
        ))}
      </div>

      {/* Summary strip */}
      {scores.length > 0 && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DAY1_FIRST_ATTEMPT_TESTS.map((test) => {
            const e = firstAttempt?.[test.id];
            const hasScore = e?.overallScore !== null && e?.overallScore !== undefined;
            return (
              <div key={test.id} className="text-center">
                <p className="text-[10px] text-slate-400 truncate font-medium" title={test.shortName}>{test.shortName}</p>
                <p className={`text-sm font-bold mt-0.5 ${
                  hasScore && e!.overallScore! >= 65 ? 'text-emerald-300'
                  : hasScore ? 'text-amber-300'
                  : 'text-slate-500'
                }`}>
                  {hasScore ? `${e!.overallScore}/90` : '—'}
                </p>
                {hasScore && (
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    S:{e?.speakingScore ?? '—'} W:{e?.writingScore ?? '—'} R:{e?.readingScore ?? '—'} L:{e?.listeningScore ?? '—'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {allDone && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><b>All 4 baseline tests logged!</b> Scroll down to begin your first scheduled mock exams for the 80-Mock Mission.</span>
        </div>
      )}
    </div>
  );
};

interface MockCardProps {
  mockKey: string;
  idx: number;
  totalMocksToday: number;
  currentDay: number;
  mock: MockExamRecord | undefined;
  rev: MockReviewRecord | undefined;
  isLocked?: boolean;
  onSaveMock: (mockId: string, payload: Partial<MockExamRecord>) => Promise<void>;
  onOpenReview: () => void;
}

const MockExamCard: React.FC<MockCardProps> = ({
  mockKey,
  idx,
  totalMocksToday,
  currentDay,
  mock,
  rev,
  isLocked = false,
  onSaveMock,
  onOpenReview
}) => {
  const examNumber = getExamNumberForMock(currentDay, idx);
  const examDetails = getMockExamDetails(examNumber);
  const schedule = DAILY_MOCK_SCHEDULE[idx];
  const [bypassedLock, setBypassedLock] = useState(false);
  const effectivelyLocked = isLocked && !bypassedLock;

  // Local state for smooth typing
  const [overall, setOverall] = useState<string>(
    mock?.overallScore !== null && mock?.overallScore !== undefined ? String(mock.overallScore) : ''
  );
  const [speaking, setSpeaking] = useState<string>(
    mock?.speakingScore !== null && mock?.speakingScore !== undefined ? String(mock.speakingScore) : ''
  );
  const [writing, setWriting] = useState<string>(
    mock?.writingScore !== null && mock?.writingScore !== undefined ? String(mock.writingScore) : ''
  );
  const [reading, setReading] = useState<string>(
    mock?.readingScore !== null && mock?.readingScore !== undefined ? String(mock.readingScore) : ''
  );
  const [listening, setListening] = useState<string>(
    mock?.listeningScore !== null && mock?.listeningScore !== undefined ? String(mock.listeningScore) : ''
  );
  const [questions, setQuestions] = useState<string>(
    mock?.questionsAttempted !== null && mock?.questionsAttempted !== undefined
      ? String(mock.questionsAttempted)
      : '60'
  );
  const [mistakes, setMistakes] = useState<string>(mock?.mainMistakes || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setOverall(
      mock?.overallScore !== null && mock?.overallScore !== undefined ? String(mock.overallScore) : ''
    );
    setSpeaking(
      mock?.speakingScore !== null && mock?.speakingScore !== undefined ? String(mock.speakingScore) : ''
    );
    setWriting(
      mock?.writingScore !== null && mock?.writingScore !== undefined ? String(mock.writingScore) : ''
    );
    setReading(
      mock?.readingScore !== null && mock?.readingScore !== undefined ? String(mock.readingScore) : ''
    );
    setListening(
      mock?.listeningScore !== null && mock?.listeningScore !== undefined ? String(mock.listeningScore) : ''
    );
    setQuestions(
      mock?.questionsAttempted !== null && mock?.questionsAttempted !== undefined
        ? String(mock.questionsAttempted)
        : '60'
    );
    setMistakes(mock?.mainMistakes || '');
    setSaveStatus('idle');
  }, [
    currentDay,
    mockKey,
    mock?.overallScore,
    mock?.speakingScore,
    mock?.writingScore,
    mock?.readingScore,
    mock?.listeningScore,
    mock?.questionsAttempted,
    mock?.mainMistakes
  ]);

  const saveScores = useCallback(
    async (explicitOverrides?: Partial<MockExamRecord>) => {
      setSaveStatus('saving');
      const parseNumber = (val: string) => {
        const trimmed = val.trim();
        if (trimmed === '') return null;
        const num = Number(trimmed);
        return isNaN(num) ? null : Math.min(Math.max(0, num), 90);
      };

      const finalOverall =
        explicitOverrides?.overallScore !== undefined
          ? explicitOverrides.overallScore
          : parseNumber(overall);
      const finalSpeaking =
        explicitOverrides?.speakingScore !== undefined
          ? explicitOverrides.speakingScore
          : parseNumber(speaking);
      const finalWriting =
        explicitOverrides?.writingScore !== undefined
          ? explicitOverrides.writingScore
          : parseNumber(writing);
      const finalReading =
        explicitOverrides?.readingScore !== undefined
          ? explicitOverrides.readingScore
          : parseNumber(reading);
      const finalListening =
        explicitOverrides?.listeningScore !== undefined
          ? explicitOverrides.listeningScore
          : parseNumber(listening);
      const finalQuestions =
        explicitOverrides?.questionsAttempted !== undefined
          ? explicitOverrides.questionsAttempted
          : questions.trim() === ''
          ? 60
          : Number(questions);
      const finalMistakes =
        explicitOverrides?.mainMistakes !== undefined ? explicitOverrides.mainMistakes : mistakes;

      const payload: Partial<MockExamRecord> = {
        overallScore: finalOverall,
        speakingScore: finalSpeaking,
        writingScore: finalWriting,
        readingScore: finalReading,
        listeningScore: finalListening,
        questionsAttempted: finalQuestions,
        mainMistakes: finalMistakes,
        isCompleted: finalOverall !== null && finalOverall > 0,
        ...explicitOverrides
      };

      await onSaveMock(mockKey, payload);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2500);
    },
    [mockKey, overall, speaking, writing, reading, listening, questions, mistakes, onSaveMock]
  );

  return (
    <div className="rounded-2xl bg-[#151d2e] border border-slate-800 p-4 space-y-3.5 flex flex-col justify-between transition-colors hover:border-slate-700 shadow-2xs text-slate-200">
      {/* Top Header */}
      <div className="space-y-2 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60">
            Pass {examDetails.roundNumber} · Attempt {examDetails.attemptOfPaper}/4
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${examDetails.roundBadgeColor}`}>
            Paper #{examDetails.paperNumber}
          </span>
        </div>

        {schedule && (
          <div className="px-2 py-1 rounded-lg bg-[#0d131f] border border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{schedule.timeSlot}</span>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2">
            Mock #{examNumber}: {examDetails.testName}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {schedule?.sessionName || examDetails.roundTitle}
          </p>
        </div>

        {effectivelyLocked && (
          <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/60 text-[11px] text-amber-200 flex items-center justify-between gap-1.5">
            <span>🔒 Locked: Complete Mock #{examNumber - 1} & Review first.</span>
            <button
              type="button"
              onClick={() => setBypassedLock(true)}
              className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 font-semibold shrink-0 cursor-pointer"
            >
              Catch Up / Unlock
            </button>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              mock?.isCompleted && rev?.isCompleted
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : mock?.isCompleted
                ? 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {mock?.isCompleted && rev?.isCompleted
              ? 'Complete & Reviewed ✓'
              : mock?.isCompleted
              ? 'Review Pending ⚠️'
              : 'Exam Pending'}
          </span>

          {examDetails.testName.includes('Free Full Test') && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800 font-medium">
              Free Test · VIP scoring
            </span>
          )}

          {examNumber === 4 && !mock?.isCompleted && (
            <button
              type="button"
              onClick={() => {
                setOverall('59');
                setSpeaking('72');
                setWriting('61');
                setReading('40');
                setListening('64');
                setQuestions('60');
                setMistakes('Baseline Diagnostic (APEUni VIP Mock Test 45C)');
                saveScores({
                  overallScore: 59,
                  speakingScore: 72,
                  writingScore: 61,
                  readingScore: 40,
                  listeningScore: 64,
                  questionsAttempted: 60,
                  mainMistakes: 'Baseline Diagnostic (APEUni VIP Mock Test 45C)',
                  isCompleted: true
                });
              }}
              className="py-0.5 px-2 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800 text-[10px] font-semibold transition-colors cursor-pointer"
            >
              ⚡ Load 45C Baseline (59/90)
            </button>
          )}
        </div>
      </div>

      {/* Primary Score Input: Overall Score / 90 */}
      <div className="bg-[#0d131f] rounded-xl p-2.5 border border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            Overall Score / 90:
          </label>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              Number(overall) >= 78
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : Number(overall) >= 65
                ? 'bg-blue-950 text-blue-300 border-blue-800'
                : Number(overall) > 0
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'text-slate-500 border-transparent'
            }`}
          >
            {Number(overall) >= 78
              ? 'Target Met (78+)'
              : Number(overall) >= 65
              ? 'Proficient (65+)'
              : Number(overall) > 0
              ? 'Score < 65'
              : 'Not Scored'}
          </span>
        </div>
        <input
          type="number"
          min="0"
          max="90"
          placeholder="0–90"
          value={overall}
          onChange={(e) => {
            setOverall(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-full bg-[#151d2e] border border-slate-700 focus:border-blue-500 rounded-lg py-2 px-3 text-lg font-extrabold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* 4 Communicative Skills (2x2 Grid) */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Section Scores (/90)
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Speaking */}
          <div className="bg-[#0d131f] rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-blue-400">Speaking</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={speaking}
              onChange={(e) => {
                setSpeaking(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-blue-500 rounded py-1 px-2 text-xs font-bold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Writing */}
          <div className="bg-[#0d131f] rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-purple-400">Writing</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={writing}
              onChange={(e) => {
                setWriting(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-purple-500 rounded py-1 px-2 text-xs font-bold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Reading */}
          <div className="bg-[#0d131f] rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-emerald-400">Reading</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={reading}
              onChange={(e) => {
                setReading(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-emerald-500 rounded py-1 px-2 text-xs font-bold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Listening */}
          <div className="bg-[#0d131f] rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-amber-400">Listening</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={listening}
              onChange={(e) => {
                setListening(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-amber-500 rounded py-1 px-2 text-xs font-bold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Read Aloud (RA) Summary Snapshot if Reviewed */}
      {rev?.raScores && (
        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-blue-400" />
              Read Aloud (RA) Breakdown:
            </span>
            {rev.raAverageScore !== undefined && rev.raAverageScore !== null && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Avg: {rev.raAverageScore}/90
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-300 font-mono">
            Scores: [{rev.raScores}]
          </div>
          {rev.raDeficiencies && (
            <div className="text-[10px] text-amber-300 truncate italic font-medium">
              Deficiencies: {rev.raDeficiencies}
            </div>
          )}
        </div>
      )}

      {/* Questions Attempted */}
      <div className="flex items-center justify-between bg-[#0d131f] rounded-lg px-2.5 py-1.5 border border-slate-800">
        <label className="text-xs text-slate-400 font-medium">Questions Done:</label>
        <input
          type="number"
          value={questions}
          onChange={(e) => {
            setQuestions(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-14 bg-[#151d2e] border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-100 text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
        />
      </div>

      {/* Main Mistakes & Observations */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Mistakes & Notes:
        </label>
        <textarea
          rows={2}
          placeholder="R/W FIB collocations, oral fluency, WFD spellings..."
          value={mistakes}
          onChange={(e) => {
            setMistakes(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-full bg-[#0d131f] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-500 resize-none"
        />
      </div>

      {/* Bottom Actions: Save status & Review Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{rev?.durationMinutes || 0}m</span>
          {saveStatus === 'dirty' ? (
            <button
              type="button"
              onClick={() => saveScores()}
              className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
            >
              Save
            </button>
          ) : saveStatus === 'saving' ? (
            <span className="text-[10px] text-amber-600 font-medium">Saving...</span>
          ) : saveStatus === 'saved' ? (
            <span className="text-[10px] text-emerald-700 font-medium">✓ Saved</span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onOpenReview}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            rev?.isCompleted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : mock?.isCompleted
              ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-sm'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{rev?.isCompleted ? 'Edit Review ✓' : 'Start Review (RA & Errors)'}</span>
        </button>
      </div>
    </div>
  );
};

export const MockExamsPage: React.FC = () => {
  const {
    currentDay,
    currentDayData,
    days,
    studyPlan,
    updateMockExam,
    updateMockReview,
    updateSectionTest,
    selectDay,
    updateFirstAttempt
  } = usePteData();
  const totalDays = studyPlan?.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = TOTAL_MOCK_TARGET;

  const [activeReviewModal, setActiveReviewModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const [isCatchUpExpanded, setIsCatchUpExpanded] = useState<boolean>(false);

  const isRevDay = isReviewDay(currentDay);
  const revDayDef = getReviewDayDefinition(currentDay);
  const mockKeys = getMockExamsForDay(currentDay);
  const sectionTestDef = getSectionTestForDay(currentDay);
  const currentSectionTest = currentDayData?.sectionTest;

  const handleSaveMock = useCallback(
    async (mockId: string, payload: Partial<MockExamRecord>) => {
      await updateMockExam(currentDay, mockId, payload);
    },
    [currentDay, updateMockExam]
  );

  // Section Test Local State for Current Day
  const [secScore, setSecScore] = useState<string>(
    currentSectionTest?.score !== null && currentSectionTest?.score !== undefined
      ? String(currentSectionTest.score)
      : ''
  );
  const [secMistakes, setSecMistakes] = useState<string>(currentSectionTest?.mainMistakes || '');
  const [secQuestions, setSecQuestions] = useState<string>(
    currentSectionTest?.questionsAttempted !== undefined && currentSectionTest?.questionsAttempted !== null
      ? String(currentSectionTest.questionsAttempted)
      : String(sectionTestDef?.targetQuestions || 25)
  );

  useEffect(() => {
    setSecScore(
      currentSectionTest?.score !== null && currentSectionTest?.score !== undefined
        ? String(currentSectionTest.score)
        : ''
    );
    setSecMistakes(currentSectionTest?.mainMistakes || '');
    setSecQuestions(
      currentSectionTest?.questionsAttempted !== undefined && currentSectionTest?.questionsAttempted !== null
        ? String(currentSectionTest.questionsAttempted)
        : String(sectionTestDef?.targetQuestions || 25)
    );
  }, [currentDay, currentSectionTest?.score, currentSectionTest?.mainMistakes, currentSectionTest?.questionsAttempted, sectionTestDef?.targetQuestions]);

  const handleSaveSectionTest = async (overrideCompleted?: boolean) => {
    const scoreNum = secScore.trim() === '' ? null : Number(secScore);
    const isDone = overrideCompleted !== undefined ? overrideCompleted : (scoreNum !== null && scoreNum > 0);
    await updateSectionTest(currentDay, {
      score: scoreNum,
      questionsAttempted: Number(secQuestions) || sectionTestDef?.targetQuestions || 25,
      mainMistakes: secMistakes,
      isCompleted: isDone,
      completedAt: isDone ? new Date().toISOString() : undefined
    });
  };

  // Build the complete list of all 80 planned mock exams across 28 days
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

  const [selectedRoundFilter, setSelectedRoundFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  // Overall statistics across all 80 mock exams
  let completedCountAll80 = 0;
  let reviewedCountAll80 = 0;
  let totalScoreSum = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dRec = days[d];
    const dMocks = getMockExamsForDay(d);
    dMocks.forEach((mId, idx) => {
      const mRec = dRec?.mockExams?.[mId];
      const rRec = dRec?.mockReviews?.[`review0${idx + 1}`];
      if (mRec?.isCompleted) {
        completedCountAll80++;
        if (mRec.overallScore) totalScoreSum += mRec.overallScore;
      }
      if (rRec?.isCompleted) {
        reviewedCountAll80++;
      }
    });
  }

  const avgOverallScore = completedCountAll80 > 0 ? Math.round(totalScoreSum / completedCountAll80) : null;

  // Detect any missed / pending mock exams up to currentDay
  const missedMocks: {
    examNumber: number;
    dayNumber: number;
    mockId: string;
    reviewId: string;
    mockRec: MockExamRecord | undefined;
    revRec: MockReviewRecord | undefined;
  }[] = [];

  for (let d = 1; d <= currentDay; d++) {
    const dRec = days[d];
    const dMocks = getMockExamsForDay(d);
    dMocks.forEach((mId, idx) => {
      const examNum = getExamNumberForMock(d, idx);
      const mRec = dRec?.mockExams?.[mId];
      const rRec = dRec?.mockReviews?.[`review0${idx + 1}`];
      if (!mRec?.isCompleted || !rRec?.isCompleted) {
        missedMocks.push({
          examNumber: examNum,
          dayNumber: d,
          mockId: mId,
          reviewId: `review0${idx + 1}`,
          mockRec: mRec,
          revRec: rRec
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#151d2e] border border-slate-800 p-5 sm:p-6 shadow-sm text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-extrabold text-slate-100">
              PTE Exam Mastery Mission (Nov 04 – Dec 10, 2026)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            20 Unique VIP Papers · 2 Mocks + 1 Section Test / Day · Tailored for Speaking 87 &amp; Writing 84 Summit.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-blue-950/60 text-blue-300 border border-blue-800/60 font-bold">
            Study Day {currentDay} of {totalDays}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold">
            {completedCountAll80} / 60 Done ({Math.round((completedCountAll80 / 60) * 100)}%)
          </span>
          {avgOverallScore !== null && (
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/60 font-bold">
              Avg: {avgOverallScore}/90
            </span>
          )}
        </div>
      </div>

      {/* Day 1 First Attempt Baseline Section */}
      {currentDay === 1 && (
        <FirstAttemptSection
          firstAttempt={currentDayData?.firstAttempt}
          onSave={updateFirstAttempt}
        />
      )}

      {/* Missed / Flexible Catch-Up Support Banner */}
      {missedMocks.length > 0 ? (
        <div className="rounded-2xl bg-amber-950/30 border border-amber-800/60 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-amber-200">
                  Catch-Up & Missed Mock Buffer: {missedMocks.length} Session{missedMocks.length > 1 ? 's' : ''} Pending
                </h3>
                <p className="text-[11px] text-amber-300/80">
                  Life happens! If you missed a 2-hour slot, don't worry. You can catch up anytime here or on the buffer days without falling behind.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCatchUpExpanded((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
            >
              <span>{isCatchUpExpanded ? 'Hide Missed Mocks' : `View ${missedMocks.length} Missed Mocks`}</span>
              {isCatchUpExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable list of missed mocks */}
          {isCatchUpExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-amber-800/60">
              {missedMocks.map((m) => {
                const details = getMockExamDetails(m.examNumber);
                return (
                  <div
                    key={m.examNumber}
                    className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 flex flex-col justify-between gap-2 shadow-2xs text-slate-200"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Day {m.dayNumber}</span>
                        <span className="text-amber-400 font-bold">{details.timeSlot}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 truncate mt-0.5">
                        Mock #{m.examNumber}: {details.testName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {!m.mockRec?.isCompleted ? 'Exam Not Logged' : 'Review Incomplete'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => selectDay(m.dayNumber)}
                        className="w-full py-1 rounded bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 text-[10px] font-semibold text-center border border-blue-800 cursor-pointer"
                      >
                        Catch Up on Day {m.dayNumber} ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/60 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-300 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><b>All caught up!</b> No missed mock sessions or pending reviews through Day {currentDay}.</span>
        </div>
      )}

      {/* Daily Assigned Section Test Card */}
      <div className="rounded-2xl bg-[#151d2e] border border-slate-800 p-5 space-y-4 shadow-sm text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                  Day {currentDay} Section Test
                </span>
                {sectionTestDef ? (
                  <span className="text-xs text-slate-400">
                    Recommended: {sectionTestDef.recommendedSlot} ({sectionTestDef.estMinutes})
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">
                    Weekly Buffer & Error Review Day
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">
                {sectionTestDef ? sectionTestDef.title : 'Day 7 / 14: Rest & Error Deep-Dive Buffer'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                currentSectionTest?.isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {currentSectionTest?.isCompleted ? 'Completed ✓' : 'Pending'}
            </span>
          </div>
        </div>

        {sectionTestDef ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 space-y-1">
              <p className="text-xs text-slate-300 leading-relaxed">
                {sectionTestDef.description}
              </p>
              <p className="text-[11px] text-slate-400">
                Target: <b className="text-slate-200">{sectionTestDef.targetQuestions} Questions</b> · Focus on speed, accuracy, and minimum errors.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Score (/90):
              </label>
              <input
                type="number"
                min="0"
                max="90"
                placeholder="Score / 90"
                value={secScore}
                onChange={(e) => setSecScore(e.target.value)}
                onBlur={() => handleSaveSectionTest()}
                className="w-full bg-[#0d131f] border border-slate-700 rounded-lg py-1.5 px-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-blue-500 text-center"
              />
            </div>

            <div className="flex items-center gap-2 pt-4 md:pt-0">
              <button
                type="button"
                onClick={() => handleSaveSectionTest(!currentSectionTest?.isCompleted)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  currentSectionTest?.isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentSectionTest?.isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
              </button>
            </div>

            <div className="md:col-span-4 pt-1">
              <input
                type="text"
                placeholder="Section test notes / key errors (e.g. lost 2 marks on R/W FIB collocations, SST word count 65 words)..."
                value={secMistakes}
                onChange={(e) => setSecMistakes(e.target.value)}
                onBlur={() => handleSaveSectionTest()}
                className="w-full bg-[#0d131f] border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 leading-relaxed">
            No mandatory section test scheduled for Day {currentDay}. Use this dedicated buffer to review all Read Aloud & mock exam mistakes from the past 6 days, or catch up on any missed mock simulations.
          </div>
        )}
      </div>

      {/* Active Day's Mock Exam Cards or Dedicated Review Day Hub */}
      {isRevDay && revDayDef ? (
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/40 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wide">
                  Dedicated Deep Review Day
                </span>
                <span className="text-xs text-slate-400">
                  Focus: Question-by-Question Error Analysis (1–2 hrs/mock)
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {revDayDef.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Take dedicated time today to review every mistake from Days {revDayDef.coveredDays.join(' & ')} ({revDayDef.examNumbers.length} tests). Listen to your Read Aloud recordings, check where fluency broke down, and record comma-separated scores and deficiencies (අඩුපාඩු).
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cycle Progress</span>
              <span className="text-base font-extrabold text-emerald-400">
                {revDayDef.examNumbers.filter((eNum) => {
                  const { dayNumber, reviewKey } = getDayAndSlotForExam(eNum);
                  return !!days[dayNumber]?.mockReviews?.[reviewKey]?.isCompleted;
                }).length} / {revDayDef.examNumbers.length} Reviewed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {revDayDef.examNumbers.map((examNumber) => {
              const { dayNumber, mockKey, reviewKey } = getDayAndSlotForExam(examNumber);
              const dayRec = days[dayNumber];
              const mock = dayRec?.mockExams?.[mockKey];
              const rev = dayRec?.mockReviews?.[reviewKey];
              const details = getMockExamDetails(examNumber);
              const fallbackMock: MockExamRecord = mock || {
                id: mockKey,
                examNumber,
                testName: details.testName,
                studyDay: dayNumber,
                isCompleted: false
              };

              return (
                <div
                  key={`rev-hub-${examNumber}`}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                    rev?.isCompleted
                      ? 'bg-slate-950/80 border-emerald-500/30'
                      : mock?.isCompleted
                      ? 'bg-slate-950 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 font-mono">
                        Mock #{examNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        Day {dayNumber}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1" title={details.testName}>
                      {details.testName}
                    </h4>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Score:</span>
                      <span className="font-bold text-white">
                        {mock?.overallScore !== null && mock?.overallScore !== undefined ? `${mock.overallScore} / 90` : 'Not Scored'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">RA Average:</span>
                      <span className={rev?.raAverageScore ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {rev?.raAverageScore ? `${rev.raAverageScore} / 90` : '—'}
                      </span>
                    </div>

                    {rev?.raDeficiencies && (
                      <p className="text-[11px] text-amber-200/80 bg-slate-900 p-2 rounded-lg border border-slate-800 line-clamp-2">
                        {rev.raDeficiencies}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveReviewModal({
                        mock: fallbackMock,
                        review: rev
                      })
                    }
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      rev?.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{rev?.isCompleted ? 'Edit RA & Review' : 'Log Deep Review'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Day's Mock Exam Cards (when not a review day) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Today's Scheduled Mock Exams ({mockKeys.length} Timed Simulations Daily)
            </h2>
            <span className="text-xs text-blue-400 font-medium">Study Day {currentDay} of {totalDays}</span>
          </div>

          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {mockKeys.map((key, idx) => {
              const mock = currentDayData?.mockExams?.[key];
              const reviewId = `review0${idx + 1}`;
              const rev = currentDayData?.mockReviews?.[reviewId];
              const examNumber = getExamNumberForMock(currentDay, idx);
              const fallbackMock: MockExamRecord = mock || {
                id: key,
                examNumber,
                testName: getMockExamDetails(examNumber).testName,
                studyDay: currentDay,
                isCompleted: false
              };

              // Non-blocking sequential lock with easy catch up
              const isLocked = idx > 0 && (() => {
                const prevKey = mockKeys[idx - 1];
                const prevMock = currentDayData?.mockExams?.[prevKey];
                const prevRev = currentDayData?.mockReviews?.[`review0${idx}`];
                return !(prevMock?.isCompleted && prevRev?.isCompleted);
              })();

              return (
                <MockExamCard
                  key={`${currentDay}-${key}`}
                  mockKey={key}
                  idx={idx}
                  totalMocksToday={mockKeys.length}
                  currentDay={currentDay}
                  mock={mock}
                  rev={rev}
                  isLocked={isLocked}
                  onSaveMock={handleSaveMock}
                  onOpenReview={() =>
                    setActiveReviewModal({
                      mock: fallbackMock,
                      review: rev
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 20 Unique Papers × 3 Passes Progression Matrix */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              20 VIP Papers × 3 Passes Mastery Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Compare all 3 attempts of each paper side-by-side to track elevation to 79+ Superior
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {APEUNI_VIP_MOCKS.slice(0, 20).map((paperTitle, pIdx) => {
            const paperNum = pIdx + 1;
            const examNumbers = getExamNumbersForPaper(pIdx);

            const attempts = examNumbers.map((eNum, attIdx) => {
              const { dayNumber, mockKey, reviewKey } = getDayAndSlotForExam(eNum);
              const dayRec = days[dayNumber];
              const mockRec = dayRec?.mockExams?.[mockKey];
              const revRec = dayRec?.mockReviews?.[reviewKey];
              return {
                pass: attIdx + 1,
                examNumber: eNum,
                dayNumber,
                mockRec,
                revRec,
                isCompleted: !!mockRec?.isCompleted,
                overallScore: mockRec?.overallScore,
                speaking: mockRec?.speakingScore,
                writing: mockRec?.writingScore,
                reading: mockRec?.readingScore,
                listening: mockRec?.listeningScore,
                raAvg: revRec?.raAverageScore,
                isReviewed: !!revRec?.isCompleted
              };
            });

            const completedAttempts = attempts.filter((a) => a.isCompleted && a.overallScore !== null && a.overallScore !== undefined);
            const firstScore = completedAttempts[0]?.overallScore ?? null;
            const latestScore = completedAttempts[completedAttempts.length - 1]?.overallScore ?? null;
            const delta = firstScore !== null && latestScore !== null && completedAttempts.length > 1 ? latestScore - firstScore : null;

            return (
              <div
                key={`paper-matrix-${pIdx}`}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      Paper #{paperNum}
                    </span>
                    {delta !== null && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        delta >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {delta >= 0 ? `+${delta} pts` : `${delta} pts`} Gain
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate" title={paperTitle}>
                    {paperTitle}
                  </h4>
                </div>

                {/* 4 Attempts Side-by-Side */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                  {attempts.map((att) => {
                    const passColors = [
                      'border-blue-500/30 bg-blue-950/30 text-blue-300',
                      'border-purple-500/30 bg-purple-950/30 text-purple-300',
                      'border-amber-500/30 bg-amber-950/30 text-amber-300',
                      'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                    ];
                    return (
                      <div
                        key={`att-${att.examNumber}`}
                        onClick={() => selectDay(att.dayNumber)}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                          att.isCompleted
                            ? `${passColors[att.pass - 1]} hover:border-blue-400`
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                        title={`Click to select Day ${att.dayNumber} for Mock #${att.examNumber}`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold">{att.pass === 1 ? '1st Attempt' : `Pass ${att.pass}`}</span>
                          <span className="font-mono text-slate-400">Mock #{att.examNumber}</span>
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-xs font-bold text-white">
                            {att.isCompleted ? `${att.overallScore}/90` : '—'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {att.raAvg ? `RA: ${att.raAvg}` : att.isReviewed ? 'Rev ✓' : att.isCompleted ? 'Unrev' : `Day ${att.dayNumber}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Exams Complete Progression Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              All {totalMocks} Planned Mock Exams Master Register
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            20 Unique Papers × 3 Passes (Nov 04 – Dec 10 · 3,600+ Questions)
          </span>
        </div>

        {/* Filter by Pass / Round */}
        <div className="flex items-center gap-2 flex-wrap border-b border-slate-800 pb-3">
          <span className="text-xs text-slate-400 mr-2">Filter Pass:</span>
          {(['all', '1', '2', '3', '4'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoundFilter(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRoundFilter === r
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {r === 'all'
                ? 'All 80 Mocks'
                : r === '1'
                ? 'Pass 1 (First Attempt) (1–20)'
                : `Pass ${r} (${(Number(r) - 1) * 20 + 1}–${Number(r) * 20})`}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Exam #</th>
                <th className="py-2.5 px-3">APEUni Test Name</th>
                <th className="py-2.5 px-3">Pass / Attempt</th>
                <th className="py-2.5 px-3">Study Day</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Time Slot</th>
                <th className="py-2.5 px-3">Overall / 90</th>
                <th className="py-2.5 px-3">Speaking</th>
                <th className="py-2.5 px-3">Writing</th>
                <th className="py-2.5 px-3">Reading</th>
                <th className="py-2.5 px-3">Listening</th>
                <th className="py-2.5 px-3">RA Avg</th>
                <th className="py-2.5 px-3">Exam Status</th>
                <th className="py-2.5 px-3">Review Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allMocksSchedule
                .filter((item) => {
                  if (selectedRoundFilter === 'all') return true;
                  const round = getMockExamDetails(item.examNumber).roundNumber;
                  return String(round) === selectedRoundFilter;
                })
                .map((item) => {
                  const dayRec = days[item.dayNumber];
                  const mockRec = dayRec?.mockExams?.[item.mockId];
                  const revRec = dayRec?.mockReviews?.[item.reviewId];
                  const details = getMockExamDetails(item.examNumber);

                  return (
                    <tr
                      key={item.examNumber}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        item.dayNumber === currentDay ? 'bg-blue-600/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold font-mono text-blue-400">
                        Mock #{item.examNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-200 max-w-xs truncate" title={details.testName}>
                        {details.testName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${details.roundBadgeColor}`}>
                          Pass {details.roundNumber} (Att {details.attemptOfPaper}/4)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-200 font-medium">
                        Day {item.dayNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {dayRec ? formatDateFriendly(dayRec.date) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-amber-300/90 font-medium">
                        {details.timeSlot}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        {mockRec?.overallScore !== null && mockRec?.overallScore !== undefined
                          ? `${mockRec.overallScore}/90`
                          : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-blue-300">{mockRec?.speakingScore ?? '—'}</td>
                      <td className="py-2.5 px-3 text-purple-300">{mockRec?.writingScore ?? '—'}</td>
                      <td className="py-2.5 px-3 text-emerald-300">{mockRec?.readingScore ?? '—'}</td>
                      <td className="py-2.5 px-3 text-amber-300">{mockRec?.listeningScore ?? '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono">
                        {revRec?.raAverageScore !== undefined && revRec?.raAverageScore !== null
                          ? `${revRec.raAverageScore}/90`
                          : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            mockRec?.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {mockRec?.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            revRec?.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
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

