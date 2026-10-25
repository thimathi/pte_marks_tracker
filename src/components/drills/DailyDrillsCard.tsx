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
  Award
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { DEFAULT_ADDITIONAL_EXERCISES } from '../../config/constants';
import {
  TONGUE_TWISTERS_COLLECTION,
  PEARSON_ACADEMIC_COLLOCATIONS,
  PTE_BRIDGE_ESSAY_TEMPLATES,
  PTE_ESSAY_TEMPLATE
} from '../../data/dailyTasksData';

interface DailyDrillsCardProps {
  dayNumber: number;
}

export const DailyDrillsCard: React.FC<DailyDrillsCardProps> = ({ dayNumber }) => {
  const { currentDayData, updateExerciseCount, studyPlan } = usePteData();
  const dayExercises = currentDayData?.additionalExercises || {};

  // Active study modal tab: null | 'tongue_twister' | 'academic_collocations' | 'essay_template'
  const [activeModal, setActiveModal] = useState<'tongue_twister' | 'academic_collocations' | 'essay_template' | null>(null);

  // Tongue Twister Timer & Search
  const [twisterTimer, setTwisterTimer] = useState(30);
  const [twisterTimerRunning, setTwisterTimerRunning] = useState(false);
  const [twisterQuery, setTwisterQuery] = useState('');
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Collocations Filter & Batching
  const [collocationQuery, setCollocationQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<'all' | '1' | '2' | '3'>('all');

  // Essay Template Typing Practice & Selection
  const [selectedEssayType, setSelectedEssayType] = useState<'discussion' | 'problems_solutions'>('discussion');
  const [typedEssayText, setTypedEssayText] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [typingTimer, setTypingTimer] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);

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

  // Word count for typed essay
  const typedWordCount = typedEssayText.trim() === '' ? 0 : typedEssayText.trim().split(/\s+/).length;

  // Exercise Targets & Counts
  const twisterRecord = dayExercises['tongue_twister'];
  const twisterTarget = studyPlan.additionalExerciseTargets?.['tongue_twister'] ?? 2;
  const twisterCount = twisterRecord?.completedCount ?? 0;

  const collocRecord = dayExercises['academic_collocations'];
  const collocTarget = studyPlan.additionalExerciseTargets?.['academic_collocations'] ?? 100;
  const collocCount = collocRecord?.completedCount ?? 0;

  const essayRecord = dayExercises['essay_template'];
  const essayTarget = studyPlan.additionalExerciseTargets?.['essay_template'] ?? 2;
  const essayCount = essayRecord?.completedCount ?? 0;

  const isTwistersFulfilled = twisterCount >= twisterTarget;
  const isCollocFulfilled = collocCount >= collocTarget;
  const isEssayFulfilled = essayCount >= essayTarget;
  const isAllTasksFulfilled = isTwistersFulfilled && isCollocFulfilled && isEssayFulfilled;

  const handleSetCount = async (exerciseId: string, newCount: number) => {
    const safeCount = Math.max(0, newCount);
    await updateExerciseCount(dayNumber, exerciseId, safeCount);
  };

  // Filtered Tongue Twisters
  const filteredTwisters = TONGUE_TWISTERS_COLLECTION.filter((t) =>
    t.text.toLowerCase().includes(twisterQuery.toLowerCase()) ||
    t.id.toString().includes(twisterQuery)
  );

  // Filtered Collocations
  const filteredCollocations = PEARSON_ACADEMIC_COLLOCATIONS.filter((c) => {
    const fullStr = `${c.addition || ''} ${c.component1} ${c.component2} ${c.addition2 || ''}`.toLowerCase();
    const matchesQuery = fullStr.includes(collocationQuery.toLowerCase()) ||
      c.id.toString().includes(collocationQuery) ||
      c.pos1.toLowerCase().includes(collocationQuery.toLowerCase()) ||
      c.pos2.toLowerCase().includes(collocationQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (selectedBatch === '1') return c.id >= 1 && c.id <= 50;
    if (selectedBatch === '2') return c.id >= 51 && c.id <= 100;
    if (selectedBatch === '3') return c.id >= 101 && c.id <= 150;
    return true;
  });

  const activeEssay = PTE_BRIDGE_ESSAY_TEMPLATES[selectedEssayType];

  return (
    <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-5 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2b3856] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-[#edf2ff]">
              Mandatory Daily Repeat Tasks (3 Core Drills)
            </h2>
            {isAllTasksFulfilled && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                All 3 Completed ✓
              </span>
            )}
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Build subconscious oral fluency, collocation memory, and speed-typing before your exam. Each task requires exact daily repeats.
          </p>
        </div>

        {/* Overall Status Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-semibold ${isTwistersFulfilled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1e2a47] text-[#a9b5d0]'}`}>
              Twisters {twisterCount}/{twisterTarget}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-semibold ${isCollocFulfilled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1e2a47] text-[#a9b5d0]'}`}>
              Collocations {collocCount}/{collocTarget}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-semibold ${isEssayFulfilled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1e2a47] text-[#a9b5d0]'}`}>
              Essays {essayCount}/{essayTarget}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ================= TASK 1: TONGUE TWISTERS (2x) ================= */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          isTwistersFulfilled
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-blue-500/40'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Speaking Drill
              </span>
              <span className={`text-xs font-bold ${isTwistersFulfilled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {twisterCount} / {twisterTarget} Reps
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Tongue Twisters Enunciation</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                50 English Twisters list · Complete <b>2 reps daily</b> for zero oral hesitations and smooth fluency.
              </p>
            </div>

            {/* Repeat Checkboxes */}
            <div className="flex items-center gap-2 pt-1">
              {Array.from({ length: twisterTarget }, (_, i) => i + 1).map((num) => {
                const isChecked = twisterCount >= num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSetCount('tongue_twister', isChecked ? num - 1 : num)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-[#0e1729] text-[#a9b5d0] border-[#2b3856] hover:border-blue-400'
                    }`}
                  >
                    {isChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>Repeat #{num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60">
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

        {/* ================= TASK 2: ACADEMIC COLLOCATIONS (100 / Day) ================= */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          isCollocFulfilled
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-purple-500/40'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Reading & Writing
              </span>
              <span className={`text-xs font-bold ${isCollocFulfilled ? 'text-emerald-400' : 'text-purple-300'}`}>
                {collocCount} / {collocTarget} Learned
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Academic Collocations</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Pearson Academic List · Master <b>100 collocations daily</b> for maximum accuracy in FIB Dropdown and Drag-and-Drop.
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#a9b5d0]">Daily Target Progress</span>
                <span className={`font-semibold ${isCollocFulfilled ? 'text-emerald-400' : 'text-[#edf2ff]'}`}>
                  {Math.min(100, Math.round((collocCount / collocTarget) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0e1729] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCollocFulfilled ? 'bg-emerald-400' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, (collocCount / collocTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => handleSetCount('academic_collocations', collocCount + 10)}
                className="flex-1 py-1 px-1 rounded-lg bg-[#0e1729] hover:bg-purple-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-purple-300 border border-[#2b3856] hover:border-purple-500/40 transition-colors"
                title="Add 10 Collocations"
              >
                +10
              </button>
              <button
                onClick={() => handleSetCount('academic_collocations', collocCount + 25)}
                className="flex-1 py-1 px-1 rounded-lg bg-[#0e1729] hover:bg-purple-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-purple-300 border border-[#2b3856] hover:border-purple-500/40 transition-colors"
                title="Add 25 Collocations"
              >
                +25
              </button>
              <button
                onClick={() => handleSetCount('academic_collocations', collocCount + 50)}
                className="flex-1 py-1 px-1 rounded-lg bg-[#0e1729] hover:bg-purple-600/20 text-[11px] font-semibold text-[#a9b5d0] hover:text-purple-300 border border-[#2b3856] hover:border-purple-500/40 transition-colors"
                title="Add 50 Collocations"
              >
                +50
              </button>
              <button
                onClick={() => handleSetCount('academic_collocations', 100)}
                className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  isCollocFulfilled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
                }`}
                title="Set Complete (100)"
              >
                100 ✓
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60">
            <button
              onClick={() => setActiveModal('academic_collocations')}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Pearson List</span>
            </button>
          </div>
        </div>

        {/* ================= TASK 3: WRITE ESSAY TEMPLATES (2x / Day) ================= */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          isEssayFulfilled
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-amber-500/40'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <PenTool className="w-3 h-3" /> Writing Mastery
              </span>
              <span className={`text-xs font-bold ${isEssayFulfilled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {essayCount} / {essayTarget} Written
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Write Essay Templates</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                PTE Bridge Templates · Write <b>2 times daily</b> (Discussion Type + Problems/Solutions) in under 6 mins.
              </p>
            </div>

            {/* Repeat Buttons (Discussion + Problems/Solutions) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleSetCount('essay_template', essayCount >= 1 ? 0 : 1)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  essayCount >= 1
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#0e1729] text-[#a9b5d0] border-[#2b3856] hover:border-amber-400'
                }`}
              >
                {essayCount >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                <span>R1: Discussion</span>
              </button>

              <button
                onClick={() => handleSetCount('essay_template', essayCount >= 2 ? 1 : 2)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  essayCount >= 2
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#0e1729] text-[#a9b5d0] border-[#2b3856] hover:border-amber-400'
                }`}
              >
                {essayCount >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                <span>R2: Prob/Sol</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60">
            <button
              onClick={() => {
                setActiveModal('essay_template');
                setTypedEssayText('');
                setTypingTimer(0);
                setIsTypingActive(false);
              }}
              className="w-full py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Speed-Typing Lab (2 Templates)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: TONGUE TWISTERS (50 TWISTERS) ================= */}
      {activeModal === 'tongue_twister' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    50 Tongue Twisters Enunciation Lab (2x Daily)
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
            <div className="p-4 bg-[#0e1729] border-b border-[#2b3856] flex flex-wrap items-center justify-between gap-3">
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
                  className="w-full bg-[#141c31] border border-[#2b3856] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400 placeholder:text-[#a9b5d0]/50"
                />
              </div>
            </div>

            {/* 50 Twisters List */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {filteredTwisters.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0e1729] border border-[#2b3856] hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                            : 'bg-[#1e2a47] hover:bg-[#28375c] text-[#a9b5d0] hover:text-white border-[#2b3856]'
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
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{twisterCount} / {twisterTarget} reps</b>
              </span>
              <button
                onClick={() => {
                  handleSetCount('tongue_twister', Math.min(twisterTarget, twisterCount + 1));
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

      {/* ================= MODAL 2: ACADEMIC COLLOCATIONS (100 / Day) ================= */}
      {activeModal === 'academic_collocations' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    Pearson Academic Collocations (100 / Day Target)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE Reading & Writing FIB High-Yield List · Target: 100 Collocations Daily
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

            {/* Toolbar: Batches, Search & Quick Actions */}
            <div className="p-4 bg-[#0e1729] border-b border-[#2b3856] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#a9b5d0]">Batch:</span>
                <button
                  onClick={() => setSelectedBatch('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedBatch === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  All (150+)
                </button>
                <button
                  onClick={() => setSelectedBatch('1')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedBatch === '1'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  #1–50
                </button>
                <button
                  onClick={() => setSelectedBatch('2')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedBatch === '2'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  #51–100
                </button>
                <button
                  onClick={() => setSelectedBatch('3')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedBatch === '3'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  #101–150
                </button>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#a9b5d0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={collocationQuery}
                  onChange={(e) => setCollocationQuery(e.target.value)}
                  placeholder="Search collocations or part of speech..."
                  className="w-full bg-[#141c31] border border-[#2b3856] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#edf2ff] focus:outline-none focus:border-purple-400 placeholder:text-[#a9b5d0]/50"
                />
              </div>
            </div>

            {/* Collocations Grid */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCollocations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#0e1729] border border-[#2b3856] hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e2a47] text-[#a9b5d0]">
                        #{item.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                        {item.pos1.toUpperCase()} + {item.pos2.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#edf2ff]">
                        {item.addition && <span className="text-purple-400 font-normal">{item.addition} </span>}
                        <span className="text-purple-300">{item.component1}</span> {item.component2}
                        {item.addition2 && <span className="text-purple-400 font-normal"> {item.addition2}</span>}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-[#2b3856]/40 flex items-center justify-between">
                      <span className="text-[10px] text-[#a9b5d0]">Pearson Academic Core</span>
                      <button
                        onClick={() => handleSpeak(item.id, `${item.component1} ${item.component2}`)}
                        className="text-[#a9b5d0] hover:text-white p-1"
                        title="Pronounce collocation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Progress & Batch Update */}
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#a9b5d0]">
                  Logged today: <b className="text-white">{collocCount} / {collocTarget} Collocations</b>
                </span>
                <span className={`text-xs font-bold ${isCollocFulfilled ? 'text-emerald-400' : 'text-purple-400'}`}>
                  ({Math.min(100, Math.round((collocCount / collocTarget) * 100))}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetCount('academic_collocations', collocCount + 25)}
                  className="px-3 py-1.5 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-xs font-semibold text-[#edf2ff] transition-colors cursor-pointer"
                >
                  +25 Studied
                </button>
                <button
                  onClick={() => {
                    handleSetCount('academic_collocations', 100);
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark All 100 Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ESSAY TEMPLATES SPEED TYPING LAB (2x Daily) ================= */}
      {activeModal === 'essay_template' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    PTE Bridge Essay Templates Speed-Typing Lab (2x Daily)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE Bridge Official Templates · 1. Discussion Type & 2. Problems and Solutions Type
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

            {/* Template Selector Tabs */}
            <div className="p-3 bg-[#0e1729] border-b border-[#2b3856] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEssayType('discussion');
                    setTypedEssayText('');
                    setTypingTimer(0);
                    setIsTypingActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedEssayType === 'discussion'
                      ? 'bg-amber-500 text-slate-900 shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  <span>Template 1: Discussion Type</span>
                  {essayCount >= 1 && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedEssayType('problems_solutions');
                    setTypedEssayText('');
                    setTypingTimer(0);
                    setIsTypingActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedEssayType === 'problems_solutions'
                      ? 'bg-amber-500 text-slate-900 shadow-sm'
                      : 'bg-[#141c31] text-[#a9b5d0] border border-[#2b3856] hover:text-white'
                  }`}
                >
                  <span>Template 2: Problems & Solutions</span>
                  {essayCount >= 2 && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => handleCopyTemplate(activeEssay.fullText)}
                className="px-3 py-1.5 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-xs font-semibold text-[#edf2ff] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied Template!' : 'Copy Template'}</span>
              </button>
            </div>

            {/* Template Reference Bar */}
            <div className="px-5 py-2.5 bg-[#10182b] border-b border-[#2b3856] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-5">
                <div>
                  <span className="text-[#a9b5d0] block text-[10px]">Speed Timer:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {Math.floor(typingTimer / 60)}:{(typingTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <span className="text-[#a9b5d0] block text-[10px]">Words Typed:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {typedWordCount} words
                  </span>
                </div>
                <div>
                  <span className="text-[#a9b5d0] block text-[10px]">Target Length:</span>
                  <span className="font-semibold text-emerald-400 text-xs">
                    220–260 words (&lt; 6 mins)
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-amber-300 font-semibold">
                Current: {activeEssay.name}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Structure Reference Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#edf2ff] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" /> PTE Bridge 4-Paragraph Structure:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeEssay.sections.map((sec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#0e1729] border border-[#2b3856] space-y-1.5">
                      <span className="font-bold text-amber-300 block text-[11px]">
                        {sec.title}
                      </span>
                      <div className="text-[11px] text-[#a9b5d0] space-y-1">
                        {sec.points.map((pt, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {pt}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speed-Typing Practice Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#edf2ff]">
                    Type Template From Memory ({selectedEssayType === 'discussion' ? 'Practice Rep #1' : 'Practice Rep #2'}):
                  </label>
                  {!isTypingActive && typedEssayText.length === 0 && (
                    <span className="text-[11px] text-amber-400">Start typing to auto-start timer</span>
                  )}
                </div>

                <textarea
                  value={typedEssayText}
                  onChange={(e) => {
                    setTypedEssayText(e.target.value);
                    if (!isTypingActive && e.target.value.length > 0) {
                      setIsTypingActive(true);
                    }
                  }}
                  placeholder={`Start typing ${activeEssay.name} here from memory...`}
                  className="w-full h-40 bg-[#0e1729] border border-[#2b3856] rounded-2xl p-4 text-xs text-[#edf2ff] focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{essayCount} / {essayTarget} essay reps</b>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTypedEssayText('');
                    setTypingTimer(0);
                    setIsTypingActive(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-xs font-semibold text-[#a9b5d0] hover:text-white transition-colors cursor-pointer"
                >
                  Clear & Retry
                </button>
                <button
                  onClick={() => {
                    handleSetCount('essay_template', Math.min(essayTarget, essayCount + 1));
                    if (selectedEssayType === 'discussion' && essayCount === 0) {
                      setSelectedEssayType('problems_solutions');
                    } else {
                      setActiveModal(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark This Essay Written (+1)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
