import React from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Volume2,
  FileText,
  Layers,
  Award
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { DailyDrillsCard } from '../components/drills/DailyDrillsCard';
import { getAcademicCollocationsTarget, TOTAL_STUDY_DAYS } from '../config/constants';

export const PracticePage: React.FC = () => {
  const { currentDay, studyPlan } = usePteData();
  const totalDays = studyPlan?.durationDays || TOTAL_STUDY_DAYS;
  const collocTarget = getAcademicCollocationsTarget(currentDay);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <PenTool className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Daily Core Drills & Templates Hub
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/25 font-semibold">
                PTE Bridge · Superior English
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Essential non-mock daily exercises: <b>Academic Collocations ({collocTarget} Pairs)</b>, <b>Tongue Twisters (2x)</b>, <b>Summarize Written Text (SWT)</b>, and <b>Write Essay Templates</b>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/mock-exams"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Go to 90-Mock Journey (6 Mocks/Day)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mission Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <b>Do or Die Simulation Journey:</b> Standalone 120 practice questions are decommissioned. All 5,400 questions are completed directly through the 6 Daily Timed Mock Exams with mandatory deep review!
            </span>
          </div>
          <span className="text-blue-300 font-mono text-[11px] font-semibold">
            Study Day {currentDay} of {totalDays}
          </span>
        </div>
      </div>

      {/* Main Core Drills Card Component */}
      <DailyDrillsCard dayNumber={currentDay} />

      {/* Summary Cards of the 4 Essential Daily Workflows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Drill 1: Tongue Twisters */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white">Tongue Twisters</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            50 enunciation drills repeated 2x daily for oral fluency, speed, and continuous speech.
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 block w-fit">
            2 Reps Daily
          </span>
        </div>

        {/* Drill 2: Academic Collocations */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Academic Collocations</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Forward & Backward progression (Day 1: 100, +50 each day) for R/W Fill in the Blanks.
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 block w-fit">
            {collocTarget} Pairs Target
          </span>
        </div>

        {/* Drill 3: Summarize Written Text */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">SWT Template Drill</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Official PTE Bridge single-sentence compound-complex structure for Reading & Writing scoring.
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 block w-fit">
            2 Practice Summaries
          </span>
        </div>

        {/* Drill 4: Write Essay Template */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white">Write Essay Template</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Official PTE Bridge 4-paragraph Discussion & Problem-Solution templates with typing timer.
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 block w-fit">
            1-2 Reps Daily
          </span>
        </div>
      </div>
    </div>
  );
};
