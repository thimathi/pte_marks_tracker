import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Lock
} from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS } from '../../config/constants';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentDay, days, studyPlan } = usePteData();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;
  const isDay1 = currentDay === 1;
  const currentDayLocked = !days[currentDay]?.gateStatus?.isUnlocked && currentDay > 1;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mock-exams', label: `Mock Exams (${TOTAL_MOCK_TARGET})`, icon: GraduationCap, badge: 'Priority #1', highlight: true },
    { to: '/practice', label: 'Daily Practice (10 Phases)', icon: Shuffle, badge: '300 Qs + Drills' },
    { to: '/roadmap', label: `${totalDays}-Day Roadmap`, icon: Map, badge: `${totalDays} Days` },
    { to: '/analytics/questions', label: 'Question Analytics', icon: BarChart3 },
    { to: '/review', label: 'Review Center', icon: CheckSquare },
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
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-40 h-full lg:h-[calc(100vh-61px)] w-64 bg-[#0e172a] border-r border-[#2b3856] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          {/* Day Status Card */}
          <div className="p-3 mb-3 rounded-xl bg-gradient-to-br from-[#19243d] to-[#141c31] border border-[#2b3856]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#a9b5d0] font-medium">Current Focus:</span>
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                {currentDayLocked ? <Lock className="w-4 h-4 text-red-400" /> : `D${currentDay}`}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#edf2ff]">Study Day {currentDay} of {totalDays}</p>
                <p className="text-xs text-[#a9b5d0]">
                  Target: 2 Mocks + 300 Practice Qs
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#a9b5d0] uppercase tracking-wider px-3 pt-2 pb-1">
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
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? item.highlight
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-semibold'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                        : 'text-[#a9b5d0] hover:bg-[#141c31] hover:text-[#edf2ff]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      item.highlight
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-[#253655] text-blue-300 border-[#3a4b70]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-[#2b3856]">
          <div className="p-3 rounded-xl bg-[#141c31] border border-[#2b3856]/60">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-[#edf2ff]">22-Day Intensive Plan</span>
            </div>
            <p className="text-[10px] text-[#a9b5d0]">Started: Oct 25, 2026 · 47 Mocks · 4,000+ Qs</p>
          </div>
        </div>
      </aside>
    </>
  );
};