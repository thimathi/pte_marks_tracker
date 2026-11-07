import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { DAILY_15H_MASTER_SCHEDULE, DailyMasterBlock, DEFAULT_TARGET_SCORES, FINAL_TARGET_DATE } from '../../config/constants';
import { formatDateFriendly, getDaysRemainingUntilDeadline } from '../../utils/dateUtils';

interface DailyMaster15HourPlanCardProps {
  dayNumber: number;
}

export const DailyMaster15HourPlanCard: React.FC<DailyMaster15HourPlanCardProps> = ({ dayNumber }) => {
  const [completedBlocks, setCompletedBlocks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`pte_15h_day_${dayNumber}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [expandedBlock, setExpandedBlock] = useState<number | null>(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`pte_15h_day_${dayNumber}`);
      setCompletedBlocks(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedBlocks({});
    }
  }, [dayNumber]);

  const toggleBlock = (blockNum: number) => {
    setCompletedBlocks((prev) => {
      const updated = { ...prev, [blockNum]: !prev[blockNum] };
      try {
        localStorage.setItem(`pte_15h_day_${dayNumber}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save 15h progress', e);
      }
      return updated;
    });
  };

  const completedCount = Object.values(completedBlocks).filter(Boolean).length;
  const completedHours = DAILY_15H_MASTER_SCHEDULE.reduce((sum, b) => {
    return sum + (completedBlocks[b.blockNumber] ? b.durationHours : 0);
  }, 0);

  const daysRemaining = getDaysRemainingUntilDeadline(FINAL_TARGET_DATE);

  const getSkillIcon = (skill: DailyMasterBlock['targetSkill']) => {
    switch (skill) {
      case 'speaking':
        return <Mic className="w-4 h-4 text-red-400" />;
      case 'writing':
        return <PenTool className="w-4 h-4 text-emerald-400" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'listening':
        return <Headphones className="w-4 h-4 text-purple-400" />;
      case 'mock':
        return <Award className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#12192e] via-[#0f172a] to-[#141d36] border border-blue-500/30 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              14–15 Hours Intensive Daily Protocol
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Study Day {dayNumber} · Exam: {formatDateFriendly(FINAL_TARGET_DATE)} ({daysRemaining}d Left)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>High-Yield Daily Command Center</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Target Overall: {DEFAULT_TARGET_SCORES.overall}+
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Asymmetrical score maximization architecture: Heavy morning acoustic immersion for <b>Speaking 87</b>, strict typing &amp; WFD dictation for <b>Writing 84</b>, high-yield collocations for <b>Reading 69</b>, and auditory reflexes for <b>Listening 68</b>.
          </p>
        </div>

        {/* Progress Pill Card */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0 text-right min-w-[220px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Day {dayNumber} Execution:</span>
            <span className="font-bold text-emerald-400">{completedHours.toFixed(1)} / 15.0 Hours</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden mb-1.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-red-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedHours / 15) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {completedCount} of 6 Power Blocks Completed ({Math.round((completedCount / 6) * 100)}%)
          </span>
        </div>
      </div>

      {/* Target Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/40 text-center">
          <span className="text-[10px] text-red-300 font-bold uppercase block">Speaking Summit</span>
          <span className="text-xl font-extrabold text-red-400">87</span>
          <span className="text-[10px] text-red-200/80 block mt-0.5">Continuous Fluency (No Pauses)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
          <span className="text-[10px] text-emerald-300 font-bold uppercase block">Writing Elite</span>
          <span className="text-xl font-extrabold text-emerald-400">84</span>
          <span className="text-[10px] text-emerald-200/80 block mt-0.5">Zero Typos + WFD 100% Match</span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300 font-bold uppercase block">Reading Focus</span>
          <span className="text-xl font-extrabold text-amber-300">69</span>
          <span className="text-[10px] text-amber-200/80 block mt-0.5">R/W Dropdowns &amp; Collocations</span>
        </div>

        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-center">
          <span className="text-[10px] text-purple-300 font-bold uppercase block">Listening Focus</span>
          <span className="text-xl font-extrabold text-purple-300">68</span>
          <span className="text-[10px] text-purple-200/80 block mt-0.5">SST Templates &amp; HIW 1.2x Speed</span>
        </div>

        <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/40 text-center">
          <span className="text-[10px] text-blue-300 font-bold uppercase block">Overall Mission</span>
          <span className="text-xl font-extrabold text-blue-400">78+</span>
          <span className="text-[10px] text-blue-200/80 block mt-0.5">Summit Target Dec 10</span>
        </div>
      </div>

      {/* 6 Power Blocks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            15-Hour Master Daily Blocks (Check off as you complete each session)
          </h3>
          <span className="text-[11px] text-slate-400">
            Total: 6 Blocks · 15.0 Study Hours · 2h 15m Strategic Breaks
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DAILY_15H_MASTER_SCHEDULE.map((block) => {
            const isDone = !!completedBlocks[block.blockNumber];
            const isExpanded = expandedBlock === block.blockNumber;

            return (
              <div
                key={block.blockNumber}
                className={`rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Block Header */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleBlock(block.blockNumber)}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                      title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">
                          Block {block.blockNumber} ({block.durationHours}h)
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {block.timeSlot}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${block.badgeColor}`}>
                          {block.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                        {getSkillIcon(block.targetSkill)}
                        <span>{block.title}</span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedBlock(isExpanded ? null : block.blockNumber)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Tasks' : 'View Tasks'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/70 space-y-3 text-xs">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                        High-Yield Core Action Checklist:
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {block.coreTasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[11px]">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-slate-300">
                        <b className="text-amber-300">Efficiency Golden Rule:</b> {block.efficiencyRule}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
