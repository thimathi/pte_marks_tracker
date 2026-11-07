import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Shuffle,
  BarChart3,
  GraduationCap,
  CheckSquare,
  LineChart,
  CalendarDays,
  FileText,
  Settings,
  Sparkles,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, getMockExamsForDay, isReviewDay } from '../../config/constants';
import { formatDateFriendly } from '../../utils/dateUtils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentDay, currentDayData, days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const currentDayLocked = !days[currentDay]?.gateStatus?.isUnlocked && currentDay > 1;
  const isRevDay = isReviewDay(currentDay);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mock-exams', label: 'Mock Exam Center', icon: GraduationCap, badge: 'Full Tests & Drills', highlight: true },
    { to: '/review', label: 'RA & Review Center', icon: CheckSquare, badge: isRevDay ? 'Today!' : 'Mandatory' },
    { to: '/practice', label: 'Daily Drills & Templates', icon: Layers, badge: 'Core Drills' },
    { to: '/roadmap', label: `${totalDays}-Day Roadmap`, icon: Map, badge: `${totalDays} Days` },
    { to: '/analytics', label: 'Trends & Stats', icon: LineChart },
    { to: '/calendar', label: 'Study Calendar', icon: CalendarDays },
    { to: '/report/final', label: `Final ${totalDays}-Day Report`, icon: FileText },
    { to: '/settings', label: 'Settings & Import', icon: Settings },
  ];

  const mockKeys = getMockExamsForDay(currentDay);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 h-full lg:h-[calc(100vh-61px)] w-64 bg-[#151d2e] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out text-slate-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 sm:p-4 space-y-1 overflow-y-auto">
          {/* Day Status Card */}
          <div className="p-3 mb-3 rounded-xl bg-[#0d131f] border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Daily Focus:</span>
              <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                days[currentDay]?.status === 'completed'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                  : currentDayLocked
                  ? 'bg-red-950/60 text-red-300 border border-red-800/60'
                  : 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
              }`}>
                {days[currentDay]?.status === 'completed' ? 'Completed' : currentDayLocked ? 'Locked' : 'In Progress'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {currentDayLocked ? <Lock className="w-4 h-4 text-red-300" /> : `D${currentDay}`}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-100 leading-tight">Study Day {currentDay} of {totalDays}</p>
                <p className="text-xs text-slate-400 truncate">
                  {isRevDay ? '🔍 Dedicated Deep Review Day' : `${mockKeys.length} Mocks/Day · 153 Practice Qs`}
                </p>
              </div>
            </div>

            {/* Quick Mock or Review Progress Row */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>{isRevDay ? 'Deep Review Mode' : `Today's ${mockKeys.length} Mocks`}</span>
                <Link to={isRevDay ? '/review' : '/mock-exams'} onClick={onClose} className="text-blue-400 hover:underline flex items-center font-semibold">
                  <span>Open</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {isRevDay ? (
                <Link
                  to="/review"
                  onClick={onClose}
                  className="block text-center py-1.5 px-2 rounded-lg bg-purple-950/50 text-purple-300 border border-purple-800/60 text-xs font-semibold hover:bg-purple-900/40 transition-colors"
                >
                  Open Cycle Review Hub ➔
                </Link>
              ) : (
                <div className={`grid grid-cols-${mockKeys.length || 1} gap-1`}>
                  {mockKeys.map((k, idx) => {
                    const mockDone = !!currentDayData?.mockExams?.[k]?.isCompleted;
                    const revDone = !!currentDayData?.mockReviews?.[`review0${idx + 1}`]?.isCompleted;
                    return (
                      <Link
                        key={k}
                        to="/mock-exams"
                        onClick={onClose}
                        className={`text-center py-1 rounded text-[10px] font-bold border transition-colors ${
                          mockDone && revDone
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                            : mockDone
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                            : 'bg-[#151d2e] text-slate-400 border-slate-800 hover:border-blue-500'
                        }`}
                        title={`Mock ${idx + 1}: ${mockDone && revDone ? 'Done & Reviewed' : mockDone ? 'Review Pending!' : 'Pending'}`}
                      >
                        {mockDone && revDone ? '✓' : `M${idx + 1}`}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      isActive
                        ? 'bg-blue-950/60 text-blue-300 font-bold border-l-4 border-blue-500'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 font-medium'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#0d131f] text-slate-400 border border-slate-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-3 sm:p-4 border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-[#0d131f] border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">{totalDays}-Day Intensive Protocol</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Start: {formatDateFriendly(studyPlan?.startDate || '2026-11-04')} · 2 Mocks + 153 Practice · Dec 10 Exam
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
