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
    <div className="rounded-3xl bg-[#151d2e] border border-slate-800 p-5 sm:p-7 space-y-6 shadow-sm relative overflow-hidden text-slate-200">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-xl bg-rose-950/50 text-rose-300 font-bold text-xs border border-rose-800/60 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              14–15 Hours Daily Protocol
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-950/50 text-blue-300 font-bold text-xs border border-blue-800/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Study Day {dayNumber} · Exam: {formatDateFriendly(FINAL_TARGET_DATE)} ({daysRemaining}d Left)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>High-Yield Daily Command Center</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 font-bold">
              Target Overall: {DEFAULT_TARGET_SCORES.overall}+
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Balanced Protocol: <b>2 Mock Exams (120 Qs) + 2h Deep Review</b> + <b>1 Daily Section Test</b> + <b>153 Practice Questions</b> (PTE Bridge). Total: <b>273 Questions Daily</b> in 14.5 Hours.
          </p>
        </div>

        {/* Progress Pill Card */}
        <div className="bg-[#0d131f] p-3.5 rounded-2xl border border-slate-800 shrink-0 text-right min-w-[220px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Day {dayNumber} Execution:</span>
            <span className="font-bold text-emerald-400">{completedHours.toFixed(1)} / 14.5 Hours</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-1.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedHours / 14.5) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {completedCount} of 7 Blocks Completed ({Math.round((completedCount / 7) * 100)}%)
          </span>
        </div>
      </div>

      {/* Target Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 text-center">
          <span className="text-[10px] text-red-400 font-bold uppercase block">Speaking Summit</span>
          <span className="text-xl font-extrabold text-slate-100">87</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Fluency &amp; Acoustic Projection</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 text-center">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">Writing Elite</span>
          <span className="text-xl font-extrabold text-slate-100">84</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Zero Typos + WFD Dictation</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 text-center">
          <span className="text-[10px] text-amber-400 font-bold uppercase block">Reading Focus</span>
          <span className="text-xl font-extrabold text-slate-100">69</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">R/W Dropdowns &amp; Collocations</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 text-center">
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">Listening Focus</span>
          <span className="text-xl font-extrabold text-slate-100">68</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">SST Templates &amp; HIW Reflexes</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800 text-center">
          <span className="text-[10px] text-blue-400 font-bold uppercase block">Daily Questions</span>
          <span className="text-xl font-extrabold text-blue-400">273 Qs</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">120 Mocks + 153 Practice</span>
        </div>
      </div>

      {/* 7 Power Blocks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            14.5-Hour Daily Master Blocks (Fixed 2 Mocks + Section Test + 153 Practice Qs)
          </h3>
          <span className="text-[11px] text-slate-400">
            Total: 7 Blocks · 14.5 Study Hours · 2h 15m Strategic Breaks
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
                    ? 'bg-emerald-950/20 border-emerald-800/60 shadow-sm'
                    : 'bg-[#0d131f] border-slate-800 hover:border-slate-700 shadow-sm'
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
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                          : 'bg-[#151d2e] border-slate-700 text-slate-500 hover:border-slate-500 shadow-xs'
                      }`}
                      title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-100">
                          Block {block.blockNumber} ({block.durationHours}h)
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/60">
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
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#151d2e] border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Tasks' : 'View Tasks'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800 space-y-3 text-xs bg-[#151d2e]/80 rounded-b-2xl">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                        High-Yield Core Action Checklist:
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {block.coreTasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2 text-[11px]">
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
