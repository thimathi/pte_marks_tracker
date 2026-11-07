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
import { TOTAL_MOCK_TARGET, TOTAL_STUDY_DAYS, getMockExamsForDay } from '../../config/constants';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();
  const streak = calculateStreak(days);

  // Calculate completion status of each of the 4 mocks for today
  const mockKeys = getMockExamsForDay(currentDay);
  const todayMockStatuses = mockKeys.map((key, idx) => {
    const mockRec = currentDayData?.mockExams?.[key];
    const revRec = currentDayData?.mockReviews?.[`review0${idx + 1}`];
    const isMockDone = !!mockRec?.isCompleted;
    const isRevDone = !!revRec?.isCompleted;
    return {
      index: idx + 1,
      key,
      isMockDone,
      isRevDone,
      isFullyDone: isMockDone && isRevDone,
      score: mockRec?.overallScore
    };
  });

  const totalDays = studyPlan?.durationDays || TOTAL_STUDY_DAYS;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mock-exams', label: 'Mock Exam Center', icon: GraduationCap, badge: 'VIP Full Tests' },
    { to: '/practice', label: 'Daily Drills & Templates', icon: Layers, badge: 'Collocations · Templates' },
    { to: '/review', label: 'RA & Review Center', icon: CheckSquare, badge: 'Mandatory' },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Top Bar */}
      <div className="px-3 sm:px-5 lg:px-6 py-2.5">
        <div className="flex items-center justify-between max-w-[1720px] mx-auto gap-4">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-sm">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 whitespace-nowrap">
                    PTE Marks Tracker
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 whitespace-nowrap">
                    15h Master Protocol
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight truncate">
                  Start: {formatDateFriendly(studyPlan?.startDate || '2026-11-04')} · {totalDays} Days · Target S:{studyPlan?.targetScores?.speaking || 87} · W:{studyPlan?.targetScores?.writing || 84} · Overall {studyPlan?.targetScores?.overall || 78}+
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Center: Primary Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 rounded bg-white text-blue-700 border border-slate-200 font-medium">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Center-Right: Active View Day Switcher & Streak */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Today's Mock Exams Mini Status Indicator */}
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1" title="Today's Mock Exams Status">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Mocks:</span>
              {todayMockStatuses.map((m) => (
                <Link
                  key={m.key}
                  to="/mock-exams"
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 ${
                    m.isFullyDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : m.isMockDone
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                  title={`Mock ${m.index}: ${m.isFullyDone ? 'Completed & Reviewed' : m.isMockDone ? 'Review Pending!' : 'Pending'}`}
                >
                  {m.isFullyDone ? '✓' : `M${m.index}`}
                </Link>
              ))}
            </div>

            {/* Day Selector Pill */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1">
              <span className="text-xs text-slate-500">Day:</span>
              <select
                value={currentDay}
                onChange={(e) => selectDay(Number(e.target.value))}
                className="bg-white text-xs font-semibold text-blue-700 rounded-lg px-2 py-1 border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {Array.from({ length: studyPlan.durationDays || TOTAL_STUDY_DAYS }, (_, i) => i + 1).map((d) => {
                  const dayStatus = days[d]?.status;
                  const isUnlocked = days[d]?.gateStatus?.isUnlocked ?? (d === 1);
                  return (
                    <option key={d} value={d}>
                      Day {d} {dayStatus === 'completed' ? '✓' : !isUnlocked ? '🔒' : ''}
                    </option>
                  );
                })}
              </select>
              <span className="text-xs text-slate-500 flex items-center gap-1 border-l border-slate-200 pl-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDateFriendly(currentDayData?.date || studyPlan.startDate)}
              </span>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}d</span>
            </div>
          </div>

          {/* Right: Sync Status & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SyncIndicator />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">{user.email}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Authenticated</p>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Quick Navigation Bar for Mobile and Medium Screens */}
      <div className="2xl:hidden border-t border-slate-200 bg-slate-50 px-3 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max max-w-[1720px] mx-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
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
