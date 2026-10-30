import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import { MockReviewModal } from '../components/mock/MockReviewModal';
import { MockExamRecord, MockReviewRecord } from '../types/pte';
import { formatDateFriendly } from '../utils/dateUtils';
import {
  TOTAL_MOCK_TARGET,
  TOTAL_STUDY_DAYS,
  getMockExamDetails,
  getMockExamsForDay,
  getExamNumberForMock,
  DAILY_MOCK_SCHEDULE
} from '../config/constants';

interface MockCardProps {
  mockKey: string;
  idx: number;
  totalMocksToday: number;
  currentDay: number;
  mock: MockExamRecord | undefined;
  rev: MockReviewRecord | undefined;
  onSaveMock: (mockId: string, payload: Partial<MockExamRecord>) => Promise<void>;
  onOpenReview: () => void;
}

const MockExamCard: React.FC<MockCardProps> = ({
  mockKey,
  idx,
  totalMocksToday,
  currentDay,
  mock,
  rev,
  onSaveMock,
  onOpenReview
}) => {
  const examNumber = getExamNumberForMock(currentDay, idx);
  const examDetails = getMockExamDetails(examNumber);
  const schedule = DAILY_MOCK_SCHEDULE[idx];

  // Local state for smooth, un-throttled typing
  const [overall, setOverall] = useState<string>(
    mock?.overallScore !== null && mock?.overallScore !== undefined ? String(mock.overallScore) : ''
  );
  const [speaking, setSpeaking] = useState<string>(
    mock?.speakingScore !== null && mock?.speakingScore !== undefined ? String(mock.speakingScore) : ''
  );
  const [writing, setWriting] = useState<string>(
    mock?.writingScore !== null && mock?.writingScore !== undefined ? String(mock.writingScore) : ''
  );
  const [reading, setReading] = useState<string>(
    mock?.readingScore !== null && mock?.readingScore !== undefined ? String(mock.readingScore) : ''
  );
  const [listening, setListening] = useState<string>(
    mock?.listeningScore !== null && mock?.listeningScore !== undefined ? String(mock.listeningScore) : ''
  );
  const [questions, setQuestions] = useState<string>(
    mock?.questionsAttempted !== null && mock?.questionsAttempted !== undefined
      ? String(mock.questionsAttempted)
      : '60'
  );
  const [mistakes, setMistakes] = useState<string>(mock?.mainMistakes || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

  // Sync state if external mock record changes (e.g. day switched or remote reload)
  useEffect(() => {
    setOverall(
      mock?.overallScore !== null && mock?.overallScore !== undefined ? String(mock.overallScore) : ''
    );
    setSpeaking(
      mock?.speakingScore !== null && mock?.speakingScore !== undefined ? String(mock.speakingScore) : ''
    );
    setWriting(
      mock?.writingScore !== null && mock?.writingScore !== undefined ? String(mock.writingScore) : ''
    );
    setReading(
      mock?.readingScore !== null && mock?.readingScore !== undefined ? String(mock.readingScore) : ''
    );
    setListening(
      mock?.listeningScore !== null && mock?.listeningScore !== undefined ? String(mock.listeningScore) : ''
    );
    setQuestions(
      mock?.questionsAttempted !== null && mock?.questionsAttempted !== undefined
        ? String(mock.questionsAttempted)
        : '60'
    );
    setMistakes(mock?.mainMistakes || '');
    setSaveStatus('idle');
  }, [
    currentDay,
    mockKey,
    mock?.overallScore,
    mock?.speakingScore,
    mock?.writingScore,
    mock?.readingScore,
    mock?.listeningScore,
    mock?.questionsAttempted,
    mock?.mainMistakes
  ]);

  const saveScores = useCallback(
    async (explicitOverrides?: Partial<MockExamRecord>) => {
      setSaveStatus('saving');
      const parseNumber = (val: string) => {
        const trimmed = val.trim();
        if (trimmed === '') return null;
        const num = Number(trimmed);
        return isNaN(num) ? null : Math.min(Math.max(0, num), 90);
      };

      const finalOverall =
        explicitOverrides?.overallScore !== undefined
          ? explicitOverrides.overallScore
          : parseNumber(overall);
      const finalSpeaking =
        explicitOverrides?.speakingScore !== undefined
          ? explicitOverrides.speakingScore
          : parseNumber(speaking);
      const finalWriting =
        explicitOverrides?.writingScore !== undefined
          ? explicitOverrides.writingScore
          : parseNumber(writing);
      const finalReading =
        explicitOverrides?.readingScore !== undefined
          ? explicitOverrides.readingScore
          : parseNumber(reading);
      const finalListening =
        explicitOverrides?.listeningScore !== undefined
          ? explicitOverrides.listeningScore
          : parseNumber(listening);
      const finalQuestions =
        explicitOverrides?.questionsAttempted !== undefined
          ? explicitOverrides.questionsAttempted
          : questions.trim() === ''
          ? 60
          : Number(questions);
      const finalMistakes =
        explicitOverrides?.mainMistakes !== undefined ? explicitOverrides.mainMistakes : mistakes;

      const payload: Partial<MockExamRecord> = {
        overallScore: finalOverall,
        speakingScore: finalSpeaking,
        writingScore: finalWriting,
        readingScore: finalReading,
        listeningScore: finalListening,
        questionsAttempted: finalQuestions,
        mainMistakes: finalMistakes,
        isCompleted: finalOverall !== null && finalOverall > 0,
        ...explicitOverrides
      };

      await onSaveMock(mockKey, payload);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2500);
    },
    [mockKey, overall, speaking, writing, reading, listening, questions, mistakes, onSaveMock]
  );

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3.5 flex flex-col justify-between transition-colors hover:border-slate-700">
      {/* Top Header */}
      <div className="space-y-2 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Sim {idx + 1} of {totalMocksToday}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${examDetails.roundBadgeColor}`}>
            {examDetails.roundTitle.split(':')[0]}
          </span>
        </div>

        {schedule && (
          <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{schedule.timeSlot}</span>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            Mock #{examNumber}: {examDetails.testName}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {schedule?.sessionName || examDetails.roundTitle}
          </p>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              mock?.isCompleted && rev?.isCompleted
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : mock?.isCompleted
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {mock?.isCompleted && rev?.isCompleted
              ? 'Complete ✓'
              : mock?.isCompleted
              ? 'Exam Scored'
              : 'Pending'}
          </span>

          {examNumber === 1 && !mock?.isCompleted && (
            <button
              type="button"
              onClick={() => {
                setOverall('59');
                setSpeaking('72');
                setWriting('61');
                setReading('40');
                setListening('64');
                setQuestions('60');
                setMistakes('Baseline Diagnostic (APEUni VIP Mock Test 45C)');
                saveScores({
                  overallScore: 59,
                  speakingScore: 72,
                  writingScore: 61,
                  readingScore: 40,
                  listeningScore: 64,
                  questionsAttempted: 60,
                  mainMistakes: 'Baseline Diagnostic (APEUni VIP Mock Test 45C)',
                  isCompleted: true
                });
              }}
              className="py-0.5 px-2 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
            >
              ⚡ Load 45C Baseline (59/90)
            </button>
          )}
        </div>
      </div>

      {/* Primary Score Input: Overall Score / 90 */}
      <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            Overall Score / 90:
          </label>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              Number(overall) >= 79
                ? 'bg-emerald-500/20 text-emerald-300'
                : Number(overall) >= 65
                ? 'bg-blue-500/20 text-blue-300'
                : Number(overall) > 0
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-slate-500'
            }`}
          >
            {Number(overall) >= 79
              ? 'Superior (79+)'
              : Number(overall) >= 65
              ? 'Proficient (65+)'
              : Number(overall) > 0
              ? 'Score < 65'
              : 'Not Scored'}
          </span>
        </div>
        <input
          type="number"
          min="0"
          max="90"
          placeholder="0–90"
          value={overall}
          onChange={(e) => {
            setOverall(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg py-2 px-3 text-lg font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* 4 Communicative Skills (2x2 Grid) */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Section Scores (/90)
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Speaking */}
          <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-blue-300">Speaking</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={speaking}
              onChange={(e) => {
                setSpeaking(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-blue-400 rounded py-1 px-2 text-xs font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Writing */}
          <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-purple-300">Writing</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={writing}
              onChange={(e) => {
                setWriting(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-purple-400 rounded py-1 px-2 text-xs font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Reading */}
          <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-emerald-300">Reading</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={reading}
              onChange={(e) => {
                setReading(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-emerald-400 rounded py-1 px-2 text-xs font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          {/* Listening */}
          <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-amber-300">Listening</label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="—"
              value={listening}
              onChange={(e) => {
                setListening(e.target.value);
                setSaveStatus('dirty');
              }}
              onBlur={() => saveScores()}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-400 rounded py-1 px-2 text-xs font-bold text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Questions Attempted */}
      <div className="flex items-center justify-between bg-slate-950/50 rounded-lg px-2.5 py-1.5 border border-slate-800">
        <label className="text-xs text-slate-400 font-medium">Questions Done:</label>
        <input
          type="number"
          value={questions}
          onChange={(e) => {
            setQuestions(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
        />
      </div>

      {/* Main Mistakes & Observations */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Mistakes & Notes:
        </label>
        <textarea
          rows={2}
          placeholder="R/W FIB collocations, oral fluency, WFD spellings..."
          value={mistakes}
          onChange={(e) => {
            setMistakes(e.target.value);
            setSaveStatus('dirty');
          }}
          onBlur={() => saveScores()}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-slate-600 placeholder-slate-600 resize-none"
        />
      </div>

      {/* Bottom Actions: Save status & Review Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{rev?.durationMinutes || 0}m</span>
          {saveStatus === 'dirty' ? (
            <button
              type="button"
              onClick={() => saveScores()}
              className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
            >
              Save
            </button>
          ) : saveStatus === 'saving' ? (
            <span className="text-[10px] text-amber-400">Saving...</span>
          ) : saveStatus === 'saved' ? (
            <span className="text-[10px] text-emerald-400 font-medium">✓ Saved</span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onOpenReview}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>{rev?.isCompleted ? 'Edit Review' : 'Start Review'}</span>
        </button>
      </div>
    </div>
  );
};

export const MockExamsPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateMockExam, updateMockReview, selectDay } = usePteData();
  const totalDays = studyPlan?.durationDays || TOTAL_STUDY_DAYS;
  const totalMocks = TOTAL_MOCK_TARGET;

  const [activeReviewModal, setActiveReviewModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const mockKeys = getMockExamsForDay(currentDay);

  const handleSaveMock = useCallback(
    async (mockId: string, payload: Partial<MockExamRecord>) => {
      await updateMockExam(currentDay, mockId, payload);
    },
    [currentDay, updateMockExam]
  );

  // Build the complete list of all 51 planned mock exams across 17 days
  const allMocksSchedule: {
    examNumber: number;
    dayNumber: number;
    mockId: string;
    reviewId: string;
  }[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const dayMocks = getMockExamsForDay(d);
    dayMocks.forEach((mockId, idx) => {
      allMocksSchedule.push({
        examNumber: getExamNumberForMock(d, idx),
        dayNumber: d,
        mockId,
        reviewId: `review0${idx + 1}`
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">
              Mock Exam Center · {totalMocks} Full Simulation Tests (Priority #1)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Daily Requirement: 5 Full Mock Exams per day across 5 Timed Sessions + 100 Daily Practice Questions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
            Day {currentDay} Focus: {mockKeys.length} Mock Exams (8-10 AM, 11-1 PM, 2-4 PM, 8-10 PM, 11-1 AM)
          </span>
        </div>
      </div>

      {/* Active Day's Mock Exam Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Today's Scheduled Mock Exams ({mockKeys.length} Timed Simulations Daily)
          </h2>
          <span className="text-xs text-blue-400 font-medium">Study Day {currentDay}</span>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 5 on wide monitors */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
          {mockKeys.map((key, idx) => {
            const mock = currentDayData?.mockExams?.[key];
            const reviewId = `review0${idx + 1}`;
            const rev = currentDayData?.mockReviews?.[reviewId];
            const examNumber = getExamNumberForMock(currentDay, idx);
            const fallbackMock: MockExamRecord = mock || {
              id: key,
              examNumber,
              testName: getMockExamDetails(examNumber).testName,
              studyDay: currentDay,
              isCompleted: false
            };

            return (
              <MockExamCard
                key={`${currentDay}-${key}`}
                mockKey={key}
                idx={idx}
                totalMocksToday={mockKeys.length}
                currentDay={currentDay}
                mock={mock}
                rev={rev}
                onSaveMock={handleSaveMock}
                onOpenReview={() =>
                  setActiveReviewModal({
                    mock: fallbackMock,
                    review: rev
                  })
                }
              />
            );
          })}
        </div>
      </div>

      {/* Mock Exams Complete Progression Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              All {totalMocks} Planned Mock Exams Schedule & Score Register
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            35 Unique Papers × 2 Shuffled Rounds (+ Day 15 Summit) = {totalMocks} Total Mocks (5 Mocks / Day)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Exam #</th>
                <th className="py-2.5 px-3">APEUni Test Name</th>
                <th className="py-2.5 px-3">Round</th>
                <th className="py-2.5 px-3">Study Day</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Overall / 90</th>
                <th className="py-2.5 px-3">Speaking</th>
                <th className="py-2.5 px-3">Writing</th>
                <th className="py-2.5 px-3">Reading</th>
                <th className="py-2.5 px-3">Listening</th>
                <th className="py-2.5 px-3">Exam Status</th>
                <th className="py-2.5 px-3">Review Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allMocksSchedule.map((item) => {
                const dayRec = days[item.dayNumber];
                const mockRec = dayRec?.mockExams?.[item.mockId];
                const revRec = dayRec?.mockReviews?.[item.reviewId];
                const details = getMockExamDetails(item.examNumber);

                return (
                  <tr
                    key={item.examNumber}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      item.dayNumber === currentDay ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold font-mono text-blue-400">
                      Mock #{item.examNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-200 max-w-xs truncate" title={details.testName}>
                      {details.testName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${details.roundBadgeColor}`}>
                        Round {details.roundNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium">
                      Day {item.dayNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {dayRec ? formatDateFriendly(dayRec.date) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">60 Qs</td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {mockRec?.overallScore !== null && mockRec?.overallScore !== undefined
                        ? `${mockRec.overallScore}/90`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-blue-300">{mockRec?.speakingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-purple-300">{mockRec?.writingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-emerald-300">{mockRec?.readingScore ?? '—'}</td>
                    <td className="py-2.5 px-3 text-amber-300">{mockRec?.listeningScore ?? '—'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          mockRec?.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {mockRec?.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          revRec?.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {revRec?.isCompleted ? 'Reviewed ✓' : 'Unreviewed'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => selectDay(item.dayNumber)}
                        className="text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        Select Day {item.dayNumber}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal popup */}
      {activeReviewModal && (
        <MockReviewModal
          mockExam={activeReviewModal.mock}
          reviewRecord={activeReviewModal.review}
          onSave={async (data) => {
            const revId = activeReviewModal.mock.id.replace('mock', 'review');
            await updateMockReview(activeReviewModal.mock.studyDay, revId, data);
          }}
          onClose={() => setActiveReviewModal(null)}
        />
      )}
    </div>
  );
};
