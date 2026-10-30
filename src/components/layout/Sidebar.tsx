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
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, PHASE_DEFINITIONS } from '../../config/constants';
import { formatDateFriendly } from '../../utils/dateUtils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentDay, currentDayData, days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const currentDayLocked = !days[currentDay]?.gateStatus?.isUnlocked && currentDay > 1;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: '5-Phase Daily Plan', icon: Layers, badge: '5 Phases · 100 Qs', highlight: true },
    { to: '/mock-exams', label: `Mock Exam Center`, icon: GraduationCap, badge: '5 Mocks/Day', highlight: false },
    { to: '/roadmap', label: `${totalDays}-Day Roadmap`, icon: Map, badge: `${totalDays} Days` },
    { to: '/review', label: 'Review & Error Center', icon: CheckSquare },
    { to: '/analytics/questions', label: 'Question Analytics', icon: BarChart3 },
    { to: '/analytics', label: 'Trends & Stats', icon: LineChart },
    { to: '/calendar', label: 'Study Calendar', icon: CalendarDays },
    { to: '/report/final', label: `Final ${totalDays}-Day Report`, icon: FileText },
    { to: '/settings', label: 'Settings & Import', icon: Settings },
  ];

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
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 h-full lg:h-[calc(100vh-61px)] w-64 bg-[#0c1222] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 sm:p-4 space-y-1 overflow-y-auto">
          {/* Day Status Card */}
          <div className="p-3 mb-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Daily Focus:</span>
              <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                days[currentDay]?.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : currentDayLocked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {days[currentDay]?.status === 'completed' ? 'Completed' : currentDayLocked ? 'Locked' : 'In Progress'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentDayLocked ? <Lock className="w-4 h-4 text-red-300" /> : `D${currentDay}`}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Study Day {currentDay} of {totalDays}</p>
                <p className="text-xs text-slate-400 truncate">
                  5 Phases · 5 Mocks + 100 Qs
                </p>
              </div>
            </div>

            {/* Quick 5-Phase Progress Row */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>5 Daily Phases</span>
                <Link to="/practice" onClick={onClose} className="text-blue-400 hover:underline flex items-center">
                  <span>Open</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {PHASE_DEFINITIONS.map((p) => {
                  const mockDone = !!currentDayData?.mockExams?.[`mock0${p.mockIndex + 1}`]?.isCompleted;
                  return (
                    <Link
                      key={p.phaseNumber}
                      to="/practice"
                      onClick={onClose}
                      className={`text-center py-1 rounded text-[10px] font-bold border transition-colors ${
                        mockDone
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-blue-400'
                      }`}
                      title={`Phase ${p.phaseNumber}: ${p.mockName}`}
                    >
                      P{p.phaseNumber}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
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
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
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
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">{totalDays}-Day Sprint Plan</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Start: {formatDateFriendly(studyPlan?.startDate || '2026-10-30')} · 5 Mocks/Day · 100 Qs/Day
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
