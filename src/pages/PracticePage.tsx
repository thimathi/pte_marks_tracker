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
  Filter,
  Check,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { generateInterleavedQueue } from '../utils/interleaving';
import { calculatePhaseAverage, calculateDayBreakdown } from '../utils/scoring';
import { QUESTION_TYPE_MAP, SKILL_COLORS, STUDY_GROUPS, PRIORITY_STYLES } from '../config/constants';
import { QueueItem, QuestionPriority } from '../types/pte';
import { formatDateFriendly } from '../utils/dateUtils';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';

export const PracticePage: React.FC = () => {
  const {
    studyPlan,
    currentDay,
    currentDayData,
    updateScore
  } = usePteData();

  // Generate 193 questions structured into 4 sections (Speaking 102 · Writing 3 · Reading 45 · Listening 43)
  const fullQueue: QueueItem[] = useMemo(() => {
    return generateInterleavedQueue(
      studyPlan.questionTargets,
      currentDay,
      studyPlan.shuffleSeed || 42
    );
  }, [studyPlan.questionTargets, currentDay, studyPlan.shuffleSeed]);

  // Selected Group Filter ('all' or 'group_1', 'group_2', 'group_3', 'group_4')
  const [selectedGroupId, setSelectedGroupId] = useState<'all' | 'group_1' | 'group_2' | 'group_3' | 'group_4'>('group_1');

  // Filtered queue based on selected group
  const activeQueue = useMemo(() => {
    if (selectedGroupId === 'all') return fullQueue;
    return fullQueue.filter((q) => q.groupId === selectedGroupId);
  }, [fullQueue, selectedGroupId]);

  // Overall queue index tracked in localStorage
  const queueStorageKey = `pte_queue_pos_day_${currentDay}`;
  const [currentOverallIndex, setCurrentOverallIndex] = useState<number>(() => {
    const saved = localStorage.getItem(queueStorageKey);
    const parsed = saved ? Number(saved) : 0;
    return parsed >= 0 && parsed < fullQueue.length ? parsed : 0;
  });

  const [matrixFilter, setMatrixFilter] = useState<'all' | 'unscored' | 'prediction' | 'hard' | 'flagged'>('all');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(queueStorageKey, String(currentOverallIndex));
  }, [currentOverallIndex, queueStorageKey]);

  // Current active question item from the full queue
  const currentItem: QueueItem | undefined = fullQueue[currentOverallIndex] || fullQueue[0];
  const currentMeta = currentItem ? QUESTION_TYPE_MAP.get(currentItem.questionTypeId) : undefined;

  // Sync selected group tab with current question item if user clicks across groups in matrix
  useEffect(() => {
    if (currentItem && selectedGroupId !== 'all' && currentItem.groupId !== selectedGroupId) {
      setSelectedGroupId(currentItem.groupId);
    }
  }, [currentItem?.groupId]);

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
  }, [currentOverallIndex, currentDayData]);

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

    if (autoAdvance && currentOverallIndex < fullQueue.length - 1) {
      setCurrentOverallIndex((prev) => prev + 1);
    }
  };

  // Find next unscored question in current group or full queue
  const handleJumpNextUnscored = (withinCurrentGroupOnly: boolean = false) => {
    const searchPool = withinCurrentGroupOnly ? activeQueue : fullQueue;
    if (searchPool.length === 0) return;

    // Find current position in searchPool
    const poolCurrentIdx = searchPool.findIndex((q) => q.overallQueueIndex === currentOverallIndex);
    const startIdx = poolCurrentIdx >= 0 ? poolCurrentIdx : 0;

    for (let i = 0; i < searchPool.length; i++) {
      const idx = (startIdx + 1 + i) % searchPool.length;
      const q = searchPool[idx];
      const att = currentDayData?.questionProgress?.[q.questionTypeId]?.attempts?.[q.instanceIndex];
      if (!att || att.score === null || att.score === undefined) {
        setCurrentOverallIndex(q.overallQueueIndex);
        if (selectedGroupId !== 'all' && q.groupId !== selectedGroupId) {
          setSelectedGroupId(q.groupId);
        }
        return;
      }
    }
    alert(`🎉 All questions in ${withinCurrentGroupOnly ? 'this section' : 'today\'s 193-question plan'} have been scored!`);
  };

  // Group completion calculations
  const groupStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number; average: number | null }> = {};
    for (const group of STUDY_GROUPS) {
      const groupQuestions = fullQueue.filter((q) => q.groupId === group.id);
      let comp = 0;
      let totalScores = 0;
      let sumScores = 0;

      for (const q of groupQuestions) {
        const att = currentDayData?.questionProgress?.[q.questionTypeId]?.attempts?.[q.instanceIndex];
        if (att && typeof att.score === 'number' && !isNaN(att.score)) {
          comp++;
          sumScores += att.score;
          totalScores++;
        }
      }

      stats[group.id] = {
        completed: comp,
        total: group.totalQuestions,
        average: totalScores > 0 ? Math.round((sumScores / totalScores) * 10) / 10 : null
      };
    }
    return stats;
  }, [fullQueue, currentDayData]);

  // Overall metrics
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const skillColor = currentItem ? SKILL_COLORS[currentItem.skill] : SKILL_COLORS.speaking;
  const priorityStyle = currentItem ? PRIORITY_STYLES[currentItem.priority] : PRIORITY_STYLES.prediction;

  // Phase calculation for current item
  const phaseIndex = currentItem ? Math.floor(currentItem.instanceIndex / 5) + 1 : 1;
  const itemInPhase = currentItem ? (currentItem.instanceIndex % 5) + 1 : 1;
  const currentTotalForType = studyPlan.questionTargets[currentItem?.questionTypeId || ''] || 20;
  const phaseStats = currentItem
    ? calculatePhaseAverage(
        currentAttempts,
        Math.floor(currentItem.instanceIndex / 5) * 5,
        Math.min((Math.floor(currentItem.instanceIndex / 5) + 1) * 5, currentTotalForType)
      )
    : null;

  const currentGroupDef = STUDY_GROUPS.find((g) => g.id === currentItem?.groupId) || STUDY_GROUPS[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Daily Practice Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141c31] border border-[#2b3856] rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              PTE - Daily Study Plan – Superior English
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Day {currentDay} Practice Workspace · 4 Sections ({fullQueue.length} Questions Total) · Started: {formatDateFriendly(studyPlan.startDate)}
          </p>
        </div>

        {/* Day 1 Focus Notice */}
        {currentDay === 1 && (
          <div className="w-full bg-purple-500/15 border border-purple-500/40 rounded-2xl p-4 text-xs flex items-center justify-between gap-3 text-purple-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>
                <b>Day 1 Focus (Priority #1):</b> 5 Full Mock Exams are required today! Daily practice questions are 0 required for Day 1. Any practice questions scored will automatically count toward Day 2.
              </span>
            </div>
            <a
              href="/mock-exams"
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex-shrink-0"
            >
              Go to Mock Exams
            </a>
          </div>
        )}

        {/* Global Counter Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-[#10192c] border border-[#2b3856] rounded-xl px-3.5 py-1.5 text-center">
            <span className="text-[10px] text-[#a9b5d0] block">Daily Total</span>
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
            onClick={() => handleJumpNextUnscored(false)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Jump to next unscored question"
          >
            <span>Next Unscored</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Daily Repeat Tasks (3 Core Drills) */}
      <div id="daily-drills">
        <DailyDrillsCard dayNumber={currentDay} />
      </div>

      {/* 4 Study Groups Tabs (Mock-Style Navigation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STUDY_GROUPS.map((group) => {
          const stats = groupStats[group.id] || { completed: 0, total: group.totalQuestions, average: null };
          const isSelected = selectedGroupId === group.id;
          const isDone = stats.completed >= stats.total;
          const pct = Math.round((stats.completed / stats.total) * 100);

          return (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroupId(group.id);
                // Switch current question to first item of that group if current question isn't in it
                if (currentItem?.groupId !== group.id) {
                  const firstOfGroup = fullQueue.find((q) => q.groupId === group.id);
                  if (firstOfGroup) setCurrentOverallIndex(firstOfGroup.overallQueueIndex);
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                  : 'bg-[#141c31] border-[#2b3856] hover:border-[#3d4f7a] hover:bg-[#18233c]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#edf2ff] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-500'}`} />
                  {group.title}
                </span>
                {isDone ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#80a7ff]">
                    {stats.completed}/{stats.total}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#a9b5d0] mb-2.5 truncate">{group.subtitle}</p>

              {/* Progress Bar */}
              <div className="w-full bg-[#10192c] rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isDone ? 'bg-emerald-400' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[10px] text-[#a9b5d0]">
                <span>{pct}% complete</span>
                {stats.average !== null && <span>Avg: {stats.average}/90</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Practice Workspace Card */}
      {currentItem && (
        <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
          {/* Top Bar of Question Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b3856] pb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Group Pill */}
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {currentItem.groupTitle} · Q{currentItem.groupIndex + 1} of {currentItem.groupTotal}
              </span>

              {/* Score Weight Pill */}
              {currentItem.scoreWeight !== undefined && (
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <span>⭐</span>
                  <span>{currentItem.scoreWeight}% Score Weight</span>
                </span>
              )}

              {/* Priority Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${priorityStyle.badge}`}>
                <span>{priorityStyle.icon}</span>
                <span className="uppercase tracking-wider">{currentItem.priorityLabel}</span>
              </span>

              {/* Skill Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${skillColor.badge} uppercase tracking-wider`}>
                {currentItem.skill}
              </span>

              {/* Overall Index */}
              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-[#10192c] text-[#a9b5d0] border border-[#2b3856]">
                Overall #{currentItem.overallQueueIndex + 1} of {fullQueue.length}
              </span>
            </div>

            {/* 5-Question Micro-Batch Stats */}
            <div className="text-xs text-[#a9b5d0] flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#10192c] border border-[#2b3856]">
                5-Q Batch {phaseIndex} · Q{itemInPhase} of 5
              </span>
              {phaseStats?.average !== null && (
                <span className="px-2.5 py-1 rounded-lg bg-[#10192c] border border-blue-500/30 text-blue-300">
                  Batch Avg: <b>{phaseStats?.average?.toFixed(1)}</b>
                </span>
              )}
            </div>
          </div>

          {/* Question Details Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#edf2ff] flex items-center gap-2">
                  {currentItem.questionTypeName}
                  <span className="text-sm font-normal text-[#a9b5d0]">
                    (Item #{currentItem.typeIndexInGroup} of {currentItem.typeTotalInGroup} in {currentItem.groupTitle})
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

          {/* Instructions Prompt */}
          <div className="p-4 rounded-2xl bg-[#10192c] border border-[#2b3856] text-xs text-[#a9b5d0] space-y-1">
            <p className="font-semibold text-[#edf2ff] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Practice Instructions:
            </p>
            <p>
              Complete this item on your PTE software, portal, or prediction bank. Enter your earned score (0–90) and mistake notes below to update phase averages and analytics.
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
                  placeholder="e.g. Missed past-tense ending, pronunciation hesitation, grammar collocation"
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
                    <Check className="w-3.5 h-3.5" /> Saved!
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2b3856]">
            <button
              onClick={() => setCurrentOverallIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentOverallIndex === 0}
              className="px-4 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-[#edf2ff] hover:bg-[#19243d] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <div className="text-center">
              <span className="text-xs text-[#a9b5d0] font-mono block">
                {currentItem.groupTitle}: Q{currentItem.groupIndex + 1} / {currentItem.groupTotal}
              </span>
              <span className="text-[10px] text-[#6b7c9f]">
                (Overall Queue: {currentOverallIndex + 1} / {fullQueue.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleJumpNextUnscored(true)}
                className="px-3 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-blue-300 hover:bg-[#19243d] flex items-center gap-1 cursor-pointer"
                title="Jump to next unscored item in this group"
              >
                <span>Next in Group</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentOverallIndex((prev) => Math.min(fullQueue.length - 1, prev + 1))}
                disabled={currentOverallIndex === fullQueue.length - 1}
                className="px-4 py-2 rounded-xl bg-[#10192c] border border-[#2b3856] text-xs font-semibold text-[#edf2ff] hover:bg-[#19243d] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Queue Matrix Grid for 4 Groups */}
      <div className="bg-[#141c31] border border-[#2b3856] rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-[#edf2ff]">
              {selectedGroupId === 'all'
                ? 'All 193 Questions Matrix (Speaking 102 · Writing 3 · Reading 45 · Listening 43)'
                : `${currentGroupDef.title} Matrix (${currentGroupDef.totalQuestions} Questions)`}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View scope selector */}
            <div className="flex items-center gap-1 bg-[#10192c] p-1 rounded-xl border border-[#2b3856]">
              {STUDY_GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    selectedGroupId === g.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[#a9b5d0] hover:text-[#edf2ff]'
                  }`}
                >
                  {g.shortTitle}
                </button>
              ))}
              <button
                onClick={() => setSelectedGroupId('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  selectedGroupId === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#a9b5d0] hover:text-[#edf2ff]'
                }`}
              >
                All 193
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1">
              {(['all', 'unscored', 'prediction', 'hard', 'flagged'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setMatrixFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    matrixFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#10192c] text-[#a9b5d0] hover:text-[#edf2ff] border border-[#2b3856]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 max-h-64 overflow-y-auto p-1">
          {activeQueue.map((item) => {
            const att = currentDayData?.questionProgress?.[item.questionTypeId]?.attempts?.[item.instanceIndex];
            const isScored = att && att.score !== null && att.score !== undefined;
            const isCurrent = item.overallQueueIndex === currentOverallIndex;

            // Apply filter
            if (matrixFilter === 'unscored' && isScored) return null;
            if (matrixFilter === 'prediction' && item.priority !== 'prediction') return null;
            if (matrixFilter === 'hard' && item.priority !== 'hard') return null;
            if (matrixFilter === 'flagged' && !att?.isFlaggedForReview) return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentOverallIndex(item.overallQueueIndex);
                  if (selectedGroupId !== 'all' && item.groupId !== selectedGroupId) {
                    setSelectedGroupId(item.groupId);
                  }
                }}
                className={`h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-400 border-white bg-blue-600 text-white z-10 scale-105'
                    : isScored
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : item.priority === 'prediction'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/35 hover:bg-rose-500/25'
                    : item.priority === 'hard'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 hover:bg-amber-500/25'
                    : 'bg-[#10192c] text-[#a9b5d0] border-[#2b3856] hover:border-blue-400'
                }`}
                title={`#${item.groupIndex + 1} (${item.groupTitle}) - ${item.questionTypeName} [${item.priorityLabel}] - ${isScored ? `Score: ${att.score}` : 'Unscored'}`}
              >
                {selectedGroupId === 'all' ? item.overallQueueIndex + 1 : item.groupIndex + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#a9b5d0] pt-2 border-t border-[#2b3856]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
            <span>Scored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/25 border border-rose-500/50" />
            <span>Top Weight (9–15%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/25 border border-amber-500/50" />
            <span>High Weight (6–7%)</span>
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
