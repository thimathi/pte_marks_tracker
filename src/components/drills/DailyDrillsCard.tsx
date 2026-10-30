import React, { useState, useEffect } from 'react';
import {
  Mic,
  BookOpen,
  PenTool,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Copy,
  Check,
  Search,
  Timer,
  RefreshCw,
  X,
  Volume2,
  Sliders,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  Users,
  FileText
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import {
  DEFAULT_ADDITIONAL_EXERCISES,
  getAcademicCollocationsTarget,
  PHASE_DEFINITIONS
} from '../../config/constants';
import {
  TONGUE_TWISTERS_COLLECTION,
  PEARSON_ACADEMIC_COLLOCATIONS,
  PTE_BRIDGE_ESSAY_TEMPLATES,
  PTE_BRIDGE_SGD_TEMPLATES,
  PTE_ESSAY_TEMPLATE,
  getCollocationsForDay
} from '../../data/dailyTasksData';

interface DailyDrillsCardProps {
  dayNumber: number;
  initialPhaseFilter?: number | 'all';
}

export const DailyDrillsCard: React.FC<DailyDrillsCardProps> = ({
  dayNumber,
  initialPhaseFilter = 'all'
}) => {
  const { currentDayData, updateExerciseCount, studyPlan, days } = usePteData();
  const targetDay = days[dayNumber] || currentDayData;
  const dayExercises = targetDay?.additionalExercises || {};

  // Active Phase Filter
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | 'all'>(initialPhaseFilter);

  // Active study modal tab: null | 'tongue_twister' | 'collocations_fwd' | 'collocations_bwd' | 'essay_template' | 'sgd_template'
  const [activeModal, setActiveModal] = useState<
    'tongue_twister' | 'collocations_fwd' | 'collocations_bwd' | 'essay_template' | 'sgd_template' | null
  >(null);

  // Tongue Twister Timer & Search
  const [twisterTimer, setTwisterTimer] = useState(30);
  const [twisterTimerRunning, setTwisterTimerRunning] = useState(false);
  const [twisterQuery, setTwisterQuery] = useState('');
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Collocations Filter & Mode
  const [collocationQuery, setCollocationQuery] = useState('');
  const [collocationMode, setCollocationMode] = useState<'forward' | 'backward'>('forward');

  // Essay Template Typing Practice & Selection
  const [selectedEssayType, setSelectedEssayType] = useState<'discussion' | 'problems_solutions'>('discussion');
  const [selectedEssayPhase, setSelectedEssayPhase] = useState<4 | 5>(4);
  const [typedEssayText, setTypedEssayText] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [typingTimer, setTypingTimer] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);

  // SGD Template Typing Practice & Selection
  const [selectedSgdType, setSelectedSgdType] = useState<'three_speakers' | 'two_speakers'>('three_speakers');
  const [selectedSgdPhase, setSelectedSgdPhase] = useState<4 | 5>(4);
  const [typedSgdText, setTypedSgdText] = useState('');
  const [copiedSgdTemplate, setCopiedSgdTemplate] = useState(false);
  const [sgdTimer, setSgdTimer] = useState(0);
  const [isSgdTimerActive, setIsSgdTimerActive] = useState(false);

  // Timer effect for tongue twisters
  useEffect(() => {
    let interval: any = null;
    if (twisterTimerRunning && twisterTimer > 0) {
      interval = setInterval(() => {
        setTwisterTimer((prev) => prev - 1);
      }, 1000);
    } else if (twisterTimer === 0) {
      setTwisterTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [twisterTimerRunning, twisterTimer]);

  // Timer effect for essay typing practice
  useEffect(() => {
    let interval: any = null;
    if (isTypingActive) {
      interval = setInterval(() => {
        setTypingTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTypingActive]);

  // Timer effect for SGD typing practice
  useEffect(() => {
    let interval: any = null;
    if (isSgdTimerActive) {
      interval = setInterval(() => {
        setSgdTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSgdTimerActive]);

  // Web Speech API for Tongue Twisters
  const handleSpeak = (id: number, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleCopySgdTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSgdTemplate(true);
    setTimeout(() => setCopiedSgdTemplate(false), 2000);
  };

  // Word count helpers
  const typedWordCount = typedEssayText.trim() === '' ? 0 : typedEssayText.trim().split(/\s+/).length;
  const typedSgdWordCount = typedSgdText.trim() === '' ? 0 : typedSgdText.trim().split(/\s+/).length;

  // Exercise Targets & Counts
  const collocationsTarget = getAcademicCollocationsTarget(dayNumber);

  // Phase 1: Tongue Twisters (2)
  const twisterCount =
    dayExercises['tongue_twister']?.completedCount ??
    dayExercises['tongue_twisters']?.completedCount ??
    0;
  const isTwistersFulfilled = twisterCount >= 2;

  // Phase 2: Academic Collocations Forward
  const collocFwdCount =
    dayExercises['collocations_fwd']?.completedCount ??
    dayExercises['academic_collocations']?.completedCount ??
    0;
  const isCollocFwdFulfilled = collocFwdCount >= collocationsTarget;

  // Phase 3: Academic Collocations Backward
  const collocBwdCount = dayExercises['collocations_bwd']?.completedCount ?? 0;
  const isCollocBwdFulfilled = collocBwdCount >= collocationsTarget;

  // Phase 4: Write Essay Template 1 & SGD Template 1
  const essayP4Count =
    dayExercises['essay_template_p4']?.completedCount ??
    (dayExercises['essay_template']?.completedCount ? 1 : 0);
  const sgdP4Count = dayExercises['sgd_template_p4']?.completedCount ?? 0;
  const isP4Fulfilled = essayP4Count >= 1 && sgdP4Count >= 1;

  // Phase 5: Write Essay Template 1 & SGD Template 1
  const essayP5Count =
    dayExercises['essay_template_p5']?.completedCount ??
    (dayExercises['essay_template']?.completedCount && dayExercises['essay_template']?.completedCount >= 2 ? 1 : 0);
  const sgdP5Count = dayExercises['sgd_template_p5']?.completedCount ?? 0;
  const isP5Fulfilled = essayP5Count >= 1 && sgdP5Count >= 1;

  const isAllTasksFulfilled =
    isTwistersFulfilled &&
    isCollocFwdFulfilled &&
    isCollocBwdFulfilled &&
    isP4Fulfilled &&
    isP5Fulfilled;

  const handleSetCount = async (exerciseId: string, newCount: number) => {
    const safeCount = Math.max(0, newCount);
    await updateExerciseCount(dayNumber, exerciseId, safeCount);

    // Sync legacy keys for backward compatibility
    if (exerciseId === 'collocations_fwd') {
      await updateExerciseCount(dayNumber, 'academic_collocations', safeCount);
    } else if (exerciseId === 'essay_template_p4' || exerciseId === 'essay_template_p5') {
      const p4 = exerciseId === 'essay_template_p4' ? safeCount : essayP4Count;
      const p5 = exerciseId === 'essay_template_p5' ? safeCount : essayP5Count;
      await updateExerciseCount(dayNumber, 'essay_template', p4 + p5);
    }
  };

  // Filtered Tongue Twisters
  const filteredTwisters = TONGUE_TWISTERS_COLLECTION.filter(
    (t) =>
      t.text.toLowerCase().includes(twisterQuery.toLowerCase()) ||
      t.id.toString().includes(twisterQuery)
  );

  // Collocations List for modal
  const collocationsForModal = getCollocationsForDay(dayNumber, collocationMode, collocationsTarget).filter((c) => {
    const fullStr = `${c.addition || ''} ${c.component1} ${c.component2} ${c.addition2 || ''}`.toLowerCase();
    return (
      fullStr.includes(collocationQuery.toLowerCase()) ||
      c.id.toString().includes(collocationQuery) ||
      c.pos1.toLowerCase().includes(collocationQuery.toLowerCase()) ||
      c.pos2.toLowerCase().includes(collocationQuery.toLowerCase())
    );
  });

  const activeEssay = PTE_BRIDGE_ESSAY_TEMPLATES[selectedEssayType];
  const activeSgd = PTE_BRIDGE_SGD_TEMPLATES[selectedSgdType];

  return (
    <div id="daily-drills" className="rounded-2xl bg-[#141c31] border border-slate-800 p-5 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-[#edf2ff]">
              5-Phase Daily Mandatory Drills
            </h2>
            {isAllTasksFulfilled ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                All 5 Phases Completed ✓
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Day {dayNumber} · Collocations Target: {collocationsTarget}
              </span>
            )}
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Exact drills structured across the 5 daily phases: Tongue Twisters 2x, Collocations Fwd & Bwd, and Essay & SGD templates.
          </p>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0e1729] p-1 rounded-xl border border-slate-800 self-start sm:self-center overflow-x-auto max-w-full">
          <button
            onClick={() => setActivePhaseFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activePhaseFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#a9b5d0] hover:text-[#edf2ff] hover:bg-[#19243d]'
            }`}
          >
            All Phases
          </button>
          {[1, 2, 3, 4, 5].map((pNum) => (
            <button
              key={pNum}
              onClick={() => setActivePhaseFilter(pNum)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activePhaseFilter === pNum
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[#a9b5d0] hover:text-[#edf2ff] hover:bg-[#19243d]'
              }`}
            >
              Phase {pNum}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Drills categorized by Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ================= PHASE 1 DRILL: TONGUE TWISTERS 2x ================= */}
        {(activePhaseFilter === 'all' || activePhaseFilter === 1) && (
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isTwistersFulfilled
                ? 'bg-[#10192c] border-emerald-500/30 shadow-sm'
                : 'bg-[#12192b] border-slate-800 hover:border-blue-500/40'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Phase 1 Drill
                </span>
                <span className={`text-xs font-bold ${isTwistersFulfilled ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {twisterCount} / 2 Reps
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#edf2ff]">Tongue Twisters (2 Reps)</h3>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                  50 English Tongue Twisters · Complete <b>2 reps daily</b> for zero hesitation and continuous oral fluency.
                </p>
              </div>

              {/* Repeat Checkboxes */}
              <div className="flex items-center gap-2 pt-1">
                {[1, 2].map((num) => {
                  const isChecked = twisterCount >= num;
                  return (
                    <button
                      key={num}
                      onClick={() => handleSetCount('tongue_twister', isChecked ? num - 1 : num)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-[#0e1729] text-[#a9b5d0] border-slate-800 hover:border-blue-400'
                      }`}
                    >
                      {isChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                      <span>Rep #{num}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setActiveModal('tongue_twister');
                  setTwisterTimer(30);
                  setTwisterTimerRunning(false);
                }}
                className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Open 50 Twisters Lab</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 2 DRILL: ACADEMIC COLLOCATIONS FWD ================= */}
        {(activePhaseFilter === 'all' || activePhaseFilter === 2) && (
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isCollocFwdFulfilled
                ? 'bg-[#10192c] border-emerald-500/30 shadow-sm'
                : 'bg-[#12192b] border-slate-800 hover:border-purple-500/40'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Phase 2 Drill
                </span>
                <span className={`text-xs font-bold ${isCollocFwdFulfilled ? 'text-emerald-400' : 'text-purple-300'}`}>
                  {collocFwdCount} / {collocationsTarget} Colloc Fwd
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#edf2ff]">Academic Collocations Forward</h3>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                  Day 1: 100, +50 each day (Day {dayNumber} Target: <b>{collocationsTarget} Collocations</b> in forward order).
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#a9b5d0]">Progress</span>
                  <span className={`font-semibold ${isCollocFwdFulfilled ? 'text-emerald-400' : 'text-[#edf2ff]'}`}>
                    {Math.min(100, Math.round((collocFwdCount / collocationsTarget) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCollocFwdFulfilled ? 'bg-emerald-400' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(100, (collocFwdCount / collocationsTarget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => handleSetCount('collocations_fwd', collocFwdCount + 25)}
                  className="flex-1 py-1 rounded-lg bg-[#0e1729] hover:bg-purple-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-purple-300 border border-slate-800"
                >
                  +25
                </button>
                <button
                  onClick={() => handleSetCount('collocations_fwd', collocFwdCount + 50)}
                  className="flex-1 py-1 rounded-lg bg-[#0e1729] hover:bg-purple-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-purple-300 border border-slate-800"
                >
                  +50
                </button>
                <button
                  onClick={() => handleSetCount('collocations_fwd', collocationsTarget)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold border ${
                    isCollocFwdFulfilled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  }`}
                >
                  {collocationsTarget} ✓
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setCollocationMode('forward');
                  setActiveModal('collocations_fwd');
                }}
                className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Forward ({collocationsTarget})</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 3 DRILL: ACADEMIC COLLOCATIONS BWD ================= */}
        {(activePhaseFilter === 'all' || activePhaseFilter === 3) && (
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isCollocBwdFulfilled
                ? 'bg-[#10192c] border-emerald-500/30 shadow-sm'
                : 'bg-[#12192b] border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Phase 3 Drill
                </span>
                <span className={`text-xs font-bold ${isCollocBwdFulfilled ? 'text-emerald-400' : 'text-emerald-300'}`}>
                  {collocBwdCount} / {collocationsTarget} Colloc Bwd
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#edf2ff]">Academic Collocations Backward</h3>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                  Day 1: 100, +50 each day (Day {dayNumber} Target: <b>{collocationsTarget} Collocations</b> in reverse order).
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#a9b5d0]">Progress</span>
                  <span className={`font-semibold ${isCollocBwdFulfilled ? 'text-emerald-400' : 'text-[#edf2ff]'}`}>
                    {Math.min(100, Math.round((collocBwdCount / collocationsTarget) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCollocBwdFulfilled ? 'bg-emerald-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (collocBwdCount / collocationsTarget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => handleSetCount('collocations_bwd', collocBwdCount + 25)}
                  className="flex-1 py-1 rounded-lg bg-[#0e1729] hover:bg-emerald-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-emerald-300 border border-slate-800"
                >
                  +25
                </button>
                <button
                  onClick={() => handleSetCount('collocations_bwd', collocBwdCount + 50)}
                  className="flex-1 py-1 rounded-lg bg-[#0e1729] hover:bg-emerald-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-emerald-300 border border-slate-800"
                >
                  +50
                </button>
                <button
                  onClick={() => handleSetCount('collocations_bwd', collocationsTarget)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold border ${
                    isCollocBwdFulfilled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {collocationsTarget} ✓
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setCollocationMode('backward');
                  setActiveModal('collocations_bwd');
                }}
                className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Backward ({collocationsTarget})</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 4 DRILLS: ESSAY TEMPLATE 1 + SGD TEMPLATE 1 ================= */}
        {(activePhaseFilter === 'all' || activePhaseFilter === 4) && (
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isP4Fulfilled
                ? 'bg-[#10192c] border-emerald-500/30 shadow-sm'
                : 'bg-[#12192b] border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <PenTool className="w-3 h-3" /> Phase 4 Drills
                </span>
                <span className={`text-xs font-bold ${isP4Fulfilled ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {essayP4Count + sgdP4Count} / 2 Completed
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#edf2ff]">Phase 4 Templates</h3>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                  Write Essay Template - 1 rep & Summarize Group Discussion Template - 1 rep.
                </p>
              </div>

              {/* Repeat Checkboxes */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSetCount('essay_template_p4', essayP4Count >= 1 ? 0 : 1)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    essayP4Count >= 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-[#0e1729] text-[#a9b5d0] border-slate-800 hover:border-amber-400'
                  }`}
                >
                  {essayP4Count >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>Essay (1)</span>
                </button>

                <button
                  onClick={() => handleSetCount('sgd_template_p4', sgdP4Count >= 1 ? 0 : 1)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    sgdP4Count >= 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-[#0e1729] text-[#a9b5d0] border-slate-800 hover:border-amber-400'
                  }`}
                >
                  {sgdP4Count >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>SGD (1)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setSelectedEssayPhase(4);
                  setActiveModal('essay_template');
                }}
                className="py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <PenTool className="w-3 h-3" />
                <span>Essay Lab</span>
              </button>
              <button
                onClick={() => {
                  setSelectedSgdPhase(4);
                  setActiveModal('sgd_template');
                }}
                className="py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>SGD Lab</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 5 DRILLS: ESSAY TEMPLATE 1 + SGD TEMPLATE 1 ================= */}
        {(activePhaseFilter === 'all' || activePhaseFilter === 5) && (
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isP5Fulfilled
                ? 'bg-[#10192c] border-emerald-500/30 shadow-sm'
                : 'bg-[#12192b] border-slate-800 hover:border-rose-500/40'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <PenTool className="w-3 h-3" /> Phase 5 Drills
                </span>
                <span className={`text-xs font-bold ${isP5Fulfilled ? 'text-emerald-400' : 'text-rose-300'}`}>
                  {essayP5Count + sgdP5Count} / 2 Completed
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#edf2ff]">Phase 5 Templates</h3>
                <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                  Write Essay Template - 1 rep & Summarize Group Discussion Template - 1 rep.
                </p>
              </div>

              {/* Repeat Checkboxes */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSetCount('essay_template_p5', essayP5Count >= 1 ? 0 : 1)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    essayP5Count >= 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-[#0e1729] text-[#a9b5d0] border-slate-800 hover:border-rose-400'
                  }`}
                >
                  {essayP5Count >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>Essay (1)</span>
                </button>

                <button
                  onClick={() => handleSetCount('sgd_template_p5', sgdP5Count >= 1 ? 0 : 1)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    sgdP5Count >= 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-[#0e1729] text-[#a9b5d0] border-slate-800 hover:border-rose-400'
                  }`}
                >
                  {sgdP5Count >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>SGD (1)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setSelectedEssayPhase(5);
                  setActiveModal('essay_template');
                }}
                className="py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <PenTool className="w-3 h-3" />
                <span>Essay Lab</span>
              </button>
              <button
                onClick={() => {
                  setSelectedSgdPhase(5);
                  setActiveModal('sgd_template');
                }}
                className="py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>SGD Lab</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: TONGUE TWISTERS (50 TWISTERS) ================= */}
      {activeModal === 'tongue_twister' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    50 Tongue Twisters Enunciation Lab (Phase 1 · 2 Reps)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE AI Oral Fluency Drill · Target: Continuous Speech Flow Without Hesitations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timer & Search Toolbar */}
            <div className="p-4 bg-[#0e1729] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="text-[10px] text-[#a9b5d0] block">Enunciation Speed Timer:</span>
                  <span className="text-xl font-extrabold text-[#edf2ff] font-mono">
                    00:{twisterTimer < 10 ? `0${twisterTimer}` : twisterTimer}
                  </span>
                </div>
                <button
                  onClick={() => setTwisterTimerRunning(!twisterTimerRunning)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {twisterTimerRunning ? 'Pause' : 'Start 30s'}
                </button>
                <button
                  onClick={() => {
                    setTwisterTimerRunning(false);
                    setTwisterTimer(30);
                  }}
                  className="p-1.5 rounded-lg bg-[#1e2a47] hover:bg-[#28375c] text-[#a9b5d0] hover:text-white transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#a9b5d0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={twisterQuery}
                  onChange={(e) => setTwisterQuery(e.target.value)}
                  placeholder="Filter twisters (e.g., Peter Piper)..."
                  className="w-full bg-[#141c31] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 placeholder:text-[#a9b5d0]/50"
                />
              </div>
            </div>

            {/* 50 Twisters List */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {filteredTwisters.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0e1729] border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          #{item.id}
                        </span>
                        {item.repetition && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Say {item.repetition} Fast
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#edf2ff] leading-relaxed">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => handleSpeak(item.id, item.text)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          speakingId === item.id
                            ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                            : 'bg-[#1e2a47] hover:bg-[#28375c] text-[#a9b5d0] hover:text-white border-slate-800'
                        }`}
                        title="Listen to pronunciation audio"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-[11px] hidden sm:inline">Listen</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{twisterCount} / 2 reps</b>
              </span>
              <button
                onClick={() => {
                  handleSetCount('tongue_twister', Math.min(2, twisterCount + 1));
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Repeat Complete (+1)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2 & 3: COLLOCATIONS (FORWARD & BACKWARD) ================= */}
      {(activeModal === 'collocations_fwd' || activeModal === 'collocations_bwd') && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${collocationMode === 'forward' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
                  {collocationMode === 'forward' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff] flex items-center gap-2">
                    Academic Collocations {collocationMode === 'forward' ? 'Forward (Phase 2)' : 'Backward (Phase 3)'}
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                      Day {dayNumber}: {collocationsTarget} Target (+50/day)
                    </span>
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    Pearson Academic Collocations · Master {collocationsTarget} pairs daily for reading blanks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode Toggle */}
                <div className="flex items-center bg-[#0e1729] rounded-xl p-1 border border-slate-800">
                  <button
                    onClick={() => setCollocationMode('forward')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      collocationMode === 'forward'
                        ? 'bg-purple-600 text-white'
                        : 'text-[#a9b5d0] hover:text-white'
                    }`}
                  >
                    Forward (1➔{collocationsTarget})
                  </button>
                  <button
                    onClick={() => setCollocationMode('backward')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      collocationMode === 'backward'
                        ? 'bg-emerald-600 text-white'
                        : 'text-[#a9b5d0] hover:text-white'
                    }`}
                  >
                    Backward ({collocationsTarget}➔1)
                  </button>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="p-4 bg-[#0e1729] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#a9b5d0]">
                  Target: <b className="text-white">{collocationsTarget} Pairs</b> · Mode: <b className={collocationMode === 'forward' ? 'text-purple-400' : 'text-emerald-400'}>{collocationMode.toUpperCase()}</b>
                </span>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#a9b5d0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={collocationQuery}
                  onChange={(e) => setCollocationQuery(e.target.value)}
                  placeholder="Filter collocations (word, POS)..."
                  className="w-full bg-[#141c31] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#edf2ff] focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {collocationsForModal.slice(0, 150).map((colloc, idx) => (
                  <div
                    key={`${colloc.id}-${idx}`}
                    className="p-3 rounded-xl bg-[#0e1729] border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#a9b5d0] mb-0.5">
                        <span className="font-mono text-purple-300">#{colloc.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#1e2a47] text-[9px] uppercase font-bold text-blue-300">
                          {colloc.pos1}+{colloc.pos2}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#edf2ff]">
                        {colloc.addition && <span className="text-[#a9b5d0]">{colloc.addition} </span>}
                        <b className="text-blue-300">{colloc.component1}</b>{' '}
                        <b className="text-purple-300">{colloc.component2}</b>
                        {colloc.addition2 && <span className="text-[#a9b5d0]"> {colloc.addition2}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {collocationsForModal.length > 150 && (
                <p className="text-center text-xs text-[#a9b5d0] pt-2">
                  Showing first 150 of {collocationsForModal.length} items. Keep repeating daily!
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                {collocationMode === 'forward' ? 'Phase 2 Progress: ' : 'Phase 3 Progress: '}
                <b className="text-white">
                  {collocationMode === 'forward' ? collocFwdCount : collocBwdCount} / {collocationsTarget}
                </b>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const key = collocationMode === 'forward' ? 'collocations_fwd' : 'collocations_bwd';
                    const cur = collocationMode === 'forward' ? collocFwdCount : collocBwdCount;
                    handleSetCount(key, cur + 50);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-xs font-semibold text-[#edf2ff] border border-slate-800"
                >
                  +50 Learned
                </button>
                <button
                  onClick={() => {
                    const key = collocationMode === 'forward' ? 'collocations_fwd' : 'collocations_bwd';
                    handleSetCount(key, collocationsTarget);
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All {collocationsTarget} Complete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: WRITE ESSAY TEMPLATES ================= */}
      {activeModal === 'essay_template' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    PTE Bridge Write Essay Template Lab (Phase {selectedEssayPhase})
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    Official PTE Bridge Discussion & Problems/Solutions Essay Templates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyTemplate(activeEssay.fullText)}
                  className="px-3 py-1.5 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] border border-slate-800 text-xs font-semibold text-[#edf2ff] flex items-center gap-1.5"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied!' : 'Copy Template'}</span>
                </button>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs for Template Types */}
            <div className="p-3 bg-[#0e1729] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEssayType('discussion')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedEssayType === 'discussion'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] hover:text-white'
                  }`}
                >
                  Discussion Type
                </button>
                <button
                  onClick={() => setSelectedEssayType('problems_solutions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedEssayType === 'problems_solutions'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] hover:text-white'
                  }`}
                >
                  Problems & Solutions Type
                </button>
              </div>

              {/* Typing Timer */}
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-[#edf2ff]">
                  {Math.floor(typingTimer / 60)}:{(typingTimer % 60).toString().padStart(2, '0')}
                </span>
                <button
                  onClick={() => setIsTypingActive(!isTypingActive)}
                  className="px-2.5 py-1 rounded-lg bg-[#1e2a47] hover:bg-[#28375c] text-[11px] font-semibold text-[#edf2ff]"
                >
                  {isTypingActive ? 'Pause' : 'Start Timer'}
                </button>
              </div>
            </div>

            {/* Template Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[#0e1729] border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeEssay.name}
                </h4>
                <div className="space-y-3 text-xs leading-relaxed text-[#edf2ff]">
                  {activeEssay.sections.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-[#80a7ff]">{s.title}:</p>
                      {s.points.map((pt, pIdx) => (
                        <p key={pIdx} className="text-[#a9b5d0] pl-2 border-l border-slate-800">
                          {pt}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Typing Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#a9b5d0]">Speed Typing Practice:</span>
                  <span className="font-mono text-amber-400">Words: {typedWordCount} / 220–260</span>
                </div>
                <textarea
                  value={typedEssayText}
                  onChange={(e) => {
                    setTypedEssayText(e.target.value);
                    if (!isTypingActive) setIsTypingActive(true);
                  }}
                  placeholder="Type the essay template from memory here..."
                  className="w-full h-36 bg-[#0e1729] border border-slate-800 rounded-xl p-3 text-xs text-[#edf2ff] focus:outline-none focus:border-amber-400 font-mono resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Phase {selectedEssayPhase} Essay Drill: <b className="text-white">Target: 1 Repetition</b>
              </span>
              <button
                onClick={() => {
                  const key = selectedEssayPhase === 4 ? 'essay_template_p4' : 'essay_template_p5';
                  handleSetCount(key, 1);
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Phase {selectedEssayPhase} Essay Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: SUMMARIZE GROUP DISCUSSION (SGD) TEMPLATE ================= */}
      {activeModal === 'sgd_template' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    Summarize Group Discussion Template Lab (Phase {selectedSgdPhase})
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE Bridge Official 3-Speaker Group Discussion Template (High PTE Score Weight: 9%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySgdTemplate(activeSgd.fullText)}
                  className="px-3 py-1.5 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] border border-slate-800 text-xs font-semibold text-[#edf2ff] flex items-center gap-1.5"
                >
                  {copiedSgdTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSgdTemplate ? 'Copied!' : 'Copy Template'}</span>
                </button>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="p-3 bg-[#0e1729] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSgdType('three_speakers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSgdType === 'three_speakers'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] hover:text-white'
                  }`}
                >
                  3-Speaker Discussion (Standard)
                </button>
                <button
                  onClick={() => setSelectedSgdType('two_speakers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSgdType === 'two_speakers'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] hover:text-white'
                  }`}
                >
                  2-Speaker Dialogue
                </button>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-[#edf2ff]">
                  {Math.floor(sgdTimer / 60)}:{(sgdTimer % 60).toString().padStart(2, '0')}
                </span>
                <button
                  onClick={() => setIsSgdTimerActive(!isSgdTimerActive)}
                  className="px-2.5 py-1 rounded-lg bg-[#1e2a47] hover:bg-[#28375c] text-[11px] font-semibold text-[#edf2ff]"
                >
                  {isSgdTimerActive ? 'Pause' : 'Start Timer'}
                </button>
              </div>
            </div>

            {/* Template Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[#0e1729] border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {activeSgd.name}
                </h4>
                <div className="space-y-3 text-xs leading-relaxed text-[#edf2ff]">
                  {activeSgd.sections.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-[#80a7ff]">{s.title}:</p>
                      {s.points.map((pt, pIdx) => (
                        <p key={pIdx} className="text-[#a9b5d0] pl-2 border-l border-slate-800">
                          {pt}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                {activeSgd.tips && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[11px] font-bold text-amber-300 mb-1">Key SGD Scoring Tips:</p>
                    <ul className="list-disc list-inside text-[11px] text-[#a9b5d0] space-y-0.5">
                      {activeSgd.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Typing Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#a9b5d0]">Speed Memorization & Typing:</span>
                  <span className="font-mono text-indigo-400">Words: {typedSgdWordCount}</span>
                </div>
                <textarea
                  value={typedSgdText}
                  onChange={(e) => {
                    setTypedSgdText(e.target.value);
                    if (!isSgdTimerActive) setIsSgdTimerActive(true);
                  }}
                  placeholder="Type the SGD template here to solidify memory..."
                  className="w-full h-32 bg-[#0e1729] border border-slate-800 rounded-xl p-3 text-xs text-[#edf2ff] focus:outline-none focus:border-indigo-400 font-mono resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Phase {selectedSgdPhase} SGD Drill: <b className="text-white">Target: 1 Repetition</b>
              </span>
              <button
                onClick={() => {
                  const key = selectedSgdPhase === 4 ? 'sgd_template_p4' : 'sgd_template_p5';
                  handleSetCount(key, 1);
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Phase {selectedSgdPhase} SGD Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
