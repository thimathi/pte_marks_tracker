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
  ExternalLink,
  Flame,
  Clock,
  Copy,
  Check,
  Search,
  Timer,
  RefreshCw,
  X,
  Volume2
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { DEFAULT_ADDITIONAL_EXERCISES } from '../../config/constants';
import {
  TONGUE_TWISTERS_COLLECTION,
  ACADEMIC_COLLOCATIONS_COLLECTION,
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

  // Tongue Twister Timer
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  // Collocations Search Filter
  const [collocationQuery, setCollocationQuery] = useState('');
  const [revealedCollocations, setRevealedCollocations] = useState<Record<string, boolean>>({});

  // Essay Template Typing Practice
  const [typedEssayText, setTypedEssayText] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [typingTimer, setTypingTimer] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);

  // Timer effect for tongue twisters
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

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

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(PTE_ESSAY_TEMPLATE.fullTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleToggleCollocation = (colloc: string) => {
    setRevealedCollocations((prev) => ({
      ...prev,
      [colloc]: !prev[colloc]
    }));
  };

  const filteredCollocations = ACADEMIC_COLLOCATIONS_COLLECTION.filter((c) =>
    c.collocation.toLowerCase().includes(collocationQuery.toLowerCase()) ||
    c.meaning.toLowerCase().includes(collocationQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(collocationQuery.toLowerCase())
  );

  // Word count for typed essay
  const typedWordCount = typedEssayText.trim() === '' ? 0 : typedEssayText.trim().split(/\s+/).length;

  // Calculate total counts
  const twisterRecord = dayExercises['tongue_twister'];
  const twisterTarget = studyPlan.additionalExerciseTargets?.['tongue_twister'] ?? 2;
  const twisterCount = twisterRecord?.completedCount ?? 0;

  const collocRecord = dayExercises['academic_collocations'];
  const collocTarget = studyPlan.additionalExerciseTargets?.['academic_collocations'] ?? 2;
  const collocCount = collocRecord?.completedCount ?? 0;

  const essayRecord = dayExercises['essay_template'];
  const essayTarget = studyPlan.additionalExerciseTargets?.['essay_template'] ?? 3;
  const essayCount = essayRecord?.completedCount ?? 0;

  const totalCompletedRepeats = Math.min(twisterCount, twisterTarget) + Math.min(collocCount, collocTarget) + Math.min(essayCount, essayTarget);
  const totalRequiredRepeats = twisterTarget + collocTarget + essayTarget;
  const isAllTasksFulfilled = twisterCount >= twisterTarget && collocCount >= collocTarget && essayCount >= essayTarget;

  const handleSetCount = async (exerciseId: string, newCount: number) => {
    const safeCount = Math.max(0, newCount);
    await updateExerciseCount(dayNumber, exerciseId, safeCount);
  };

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
            Build subconscious oral fluency, collocation memory, and essay speed before your exam. Each task requires exact daily repeats.
          </p>
        </div>

        {/* Overall Drill Progress Pill */}
        <div className="flex items-center gap-2.5 self-start">
          <div className="text-right">
            <span className="text-xs font-bold text-[#edf2ff] block">
              {totalCompletedRepeats} / {totalRequiredRepeats} Repeats
            </span>
            <span className="text-[10px] text-[#a9b5d0]">
              {Math.round((totalCompletedRepeats / totalRequiredRepeats) * 100)}% Fulfilled
            </span>
          </div>
          <div className="w-16 h-2 rounded-full bg-[#0e1729] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAllTasksFulfilled ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (totalCompletedRepeats / totalRequiredRepeats) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Core Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task 1: Tongue Twisters (2x) */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          twisterCount >= twisterTarget
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-blue-500/40'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Speaking Drill
              </span>
              <span className={`text-xs font-bold ${twisterCount >= twisterTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                {twisterCount} / {twisterTarget} Repeats
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Tongue Twisters Enunciation</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Repeat study <b>2 times daily</b> for acoustic fluency, speech rhythm, and zero hesitations in Read Aloud.
              </p>
            </div>

            {/* Repeat Checkboxes */}
            <div className="flex items-center gap-2 pt-2">
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
                    <span>Repeat {num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setActiveModal('tongue_twister');
                setTimerSeconds(30);
                setTimerRunning(false);
              }}
              className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Practice Twisters Lab</span>
            </button>
          </div>
        </div>

        {/* Task 2: Academic Collocations words (2x) */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          collocCount >= collocTarget
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-purple-500/40'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Reading & Writing
              </span>
              <span className={`text-xs font-bold ${collocCount >= collocTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                {collocCount} / {collocTarget} Repeats
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Academic Collocations Words</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Repeat study <b>2 times daily</b> to secure 100% accuracy in Reading & Writing Fill in the Blanks.
              </p>
            </div>

            {/* Repeat Checkboxes */}
            <div className="flex items-center gap-2 pt-2">
              {Array.from({ length: collocTarget }, (_, i) => i + 1).map((num) => {
                const isChecked = collocCount >= num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSetCount('academic_collocations', isChecked ? num - 1 : num)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-[#0e1729] text-[#a9b5d0] border-[#2b3856] hover:border-purple-400'
                    }`}
                  >
                    {isChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>Repeat {num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60 flex items-center justify-between gap-2">
            <button
              onClick={() => setActiveModal('academic_collocations')}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Word Bank</span>
            </button>
          </div>
        </div>

        {/* Task 3: Write Essay Template (3x) */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
          essayCount >= essayTarget
            ? 'bg-[#10192c] border-emerald-500/30 shadow-md shadow-emerald-500/5'
            : 'bg-[#12192b] border-[#2b3856] hover:border-amber-500/40'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <PenTool className="w-3 h-3" /> Writing Mastery
              </span>
              <span className={`text-xs font-bold ${essayCount >= essayTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
                {essayCount} / {essayTarget} Repeats
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#edf2ff]">Write Essay Template</h3>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Repeat study <b>3 times daily</b> to build pure muscle memory, perfect discourse, and type in under 6 mins.
              </p>
            </div>

            {/* Repeat Checkboxes (1, 2, 3) */}
            <div className="flex items-center gap-1.5 pt-2">
              {Array.from({ length: essayTarget }, (_, i) => i + 1).map((num) => {
                const isChecked = essayCount >= num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSetCount('essay_template', isChecked ? num - 1 : num)}
                    className={`flex-1 py-1.5 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-[#0e1729] text-[#a9b5d0] border-[#2b3856] hover:border-amber-400'
                    }`}
                  >
                    {isChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>R{num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b3856]/60 flex items-center justify-between gap-2">
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
              <span>Speed-Typing Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: TONGUE TWISTERS PRACTICE ================= */}
      {activeModal === 'tongue_twister' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    Tongue Twisters Enunciation Lab (2x Daily)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE AI Oral Fluency Drill · Target: Continuous Speech Flow
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Timer Bar */}
              <div className="p-4 rounded-2xl bg-[#0e1729] border border-[#2b3856] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-xs text-[#a9b5d0] block">Enunciation Speed Timer:</span>
                    <span className="text-2xl font-extrabold text-[#edf2ff] font-mono">
                      00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    {timerRunning ? 'Pause Timer' : 'Start 30s Drill'}
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(30);
                    }}
                    className="p-2 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-[#a9b5d0] hover:text-white transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Twisters Cards */}
              <div className="space-y-3">
                {TONGUE_TWISTERS_COLLECTION.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#0e1729] border border-[#2b3856] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Drill #{idx + 1} · {item.category}
                      </span>
                      <span className="text-[10px] text-[#a9b5d0]">{item.focus}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#edf2ff] leading-relaxed">
                      "{item.text}"
                    </p>
                    <p className="text-[11px] text-[#a9b5d0] italic">
                      💡 {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{twisterCount} / {twisterTarget} repeats</b>
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

      {/* ================= MODAL 2: ACADEMIC COLLOCATIONS WORD BANK ================= */}
      {activeModal === 'academic_collocations' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    Academic Collocations Words Bank (2x Daily)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE Reading & Writing FIB High-Yield Pairs · Tap any card to test recall
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter bar */}
            <div className="p-4 bg-[#0e1729] border-b border-[#2b3856]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#a9b5d0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={collocationQuery}
                  onChange={(e) => setCollocationQuery(e.target.value)}
                  placeholder="Search collocations, verb+noun pairs, or meanings..."
                  className="w-full bg-[#141c31] border border-[#2b3856] rounded-xl pl-9 pr-4 py-2 text-xs text-[#edf2ff] focus:outline-none focus:border-purple-400 placeholder:text-[#a9b5d0]/50"
                />
              </div>
            </div>

            {/* Collocations Grid */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCollocations.map((item, idx) => {
                  const isRevealed = revealedCollocations[item.collocation] ?? true;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleCollocation(item.collocation)}
                      className="p-4 rounded-xl bg-[#0e1729] border border-[#2b3856] hover:border-purple-500/50 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-300">
                          {item.collocation}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {item.type}
                        </span>
                      </div>

                      {isRevealed ? (
                        <div className="text-xs space-y-1 pt-1 border-t border-[#2b3856]/50">
                          <p className="text-[#edf2ff]">{item.meaning}</p>
                          <p className="text-[11px] text-[#a9b5d0] italic">
                            e.g. "{item.example}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#a9b5d0] block pt-1 italic">
                          Click to reveal definition & example
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{collocCount} / {collocTarget} repeats</b>
              </span>
              <button
                onClick={() => {
                  handleSetCount('academic_collocations', Math.min(collocTarget, collocCount + 1));
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

      {/* ================= MODAL 3: ESSAY TEMPLATE SPEED TYPING LAB ================= */}
      {activeModal === 'essay_template' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141c31] border border-[#2b3856] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#2b3856] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#edf2ff]">
                    Write Essay Template Speed-Typing Lab (3x Daily)
                  </h3>
                  <p className="text-xs text-[#a9b5d0]">
                    PTE 79+ Standard 4-Paragraph Structure · Type in under 6 minutes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#a9b5d0] hover:text-white hover:bg-[#202d4b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Reference Bar */}
            <div className="p-4 bg-[#0e1729] border-b border-[#2b3856] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[#a9b5d0] block text-[10px]">Timer:</span>
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
                  <span className="text-[#a9b5d0] block text-[10px]">Speed Goal:</span>
                  <span className="font-semibold text-emerald-400 text-xs">
                    &lt; 6 mins (220+ words)
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyTemplate}
                className="px-3 py-1.5 rounded-xl bg-[#1e2a47] hover:bg-[#28375c] text-xs font-semibold text-[#edf2ff] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied Template!' : 'Copy Template'}</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Reference Structure Accordion */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#edf2ff] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" /> 4-Paragraph Reference Template:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PTE_ESSAY_TEMPLATE.structure.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0e1729] border border-[#2b3856] space-y-1">
                      <span className="font-bold text-amber-300 block text-[11px]">{item.paragraph}</span>
                      <p className="text-[11px] text-[#a9b5d0] leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speed-Typing Practice Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#edf2ff]">
                    Type From Memory (Practice Repeat #{Math.min(essayTarget, essayCount + 1)}):
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
                  placeholder="It is often argued that [TOPIC]... (Type the full template from memory as fast and accurately as possible)"
                  className="w-full h-44 bg-[#0e1729] border border-[#2b3856] rounded-2xl p-4 text-xs text-[#edf2ff] focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2b3856] bg-[#0e1729]/80 flex items-center justify-between">
              <span className="text-xs text-[#a9b5d0]">
                Logged today: <b className="text-white">{essayCount} / {essayTarget} repeats</b>
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
        </div>
      )}
    </div>
  );
};
