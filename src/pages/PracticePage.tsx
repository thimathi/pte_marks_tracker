import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight,
  GraduationCap,
  Target,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckSquare,
  Award
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { generateInterleavedQueue } from '../utils/interleaving';
import { calculateDayBreakdown } from '../utils/scoring';
import {
  QUESTION_TYPE_MAP,
  SKILL_COLORS,
  STUDY_GROUPS,
  PRIORITY_STYLES,
  getMockExamsForDay,
  getExamNumberForMock,
  getMockExamDetails,
  DAILY_MOCK_SCHEDULE,
  PHASE_DEFINITIONS
} from '../config/constants';
import { QueueItem, QuestionPriority } from '../types/pte';
import { formatDateFriendly } from '../utils/dateUtils';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { MasterTargetTrackerCard } from '../components/analytics/MasterTargetTrackerCard';

export const PracticePage: React.FC = () => {
  const {
    studyPlan,
    currentDay,
    currentDayData,
    updateScore,
    updateMockExam,
    completeAllQuestionsForDay,
    completeAllMocksForDay
  } = usePteData();

  // Active Phase Filter: 'all' | 1 | 2 | 3 | 4 | 5
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');

  // Generate 100 questions ordered by High Score Weight Priority across 5 phases
  const fullQueue: QueueItem[] = useMemo(() => {
    return generateInterleavedQueue(
      studyPlan.questionTargets,
      currentDay,
      studyPlan.shuffleSeed || 42
    );
  }, [studyPlan.questionTargets, currentDay, studyPlan.shuffleSeed]);

  // Selected Question Type Filter ('all' or questionTypeId)
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');

  // Filtered queue based on selected Phase and Group
  const activeQueue = useMemo(() => {
    let queue = fullQueue;
    if (selectedPhase !== 'all') {
      queue = queue.filter((q) => q.phaseNumber === selectedPhase);
    }
    if (selectedGroupId !== 'all') {
      queue = queue.filter((q) => q.groupId === selectedGroupId);
    }
    return queue;
  }, [fullQueue, selectedPhase, selectedGroupId]);

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
  const [showMasterTracker, setShowMasterTracker] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [batchScore, setBatchScore] = useState<number>(79);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(queueStorageKey, String(currentOverallIndex));
  }, [currentOverallIndex, queueStorageKey]);

  // Current active question item from the full queue
  const currentItem: QueueItem | undefined = fullQueue[currentOverallIndex] || fullQueue[0];
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

  // Find next unscored question
  const handleJumpNextUnscored = (withinCurrentGroupOnly: boolean = false) => {
    const searchPool = withinCurrentGroupOnly ? activeQueue : fullQueue;
    if (searchPool.length === 0) return;

    const poolCurrentIdx = searchPool.findIndex((q) => q.overallQueueIndex === currentOverallIndex);
    const startIdx = poolCurrentIdx >= 0 ? poolCurrentIdx : 0;

    for (let i = 0; i < searchPool.length; i++) {
      const idx = (startIdx + 1 + i) % searchPool.length;
      const q = searchPool[idx];
      const att = currentDayData?.questionProgress?.[q.questionTypeId]?.attempts?.[q.instanceIndex];
      if (!att || att.score === null || att.score === undefined) {
        setCurrentOverallIndex(q.overallQueueIndex);
        if (withinCurrentGroupOnly && selectedGroupId !== q.groupId) {
          setSelectedGroupId(q.groupId);
        }
        return;
      }
    }
  };

  // Day live completion breakdown
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);

  // Stats for 16 Priority Groups
  const groupStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number; average: number | null }> = {};
    for (const group of STUDY_GROUPS) {
      const target = group.totalQuestions;
      const attObj = currentDayData?.questionProgress?.[group.id]?.attempts || {};
      let completed = 0;
      let sum = 0;
      for (let i = 0; i < target; i++) {
        const sc = attObj[i]?.score;
        if (sc !== null && sc !== undefined && !isNaN(sc)) {
          completed++;
          sum += sc;
        }
      }
      stats[group.id] = {
        completed,
        total: target,
        average: completed > 0 ? Math.round((sum / completed) * 10) / 10 : null
      };
    }
    return stats;
  }, [currentDayData]);

  // Priority Styles & Color
  const priorityStyle = currentItem
    ? PRIORITY_STYLES[currentItem.priority]
    : PRIORITY_STYLES['medium'];

  const skillColor = currentItem
    ? SKILL_COLORS[currentItem.skill]
    : SKILL_COLORS['speaking'];

  const currentTotalForType = currentItem
    ? (studyPlan.questionTargets[currentItem.questionTypeId] ?? currentMeta?.defaultTarget ?? 20)
    : 20;

  // 4 Mock Exams for today
  const dayMockKeys = getMockExamsForDay(currentDay);
  const completedMocksCount = dayMockKeys.filter((k) => currentDayData?.mockExams?.[k]?.isCompleted).length;

  // Batch completion handler
  const handleBatchComplete = async (mode: 'questions' | 'mocks' | 'all') => {
    setBatchLoading(true);
    try {
      if (mode === 'questions' || mode === 'all') {
        await completeAllQuestionsForDay(currentDay, batchScore);
      }
      if (mode === 'mocks' || mode === 'all') {
        await completeAllMocksForDay(currentDay, batchScore);
      }
      setShowBatchModal(false);
    } catch (err) {
      console.error('Batch complete error:', err);
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Day {currentDay} · 5-Phase Daily Plan
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/25 font-semibold">
                Superior English · PTE Bridge
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Divided into <b>5 Daily Phases</b>: 5 Mock Exams (1 per phase) · 100 Daily Questions (20 per phase) · Structured daily drills.
            </p>
          </div>

          {/* Quick Counter Pills & Batch Action */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* 5 Mocks Counter */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl px-3 sm:px-4 py-2 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Mock Exams</span>
              <span className={`text-base font-bold ${completedMocksCount === 5 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {completedMocksCount} / 5
              </span>
            </div>

            {/* 100 Qs Counter */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl px-3 sm:px-4 py-2 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Practice Qs</span>
              <span className={`text-base font-bold ${breakdown.totalCompleted >= breakdown.totalDailyTarget ? 'text-emerald-400' : 'text-slate-100'}`}>
                {breakdown.totalCompleted} / {breakdown.totalDailyTarget}
              </span>
            </div>

            {/* Daily Avg */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl px-3 sm:px-4 py-2 text-center min-w-[85px]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Daily Avg</span>
              <span className="text-base font-bold text-amber-400">
                {breakdown.dailyAverage !== null ? `${breakdown.dailyAverage.toFixed(1)}/90` : '—'}
              </span>
            </div>

            {/* Complete All / Auto-Fill Trigger */}
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              title="Quick Complete Questions & Mock Exams"
            >
              <Zap className="w-4 h-4 text-emerald-200" />
              <span>Complete All / Auto Fill</span>
            </button>
          </div>
        </div>

        {/* 5-Phase Tabs Selector Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setSelectedPhase('all');
              setSelectedGroupId('all');
              setCurrentOverallIndex(0);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 'all'
                ? 'bg-blue-600 text-white shadow-sm '
                : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>All 5 Phases</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 font-mono">
              100 Qs
            </span>
          </button>

          {PHASE_DEFINITIONS.map((p) => {
            const isSelected = selectedPhase === p.phaseNumber;
            const mockKey = `mock0${p.mockIndex + 1}`;
            const mockDone = !!currentDayData?.mockExams?.[mockKey]?.isCompleted;

            // Calculate scored questions in this phase
            let phaseScored = 0;
            p.questionTypes.forEach((qt) => {
              const atts = currentDayData?.questionProgress?.[qt.typeId]?.attempts || {};
              for (let i = 0; i < qt.count; i++) {
                if (atts[i]?.score !== null && atts[i]?.score !== undefined) phaseScored++;
              }
            });
            const isDone = mockDone && phaseScored >= p.questionCount;

            return (
              <button
                key={p.phaseNumber}
                onClick={() => {
                  setSelectedPhase(p.phaseNumber);
                  setSelectedGroupId('all');
                  const firstOfPhase = fullQueue.find((q) => q.phaseNumber === p.phaseNumber);
                  if (firstOfPhase) setCurrentOverallIndex(firstOfPhase.overallQueueIndex);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm border-blue-400'
                    : isDone
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Phase {p.phaseNumber}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 font-mono text-slate-400">
                    {phaseScored}/{p.questionCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Daily Mock Exams Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Today's 5 Full Simulation Mock Exams (5 Fixed Timed Slots · 300 Exam Questions Covered)
            </h2>
          </div>
          <Link
            to="/mock-exams"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Mock Exam Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {dayMockKeys.map((mKey, idx) => {
            const examNum = getExamNumberForMock(currentDay, idx);
            const mockRec = currentDayData?.mockExams?.[mKey];
            const isDone = !!mockRec?.isCompleted;
            const details = getMockExamDetails(examNum);
            const schedule = DAILY_MOCK_SCHEDULE[idx];

            return (
              <div
                key={mKey}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-sm'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      Mock #{idx + 1} of 5
                    </span>
                    {isDone ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {mockRec?.overallScore}/90
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Pending
                      </span>
                    )}
                  </div>

                  {schedule && (
                    <div className="mb-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{schedule.timeSlot}</span>
                    </div>
                  )}

                  <h3 className="text-xs font-bold text-slate-100 line-clamp-2" title={details.testName}>
                    Test #{examNum}: {details.testName}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                    {schedule?.sessionName || details.roundTitle.split(':')[0]}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[79, 85].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          updateMockExam(currentDay, mKey, {
                            overallScore: preset,
                            speakingScore: preset,
                            writingScore: preset,
                            readingScore: preset,
                            listeningScore: preset,
                            isCompleted: true
                          })
                        }
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
                      >
                        Set {preset}
                      </button>
                    ))}
                  </div>

                  <Link
                    to="/mock-exams"
                    className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition-colors"
                  >
                    {isDone ? 'Edit' : 'Take'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Daily Repeat Tasks (5-Phase Drills) */}
      <div id="daily-drills">
        <DailyDrillsCard dayNumber={currentDay} initialPhaseFilter={selectedPhase} />
      </div>

      {/* High-Yield Question Priority Filter Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Practice Navigator — 16 Question Types Ordered by Score Weight
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Total {fullQueue.length} Questions
          </span>
        </div>

        {/* Priority Scrollable Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedGroupId('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedGroupId === 'all'
                ? 'bg-indigo-600 text-white shadow-sm '
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>All Questions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/60 font-mono">
              {breakdown.totalCompleted}/{breakdown.totalDailyTarget}
            </span>
          </button>

          {STUDY_GROUPS.map((g) => {
            const stats = groupStats[g.id] || { completed: 0, total: g.totalQuestions, average: null };
            const isSelected = selectedGroupId === g.id;
            const isDone = stats.completed >= stats.total;

            return (
              <button
                key={g.id}
                onClick={() => {
                  setSelectedGroupId(g.id);
                  const firstOfGroup = fullQueue.find((q) => q.groupId === g.id);
                  if (firstOfGroup) setCurrentOverallIndex(firstOfGroup.overallQueueIndex);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm '
                    : isDone
                    ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-slate-900/80 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{g.shortTitle}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/60 font-mono text-slate-400">
                    {stats.completed}/{stats.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Workspace Card */}
      {currentItem && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
          {/* Top Bar of Question Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Score Weight Pill */}
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span>⭐</span>
                <span>{currentItem.scoreWeight}% Score Weight</span>
              </span>

              {/* Priority Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${priorityStyle.badge}`}>
                <span>{priorityStyle.icon}</span>
                <span className="uppercase tracking-wider">{currentItem.priorityLabel}</span>
              </span>

              {/* Skill Badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${skillColor.badge} uppercase tracking-wider`}>
                {currentItem.skill}
              </span>

              {/* Question Position Counter */}
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950/70 text-slate-400 border border-slate-800">
                Item #{currentItem.instanceIndex + 1} of {currentTotalForType}
              </span>

              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-950/70 text-slate-400 border border-slate-800">
                Overall Queue #{currentItem.overallQueueIndex + 1} / {fullQueue.length}
              </span>
            </div>

            <button
              onClick={() => handleJumpNextUnscored(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Jump to next unscored question"
            >
              <span>Next Unscored</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Question Details Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                  {currentItem.questionTypeName}
                  <span className="text-sm font-normal text-slate-400">
                    ({currentItem.scoreWeight}% PTE Weight)
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  {currentMeta?.description}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Est. {currentMeta?.estMinutes}</span>
              </div>
            </div>
          </div>

          {/* Instructions Prompt */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              Practice Instructions:
            </p>
            <p>
              Complete this item in APEUni or your PTE test software. Enter your earned AI score (0–90) below to update analytics and gate completion.
            </p>
          </div>

          {/* Score Entry Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
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
                    className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  {currentAttempt?.score !== null && currentAttempt?.score !== undefined && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Recorded: {currentAttempt.score}/90
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Score Preset Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-medium">Quick Presets:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[90, 85, 79, 75, 65, 50, 0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setScoreInput(String(preset));
                        handleSaveAttempt(preset);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-indigo-400 hover:text-indigo-300 hover:bg-slate-850 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes and Review Flag */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Notes / Mistakes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pronunciation hesitation, collocation error, spelling"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-500/40 transition-colors">
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
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                <span>Auto-advance to next question upon saving</span>
              </label>

              <div className="flex items-center gap-3">
                {saveSuccessNotice && (
                  <span className="text-xs text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveAttempt()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Score & Next</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentOverallIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentOverallIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-300 font-medium block">
                {currentItem.questionTypeName} · #{currentItem.instanceIndex + 1} of {currentTotalForType}
              </span>
              <span className="text-[10px] text-slate-500">
                (Overall Queue: {currentOverallIndex + 1} / {fullQueue.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleJumpNextUnscored(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-indigo-300 hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                title="Jump to next unscored item in this category"
              >
                <span>Next in Type</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentOverallIndex((prev) => Math.min(fullQueue.length - 1, prev + 1))}
                disabled={currentOverallIndex === fullQueue.length - 1}
                className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Queue Matrix Grid */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {selectedGroupId === 'all'
                ? `All ${fullQueue.length} Questions Matrix (Ordered by Score Weight)`
                : `${currentMeta?.name || selectedGroupId} Matrix (${activeQueue.length} Questions)`}
            </h3>
          </div>

          {/* Matrix Filter Pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {(['all', 'unscored', 'prediction', 'hard', 'flagged'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setMatrixFilter(f)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  matrixFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 max-h-64 overflow-y-auto p-1 scrollbar-thin">
          {activeQueue.map((item) => {
            const att = currentDayData?.questionProgress?.[item.questionTypeId]?.attempts?.[item.instanceIndex];
            const isScored = att && att.score !== null && att.score !== undefined;
            const isCurrent = item.overallQueueIndex === currentOverallIndex;

            if (matrixFilter === 'unscored' && isScored) return null;
            if (matrixFilter === 'prediction' && item.priority !== 'prediction') return null;
            if (matrixFilter === 'hard' && item.priority !== 'hard') return null;
            if (matrixFilter === 'flagged' && !att?.isFlaggedForReview) return null;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentOverallIndex(item.overallQueueIndex)}
                className={`h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                  isCurrent
                    ? ' border-white bg-indigo-600 text-white z-10 scale-105 shadow-md'
                    : isScored
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : item.priority === 'prediction'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/35 hover:bg-rose-500/25'
                    : item.priority === 'hard'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 hover:bg-amber-500/25'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                title={`#${item.instanceIndex + 1} (${item.questionTypeName}) - ${isScored ? `Score: ${att.score}` : 'Unscored'}`}
              >
                {selectedGroupId === 'all' ? item.overallQueueIndex + 1 : item.instanceIndex + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
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
            <span className="w-3 h-3 rounded bg-slate-950/80 border border-slate-800" />
            <span>Unscored</span>
          </div>
        </div>
      </div>

      {/* Batch / Quick Complete Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Quick Complete All Tasks
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record scores and complete items in 1 click
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Target Score (0 – 90):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={batchScore}
                  onChange={(e) => setBatchScore(Number(e.target.value))}
                  className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-base font-bold text-white text-center focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-1.5">
                  {[79, 85, 90].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBatchScore(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <button
                disabled={batchLoading}
                onClick={() => handleBatchComplete('all')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Award className="w-4 h-4" />
                <span>Complete Everything (5 Mocks [300 Qs] + 100 Practice Qs = 400 Total Qs with Score {batchScore})</span>
              </button>

              <button
                disabled={batchLoading}
                onClick={() => handleBatchComplete('questions')}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Complete All 100 Questions Only</span>
              </button>

              <button
                disabled={batchLoading}
                onClick={() => handleBatchComplete('mocks')}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Complete All 5 Mock Exams Only</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
