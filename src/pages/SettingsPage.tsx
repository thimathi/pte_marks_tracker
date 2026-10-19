import React, { useState } from 'react';
import {
  Settings,
  Calendar,
  Target,
  Sliders,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { useAuth } from '../context/AuthContext';
import { scanForLegacyData, convertLegacyDayToModern, LegacyScanResult } from '../utils/legacyMigration';
import { QUESTION_TYPES, DEFAULT_ADDITIONAL_EXERCISES, TOTAL_STUDY_DAYS } from '../config/constants';

export const SettingsPage: React.FC = () => {
  const { studyPlan, updatePlan, importLegacyData } = usePteData();
  const { user, logout } = useAuth();
  const totalDays = studyPlan.durationDays || TOTAL_STUDY_DAYS;

  // Local state for study plan settings
  const [startDate, setStartDate] = useState(studyPlan.startDate);
  const [targetScores, setTargetScores] = useState({ ...studyPlan.targetScores });
  const [savedNotice, setSavedNotice] = useState(false);

  // Legacy data scan state
  const [legacyScan, setLegacyScan] = useState<LegacyScanResult | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlan({
      ...studyPlan,
      startDate,
      targetScores,
      updatedAt: new Date().toISOString()
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleScanLegacy = () => {
    const res = scanForLegacyData();
    setLegacyScan(res);
  };

  const handleMigrateLegacy = async () => {
    if (!legacyScan || legacyScan.foundDaysCount === 0) return;

    if (!confirm(`Are you sure you want to migrate ${legacyScan.foundDaysCount} legacy study day records (${legacyScan.totalScoresCount} scores) into your Firebase account? Existing days with same day numbers will be updated with your previous scores.`)) {
      return;
    }

    setMigrating(true);
    setMigrationStatus('Migrating legacy data to Firebase...');

    try {
      const convertedDays = [];
      let dayCounter = 1;

      for (const [key, val] of Object.entries(legacyScan.rawEntries)) {
        const date = key.replace('pte_daily_tracker_v3_', '');
        const dNum = val.studyDay ? Number(val.studyDay) : dayCounter;
        const converted = convertLegacyDayToModern(date, val, dNum);
        convertedDays.push(converted);
        dayCounter++;
      }

      await importLegacyData(convertedDays);
      setMigrationStatus(`✅ Success! Successfully migrated ${convertedDays.length} days into Firebase Realtime Database.`);
    } catch (err: any) {
      setMigrationStatus(`❌ Migration failed: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-[#2b3856] p-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-[#edf2ff]">
              Application Settings & Data Management
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            Configure {totalDays}-day timeline, target benchmarks, and import previous localStorage tracker data.
          </p>
        </div>

        {savedNotice && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      {/* Form: Start Date & Target Scores */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Start Date Configuration */}
        <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2b3856] pb-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">{totalDays}-Day Study Start Date</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#edf2ff] mb-1">
                Study Journey Start Date (Day 1):
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl px-3.5 py-2.5 text-xs text-[#edf2ff] focus:outline-none focus:border-blue-400"
                required
              />
              <p className="text-[11px] text-[#a9b5d0] mt-1">
                Default: 20 October 2026. Dates for Day 1 through Day {totalDays} update automatically.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1729] border border-[#2b3856] text-xs space-y-1">
              <span className="font-semibold text-blue-300">Automatic Timeline Recalculation</span>
              <p className="text-[#a9b5d0]">
                Changing the start date recalculates the calendar timeline for all {totalDays} study days while preserving all existing scores and mock exam attempts.
              </p>
            </div>
          </div>
        </div>

        {/* Target Scores Configuration */}
        <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2b3856] pb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">PTE Target Benchmarks (/ 90)</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#edf2ff] mb-1">Overall Target:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.overall}
                onChange={(e) => setTargetScores({ ...targetScores, overall: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Speaking:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.speaking}
                onChange={(e) => setTargetScores({ ...targetScores, speaking: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Writing:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.writing}
                onChange={(e) => setTargetScores({ ...targetScores, writing: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Reading:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.reading}
                onChange={(e) => setTargetScores({ ...targetScores, reading: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Listening:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.listening}
                onChange={(e) => setTargetScores({ ...targetScores, listening: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9b5d0] mb-1">Mock Exam:</label>
              <input
                type="number"
                min="50"
                max="90"
                value={targetScores.mockExam}
                onChange={(e) => setTargetScores({ ...targetScores, mockExam: Number(e.target.value) })}
                className="w-full bg-[#0e1729] border border-[#2b3856] rounded-xl p-2 text-xs font-bold text-center text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 cursor-pointer transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>

      {/* Legacy Data Migration Section */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2b3856] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-[#edf2ff]">
              Legacy HTML LocalStorage Data Importer
            </h3>
          </div>
          <span className="text-xs text-[#a9b5d0]">Safe Migration Tool</span>
        </div>

        <p className="text-xs text-[#a9b5d0] leading-relaxed">
          If you used the previous single-file HTML tracker (<code className="text-blue-300">pte_academic_75plus_question_logger</code>), this tool scans your browser's local storage for existing practice scores and gate checklists, validates them, and migrates them safely to your Firebase account.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScanLegacy}
            className="px-4 py-2 rounded-xl bg-[#243553] hover:bg-[#30476c] text-xs font-semibold text-[#edf2ff] border border-[#3a4b70] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Scan Browser Storage for Legacy Data</span>
          </button>
        </div>

        {legacyScan && (
          <div className="p-4 rounded-xl bg-[#0e1729] border border-[#2b3856] space-y-3 text-xs">
            <h4 className="font-bold text-blue-300">Scan Results:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-[#141c31]">
                <span className="text-[#a9b5d0] block text-[10px]">Found Days:</span>
                <span className="font-bold text-white text-sm">{legacyScan.foundDaysCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141c31]">
                <span className="text-[#a9b5d0] block text-[10px]">Scored Questions:</span>
                <span className="font-bold text-emerald-400 text-sm">{legacyScan.totalScoresCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141c31]">
                <span className="text-[#a9b5d0] block text-[10px]">Mock Exams:</span>
                <span className="font-bold text-purple-400 text-sm">{legacyScan.hasMockExams ? 'Yes' : 'None'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141c31]">
                <span className="text-[#a9b5d0] block text-[10px]">Dates:</span>
                <span className="font-semibold text-white truncate block">{legacyScan.foundDates.join(', ') || 'None'}</span>
              </div>
            </div>

            {legacyScan.foundDaysCount > 0 ? (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleMigrateLegacy}
                  disabled={migrating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{migrating ? 'Migrating...' : 'Migrate Found Records into Firebase'}</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-[#a9b5d0]">
                No legacy keys (<code className="text-blue-300">pte_daily_tracker_v3_*</code>) were detected in this browser's local storage.
              </p>
            )}

            {migrationStatus && (
              <div className="p-3 rounded-lg bg-[#141c31] border border-blue-500/30 text-xs font-medium text-white">
                {migrationStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Details & Sign Out */}
      <div className="rounded-2xl bg-[#141c31] border border-[#2b3856] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#2b3856] pb-3">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-[#edf2ff]">User Account & Security</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="text-[#a9b5d0]">
              Signed in as: <b className="text-white">{user?.email}</b>
            </p>
            <p className="text-[11px] text-[#a9b5d0] mt-0.5">
              Firebase UID: <span className="font-mono text-blue-300">{user?.uid}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
