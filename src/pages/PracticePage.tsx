import React, { useState, useEffect, useMemo } from 'react';
import {
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  Flag,
  FileText,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Check,
  Award
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { generateInterleavedQueue } from '../utils/interleaving';
import { calculatePhaseAverage, calculateDayBreakdown } from '../utils/scoring';
import { QUESTION_TYPE_MAP, SKILL_COLORS } from '../config/constants';
import { QueueItem } from '../types/pte';

export const PracticePage: React.FC = () => {
  const {
    studyPlan,
    currentDay,
    currentDayData,
    updateScore
  } = usePteData();

  // Generate deterministic 200 interleaved questions
  const queue: QueueItem[] = useMemo(() => {
    return generateInterleavedQueue(
      studyPlan.questionTargets,
      currentDay,
      studyPlan.shuffleSeed || 42
    );
  }, [studyPlan.questionTargets, currentDay, studyPlan.shuffleSeed]);

  // Remember active question queue index in localStorage
  const queueStorageKey = `pte_queue_pos_day_${currentDay}`;
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem(queueStorageKey);
    const parsed = saved ? Number(saved) : 0;
    return parsed >= 0 && parsed < queue.length ? parsed : 0;
  });

  const [filterMode, setFilterMode] = useState<'all' | 'unscored' | 'prediction' | 'flagged'>('all');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(queueStorageKey, String(currentIndex));
  }, [currentIndex, queueStorageKey]);

  const currentItem: QueueItem | undefined = queue[currentIndex] || queue[0];
  const currentMeta = currentItem ? QUESTION_TYPE_MAP.get(currentItem.questionTypeId) : undefined;

  // Retrieve current attempt data from currentDayData
  const currentAttempts = currentDayData?.questionProgress?.[currentItem?.questionTypeId || '']?.attempts || {};
  const currentAttempt = currentItem ? currentAttempts[currentItem.instanceIndex] : undefined;

  // Form local state
  const [scoreInput, setScoreInput] = useState<string>(
    currentAttempt?.score !== null && currentAttempt?.score !== undefined ? String(currentAttempt.score) : ''
  );
  const [notesInput, setNotesInput] = useState<string>(currentAttempt?.notes || '');
  const [isFlagged, setIsFlagged] = useState<boolean>(currentAttempt?.isFlaggedForReview || false);

  // Sync local form state when switching questions
  useEffect(() => {
    if (currentAttempt) {
      setScoreInput(currentAttempt.score !== null && currentAttempt.score !== undefined ? String(currentAttempt.score) : '');
      setNotesInput(currentAttempt.notes || '');
      setIsFlagged(!!currentAttempt.isFlaggedForReview);
    } else {
      setScoreInput('');
      setNotesInput('');
      setIsFlagged(false);
    }
    setSaveSuccessNotice(false);
  }, [currentIndex, currentDayData]);

  // Save score and attempt
  const handleSaveAttempt = async (scoreToSave?: number | null) => {
    if (!currentItem) return;

    let finalScore: number | null = null;
    if (scoreToSave !== undefined) {
      finalScore = scoreToSave;
    } else if (scoreInput.trim() !== '') {
      const num = Number(scoreInput);
      if (!isNaN(num) && num >= 0 && num <= 90) {
        finalScore = Math.round(num * 10) / 10;
      }
    }

    await updateScore(currentDay, currentItem.questionTypeId, currentItem.instanceIndex, {
      score: finalScore,
      notes: notesInput,
      isFlaggedForReview: isFlagged
    });

    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 1500);

    if (autoAdvance && currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Find next unscored question
  const handleJumpNextUnscored = () => {
    for (let i = 0; i < queue.length; i++) {
      const idx = (currentIndex + 1 + i) % queue.length;
      const q = queue[idx];
      const att = currentDayData?.questionProgress?.[q.questionTypeId]?.attempts?.[q.instanceIndex];
      if (!att || att.score === null || att.score === undefined) {
        setCurrentIndex(idx);
        return;
      }
    }
    alert('🎉 All 200 questions in today\'s queue have been scored!');
  };

  // Metrics for header
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const skillColor = currentItem ? SKILL_COLORS[currentItem.skill] : SKILL_COLORS.speaking;

  // Phase calculation for current item
  const phaseIndex = currentItem ? Math.floor(currentItem.instanceIndex / 5) + 1 : 1;
  const itemInPhase = currentItem ? (currentItem.instanceIndex % 5) + 1 : 1;
  const phaseStats = currentItem
    ? calculatePhaseAverage(
        currentAttempts,
        Math.floor(currentItem.instanceIndex / 5) * 5,
        Math.min((Math.floor(currentItem.instanceIndex / 5) + 1) * 5, studyPlan.questionTargets[currentItem.questionTypeId] || 20)
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Queue Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141c31] border border-[#2b3856] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Day {currentDay} Mixed Practice Workspace
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            200 Balanced Interleaved Questions · Cross-Skill Practice Engine
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-[#10192c] border border-[#2b3856] rounded-xl px-3.5 py-1.5 text-center">
            <span className="text-[10px] text-[#a9b5d0] block">Completed</span>
            <span className="text-sm font-bold text-emerald-400">
              {breakdown.totalCompleted} / {breakdown.totalDailyTarget}
            </span>
          </div>

          <div className="bg-[#10192c] border border-[#2b3856] rounded-xl px-3.5 py-1.5 text-center">
            <span className="text-[10px] text-[#a9b5d0] block">Daily Avg</span>
            <span className="text-sm font-bold text-[#80a7ff]">
              {breakdown.dailyAverage !== null ? `${breakdown.dailyAverage.toFixed(1)}/90` : '—'}
            </span>
          </div>

          <button
            onClick={handleJumpNextUnscored}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
            title="Jump to next unscored question"
          >
            <span>Next Unscored</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Practice Workspace Card */}
      {currentItem && (
        <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
          {/* Top Bar of Current Question Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b3856] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-mono font-bold px-3 py-1 rounded-xl bg-[#10192c] text-blue-300 border border-[#2b3856]">
                Queue #{currentIndex + 1} of {queue.length}
              </span>

              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${skillColor.badge} uppercase tracking-wider`}>
                {currentItem.skill}
              </span>

              {currentItem.isPrediction && (
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-pink-400" />
                  PREDICTION PRIORITY
                </span>
              )}
            </div>

            <div className="text-xs text-[#a9b5d0] flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#10192c] border border-[#2b3856]">
                Phase {phaseIndex} · Q{itemInPhase} of 5
              </span>
              {phaseStats?.average !== null && (
                <span className="px-2.5 py-1 rounded-lg bg-[#10192c] border border-blue-500/30 text-blue-300">
                  Phase Avg: <b>{phaseStats?.average?.toFixed(1)}</b>
                </span>
              )}
            </div>
          </div>

          {/* Question Details */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#edf2ff] flex items-center gap-2">
                  {currentItem.questionTypeName}
                  <span className="text-sm font-normal text-[#a9b5d0]">
                    (Item #{currentItem.instanceIndex + 1} of {studyPlan.questionTargets[currentItem.questionTypeId] || 20})
                  </span>
                </h2>
                <p className="text-xs text-[#a9b5d0] mt-1 max-w-2xl leading-relaxed">
                  {currentMeta?.description}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#a9b5d0] bg-[#10192c] border border-[#2b3856] px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Est. {currentMeta?.estMinutes}</span>
              </div>
            </div>
          </div>

          {/* Practice External Prompt Instructions */}
          <div className="p-4 rounded-2xl bg-[#10192c] border border-[#2b3856] text-xs text-[#a9b5d0] space-y-1">
            <p className="font-semibold text-[#edf2ff] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Practice Instructions & External Material Logging:
            </p>
            <p>
              Attempt this question on your PTE mock software, prediction bank, or test portal. Record your earned score (0–90) and notes below to update phase averages and progress.
            </p>
          </div>

          {/* Score Entry Section */}
          <div className="p-5 rounded-2xl bg-[#0e1729] border border-[#2b3856] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-[#edf2ff] mb-1">
                  Earned Score (0 – 90):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    step="0.1"
                    placeholder="0 – 90"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-32 bg-[#141c31] border border-[#3a4b70] rounded-xl px-4 py-2.5 text-lg font-bold text-white text-center focus:outline-none focus:border-blue-400"
                  />
                  {currentAttempt?.score !== null && currentAttempt?.score !== undefined && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Recorded: {currentAttempt.score}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick score preset pills */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#a9b5d0] block">Quick Presets:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[90, 85, 79, 70, 60, 50, 0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setScoreInput(String(preset));
                        handleSaveAttempt(preset);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#141c31] border border-[#2b3856] text-xs font-semibold text-[#edf2ff] hover:border-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes and Review Flag */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#2b3856]">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                  Question Notes / Mistake Details:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Missed past-tense ending, hesitation after 3rd word, question link"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-[#141c31] border border-[#2b3856] rounded-xl px-3 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#141c31] border border-[#2b3856] cursor-pointer hover:border-amber-500/40">
                  <input
                    type="checkbox"
                    checked={isFlagged}
                    onChange={(e) => setIsFlagged(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" /> Flag for Review
                  </span>
                </label>
              </div>
            </div>

            {/* Action Save Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-[#a9b5d0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span>Auto-advance to next question upon saving</span>
              </label>

              <div className="flex items-center gap-3">
                {saveSuccessNotice && (
                  <span className="text-xs text-emerald-400 font-semibold animate-bounce flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to Firebase!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveAttempt()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Score & Next</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2b3856]">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-[#edf2ff] hover:bg-[#19243d] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <span className="text-xs text-[#a9b5d0] font-mono">
              Question {currentIndex + 1} / {queue.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(queue.length - 1, prev + 1))}
              disabled={currentIndex === queue.length - 1}
              className="px-4 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-[#edf2ff] hover:bg-[#19243d] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Visual Queue Navigator Matrix */}
      <div className="bg-[#141c31] border border-[#2b3856] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">200-Question Interleaved Queue Matrix</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#a9b5d0]">Filter:</span>
            {(['all', 'unscored', 'prediction', 'flagged'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterMode(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterMode === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#10192c] text-[#a9b5d0] hover:text-[#edf2ff] border border-[#2b3856]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 max-h-56 overflow-y-auto p-1">
          {queue.map((item, idx) => {
            const att = currentDayData?.questionProgress?.[item.questionTypeId]?.attempts?.[item.instanceIndex];
            const isScored = att && att.score !== null && att.score !== undefined;
            const isCurrent = idx === currentIndex;

            // Apply filter
            if (filterMode === 'unscored' && isScored) return null;
            if (filterMode === 'prediction' && !item.isPrediction) return null;
            if (filterMode === 'flagged' && !att?.isFlaggedForReview) return null;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-400 border-white bg-blue-600 text-white z-10 scale-105'
                    : isScored
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : item.isPrediction
                    ? 'bg-pink-500/10 text-pink-300 border-pink-500/30 hover:bg-pink-500/20'
                    : 'bg-[#10192c] text-[#a9b5d0] border-[#2b3856] hover:border-blue-400'
                }`}
                title={`#${idx + 1}: ${item.questionTypeName} (${item.skill}) - ${isScored ? `Score: ${att.score}` : 'Unscored'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#a9b5d0] pt-2 border-t border-[#2b3856]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
            <span>Scored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500/40" />
            <span>Prediction Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#10192c] border border-[#2b3856]" />
            <span>Unscored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
