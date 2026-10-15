import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, User, LogOut, Flame, Menu, X, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePteData } from '../../context/PteDataContext';
import { SyncIndicator } from '../common/SyncIndicator';
import { formatDateFriendly } from '../../utils/dateUtils';
import { calculateStreak } from '../../utils/scoring';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { studyPlan, currentDay, currentDayData, days, selectDay } = usePteData();
  const streak = calculateStreak(days);

  return (
    <header className="sticky top-0 z-30 bg-[#0b1020]/90 backdrop-blur-md border-b border-[#2b3856] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[#edf2ff]">PTE Academic</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">21-Day</span>
              </div>
              <p className="text-[11px] text-[#a9b5d0] leading-none">Target 79+ Progress Engine</p>
            </div>
          </Link>
        </div>

        {/* Center: Current Day Switcher & Streak */}
        <div className="hidden md:flex items-center gap-3">
          {/* Day Selector Pill */}
          <div className="flex items-center gap-2 bg-[#141c31] border border-[#2b3856] rounded-xl px-3 py-1.5">
            <span className="text-xs text-[#a9b5d0]">Active View:</span>
            <select
              value={currentDay}
              onChange={(e) => selectDay(Number(e.target.value))}
              className="bg-[#0e1729] text-xs font-semibold text-[#80a7ff] rounded-lg px-2 py-1 border border-[#3a4b70] focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* Right: Sync Status & User Profile */}
        <div className="flex items-center gap-3">
          <SyncIndicator />

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-[#edf2ff] truncate max-w-[140px]">{user.email}</p>
                <p className="text-[10px] text-[#a9b5d0]">Authenticated</p>
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
    </header>
  );
};
