import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Target,
  User,
  LogOut,
  Flame,
  Menu,
  X,
  Calendar,
  Layers,
  GraduationCap,
  Map,
  CheckSquare,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePteData } from '../../context/PteDataContext';
import { SyncIndicator } from '../common/SyncIndicator';
import { formatDateFriendly } from '../../utils/dateUtils';
import { calculateStreak, calculateDayBreakdown } from '../../utils/scoring';
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, PHASE_DEFINITIONS } from '../../config/constants';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();
  const streak = calculateStreak(days);

  // Calculate completion status of each of the 5 phases for today
  const breakdown = calculateDayBreakdown(currentDayData, studyPlan.questionTargets);
  const phaseStatuses = PHASE_DEFINITIONS.map((phase) => {
    const mockKey = `mock0${phase.mockIndex + 1}`;
    const mockDone = !!currentDayData?.mockExams?.[mockKey]?.isCompleted;

    // Check practice questions for this phase (20 questions)
    let phaseQuestionsScored = 0;
    phase.questionTypes.forEach((qt) => {
      const attempts = currentDayData?.questionProgress?.[qt.typeId]?.attempts || {};
      for (let i = 0; i < qt.count; i++) {
        if (attempts[i]?.score !== null && attempts[i]?.score !== undefined) {
          phaseQuestionsScored++;
        }
      }
    });

    const isDone = mockDone && phaseQuestionsScored >= phase.questionCount;
    return {
      phaseNumber: phase.phaseNumber,
      isDone,
      mockDone,
      questionsScored: phaseQuestionsScored,
      totalQuestions: phase.questionCount
    };
  });

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: '5-Phase Plan', icon: Layers, badge: '5 Phases' },
    { to: '/mock-exams', label: 'Mock Exams', icon: GraduationCap, badge: '5/Day' },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/review', label: 'Review', icon: CheckSquare },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0b1020]/95 backdrop-blur-md border-b border-[#2b3856]">
      {/* Main Top Bar */}
      <div className="px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-[#141c31] border border-[#2b3856] text-[#edf2ff] hover:bg-[#19243d]"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-[#edf2ff]">PTE - Daily Study Plan</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">Superior English</span>
                  <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">5 Phases/Day</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#a9b5d0] leading-none">
                  PTE Bridge · Started {formatDateFriendly(studyPlan?.startDate || '2026-10-30')} · {studyPlan?.durationDays || TOTAL_STUDY_DAYS} Days · 5 Mocks/Day · 100 Qs/Day
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Center: Primary Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#141c31]/90 border border-[#2b3856] rounded-xl p-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'text-[#a9b5d0] hover:text-[#edf2ff] hover:bg-[#1a253e]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 rounded bg-[#253655] text-blue-300 border border-[#3a4b70]/60">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Center-Right: Active View Day Switcher & Streak */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* 5-Phase Mini Status Indicator */}
            <div className="flex items-center gap-1 bg-[#141c31] border border-[#2b3856] rounded-xl px-2 py-1" title="Daily 5 Phases Progress">
              <span className="text-[10px] font-semibold text-[#a9b5d0] uppercase tracking-wider mr-1">Phases:</span>
              {phaseStatuses.map((p) => (
                <Link
                  key={p.phaseNumber}
                  to="/practice"
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 ${
                    p.isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : p.mockDone || p.questionsScored > 0
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-[#0e1729] text-[#7182a6] border border-[#2b3856]'
                  }`}
                  title={`Phase ${p.phaseNumber}: ${p.isDone ? 'Completed' : `${p.questionsScored}/${p.totalQuestions} Qs scored`}`}
                >
                  {p.isDone ? '✓' : `P${p.phaseNumber}`}
                </Link>
              ))}
            </div>

            {/* Day Selector Pill */}
            <div className="flex items-center gap-2 bg-[#141c31] border border-[#2b3856] rounded-xl px-2.5 py-1">
              <span className="text-xs text-[#a9b5d0]">Day:</span>
              <select
                value={currentDay}
                onChange={(e) => selectDay(Number(e.target.value))}
                className="bg-[#0e1729] text-xs font-semibold text-[#80a7ff] rounded-lg px-2 py-1 border border-[#3a4b70] focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                {Array.from({ length: studyPlan.durationDays || 15 }, (_, i) => i + 1).map((d) => {
                  const dayStatus = days[d]?.status;
                  const isUnlocked = days[d]?.gateStatus?.isUnlocked ?? (d === 1);
                  return (
                    <option key={d} value={d}>
                      Day {d} {dayStatus === 'completed' ? '✓' : !isUnlocked ? '🔒' : ''}
                    </option>
                  );
                })}
              </select>
              <span className="text-xs text-[#a9b5d0] flex items-center gap-1 border-l border-[#2b3856] pl-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateFriendly(currentDayData?.date || studyPlan.startDate)}
              </span>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streak}d</span>
            </div>
          </div>

          {/* Right: Sync Status & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SyncIndicator />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-medium text-[#edf2ff] truncate max-w-[130px]">{user.email}</p>
                  <p className="text-[10px] text-emerald-400">Authenticated</p>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl bg-[#141c31] border border-[#2b3856] text-[#a9b5d0] hover:text-red-400 hover:border-red-500/40 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Quick Navigation Bar for Mobile and Medium Screens */}
      <div className="xl:hidden border-t border-[#2b3856]/60 bg-[#0e172a]/95 px-3 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[#a9b5d0] hover:text-[#edf2ff] hover:bg-[#141c31]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};
