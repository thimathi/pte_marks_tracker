import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Flame,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  Filter,
  Check,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { QUESTION_TYPES, SKILL_COLORS } from '../config/constants';
import { calculatePhaseAverage, calculateQuestionTypeStats } from '../utils/scoring';
import { getPhaseRanges } from '../utils/interleaving';
import { SkillType } from '../types/pte';

export const QuestionAnalyticsPage: React.FC = () => {
  const { studyPlan, currentDay, currentDayData, updateScore } = usePteData();
  const [selectedSkill, setSelectedSkill] = useState<'all' | SkillType>('all');
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    read_aloud: true,
    repeat_sentence: true,
    rw_fill_in_blanks: true,
    write_from_dictation: true
  });
  const [savedCell, setSavedCell] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTypes = QUESTION_TYPES.filter(
    (q) => selectedSkill === 'all' || q.skill === selectedSkill || q.secondarySkill === selectedSkill
  );

  const handleScoreChange = async (typeId: string, qIdx: number, val: string) => {
    let scoreVal: number | null = null;
    if (val.trim() !== '') {
      const num = Number(val);
      if (!isNaN(num) && num >= 0 && num <= 90) {
        scoreVal = Math.round(num * 10) / 10;
      }
    }
    await updateScore(currentDay, typeId, qIdx, { score: scoreVal });
    setSavedCell(`${typeId}_${qIdx}`);
    setTimeout(() => setSavedCell(null), 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-slate-800 p-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Day {currentDay} Question-Type Analytics & Phase Scores
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Five-question phase tracking across all 16 PTE Academic question types. Decimal scores (0–90) supported.
          </p>
        </div>

        {/* Skill Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'speaking', 'writing', 'reading', 'listening'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                selectedSkill === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#10192c] text-[#a9b5d0] hover:text-[#edf2ff] border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Day 1 Practice Reschedule Notice */}
      {currentDay === 1 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Day 1 Rescheduled
                </span>
                <span className="text-xs font-bold text-[#edf2ff]">
                  Practice Questions Distributed to Days 2–17 (+19 Qs / Day)
                </span>
              </div>
              <p className="text-[11px] text-[#a9b5d0] mt-0.5">
                Practice question scoring begins on Day 2 with 319 questions per day. Today focus on Mock Exam #1 (Diagnostic Baseline 45C).
              </p>
            </div>
          </div>
          <Link
            to="/mock-exams"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 self-start sm:self-center transition-colors whitespace-nowrap"
          >
            <span>Mock Exam Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Question Types List */}
      <div className="space-y-4">
        {filteredTypes.map((meta) => {
          const target = studyPlan.questionTargets[meta.id] ?? meta.defaultTarget;
          const attempts = currentDayData?.questionProgress?.[meta.id]?.attempts || {};
          const stats = calculateQuestionTypeStats(attempts, target);
          const phases = getPhaseRanges(target);
          const isExpanded = !!expandedTypes[meta.id];
          const skillStyle = SKILL_COLORS[meta.skill];

          return (
            <div
              key={meta.id}
              className="rounded-2xl bg-[#141c31] border border-slate-800 overflow-hidden transition-all"
            >
              {/* Type Header Summary */}
              <div
                onClick={() => toggleExpand(meta.id)}
                className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-[#19243d]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${skillStyle.badge} uppercase`}>
                    {meta.shortName}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#edf2ff]">{meta.name}</h3>
                      {meta.isPrediction && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-pink-400" /> PREDICTION PRIORITY
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#a9b5d0]">{meta.description}</p>
                  </div>
                </div>

                {/* Score and Progress Metrics */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-[#a9b5d0] block">Average / 90:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {stats.average !== null ? `${stats.average.toFixed(1)}/90` : '—'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#a9b5d0] block">Scored:</span>
                    <span className="text-sm font-bold text-[#80a7ff]">
                      {stats.count} / {target} ({stats.completedPercent}%)
                    </span>
                  </div>

                  <button className="p-1.5 rounded-lg bg-[#10192c] border border-slate-800 text-[#a9b5d0]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Phase Breakdown */}
              {isExpanded && (
                <div className="p-5 pt-0 space-y-4 border-t border-slate-800/60 bg-[#0e1729]/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                    {phases.map((ph) => {
                      const phaseStat = calculatePhaseAverage(attempts, ph.startIndex, ph.endIndex);
                      const qCountInPhase = ph.endIndex - ph.startIndex;

                      return (
                        <div
                          key={ph.phaseNumber}
                          className="rounded-xl bg-[#141c31] border border-slate-800 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                            <span className="font-bold text-blue-300">
                              Phase {ph.phaseNumber} · Q{ph.startIndex + 1}–{ph.endIndex}
                            </span>
                            <span className="font-semibold text-emerald-400">
                              Phase Avg: {phaseStat.average !== null ? phaseStat.average.toFixed(1) : '—'}
                            </span>
                          </div>

                          {/* Individual question score inputs */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {Array.from({ length: qCountInPhase }, (_, j) => {
                              const qIdx = ph.startIndex + j;
                              const att = attempts[qIdx];
                              const currentVal = att?.score !== null && att?.score !== undefined ? String(att.score) : '';
                              const isSaved = savedCell === `${meta.id}_${qIdx}`;

                              return (
                                <div key={qIdx} className="flex flex-col items-center gap-1">
                                  <label className="text-[10px] text-[#a9b5d0] font-mono">
                                    Q{qIdx + 1}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="90"
                                    step="0.1"
                                    placeholder="—"
                                    defaultValue={currentVal}
                                    key={currentVal}
                                    onBlur={(e) => handleScoreChange(meta.id, qIdx, e.target.value)}
                                    className={`w-14 text-center rounded-lg py-1 text-xs font-semibold focus:outline-none transition-colors ${
                                      isSaved
                                        ? 'bg-emerald-600/30 border border-emerald-400 text-emerald-300'
                                        : currentVal !== ''
                                        ? 'bg-[#10192c] border border-blue-500/40 text-white'
                                        : 'bg-[#0b1020] border border-slate-800 text-[#a9b5d0]'
                                    }`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
