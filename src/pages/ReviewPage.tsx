import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Flag,
  CheckCircle2,
  Check,
  GraduationCap,
  Mic,
  Clock,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import { usePteData } from '../context/PteDataContext';
import {
  QUESTION_TYPES,
  SKILL_COLORS,
  getMockExamsForDay,
  getExamNumberForMock,
  getMockExamDetails,
  isReviewDay,
  getReviewDayDefinition,
  getDayAndSlotForExam
} from '../config/constants';
import { MockExamRecord, MockReviewRecord } from '../types/pte';
import { MockReviewModal } from '../components/mock/MockReviewModal';

interface ReviewItemCardProps {
  dayNumber: number;
  mockKey: string;
  reviewKey: string;
  examNum: number;
  details: ReturnType<typeof getMockExamDetails>;
  mockRec: MockExamRecord | undefined;
  revRec: MockReviewRecord | undefined;
  onUpdateReview: (dayNum: number, revKey: string, data: Partial<MockReviewRecord>) => Promise<void>;
  onUpdateMock: (dayNum: number, mockKey: string, data: Partial<MockExamRecord>) => Promise<void>;
  onOpenModal: () => void;
}

const ReviewItemCard: React.FC<ReviewItemCardProps> = ({
  dayNumber,
  mockKey,
  reviewKey,
  examNum,
  details,
  mockRec,
  revRec,
  onUpdateReview,
  onUpdateMock,
  onOpenModal
}) => {
  const [raAverage, setRaAverage] = useState<string>(
    revRec?.raAverageScore !== null && revRec?.raAverageScore !== undefined ? String(revRec.raAverageScore) : ''
  );
  const [raScores, setRaScores] = useState<string>(revRec?.raScores || '');
  const [deficiencies, setDeficiencies] = useState<string>(revRec?.raDeficiencies || '');
  const [mockScore, setMockScore] = useState<string>(
    mockRec?.overallScore !== null && mockRec?.overallScore !== undefined ? String(mockRec.overallScore) : ''
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setRaAverage(
      revRec?.raAverageScore !== null && revRec?.raAverageScore !== undefined ? String(revRec.raAverageScore) : ''
    );
    setRaScores(revRec?.raScores || '');
    setDeficiencies(revRec?.raDeficiencies || '');
    setMockScore(
      mockRec?.overallScore !== null && mockRec?.overallScore !== undefined ? String(mockRec.overallScore) : ''
    );
  }, [revRec?.raAverageScore, revRec?.raScores, revRec?.raDeficiencies, mockRec?.overallScore]);

  const handleSave = useCallback(
    async (explicitOverrides?: Partial<MockReviewRecord>) => {
      setSaveStatus('saving');

      const parsedAvg = raAverage.trim() === '' ? null : Math.min(90, Math.max(0, Number(raAverage)));
      const parsedMock = mockScore.trim() === '' ? null : Math.min(90, Math.max(0, Number(mockScore)));

      // If mock overall changed, update mock exam too
      if (parsedMock !== (mockRec?.overallScore ?? null)) {
        await onUpdateMock(dayNumber, mockKey, {
          overallScore: parsedMock,
          isCompleted: parsedMock !== null && parsedMock > 0 ? true : mockRec?.isCompleted
        });
      }

      const isCompleted =
        explicitOverrides?.isCompleted !== undefined
          ? explicitOverrides.isCompleted
          : (parsedAvg !== null && parsedAvg > 0) || !!revRec?.isCompleted;

      const payload: Partial<MockReviewRecord> = {
        studyDay: dayNumber,
        examNumber: examNum,
        raAverageScore: parsedAvg,
        raScores,
        raDeficiencies: deficiencies,
        isCompleted,
        completedAt: isCompleted ? (revRec?.completedAt || new Date().toISOString()) : undefined,
        ...explicitOverrides
      };

      await onUpdateReview(dayNumber, reviewKey, payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev)), 2000);
    },
    [raAverage, raScores, deficiencies, mockScore, mockRec, revRec, dayNumber, mockKey, reviewKey, examNum, onUpdateMock, onUpdateReview]
  );

  const raScoreList = raScores
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !isNaN(n));

  const isReviewed = !!revRec?.isCompleted;

  return (
    <div className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between shadow-sm transition-all ${
      isReviewed
        ? 'bg-[#151d2e] border-emerald-500/40 shadow-emerald-950/20'
        : 'bg-[#151d2e] border-slate-800 hover:border-slate-700'
    }`}>
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 font-mono">
                Mock #{examNum}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${details.roundBadgeColor}`}>
                Day {dayNumber} · {details.timeSlot}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1" title={details.testName}>
              {details.testName}
            </h3>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              isReviewed
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80'
                : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
            }`}
          >
            {isReviewed ? 'Review Completed ✓' : 'Review Incomplete'}
          </span>
        </div>

        {/* Quick Tick Checkbox Button */}
        <button
          type="button"
          onClick={() => handleSave({ isCompleted: !isReviewed })}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-xs ${
            isReviewed
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/60'
              : 'bg-[#0d131f] text-slate-300 border-slate-700 hover:border-amber-500 hover:text-white hover:bg-slate-900'
          }`}
        >
          {isReviewed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-md border-2 border-slate-500 shrink-0" />
          )}
          <span>{isReviewed ? '✓ Review Completed (Ticked)' : 'Review Completed or Not (Just Tick)'}</span>
        </button>

        {/* Dual Marks Entry: Mock Overall Marks & RA Average Marks */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#0d131f] rounded-xl p-2.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" />
                Exam Marks:
              </label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="0–90"
              value={mockScore}
              onChange={(e) => setMockScore(e.target.value)}
              onBlur={() => handleSave()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-blue-500 rounded-lg py-1 px-2 text-sm font-extrabold text-slate-100 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>

          <div className="bg-[#0d131f] rounded-xl p-2.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <Mic className="w-3 h-3 text-emerald-400" />
                RA Marks:
              </label>
              <span className="text-[9px] text-slate-500">/90</span>
            </div>
            <input
              type="number"
              min="0"
              max="90"
              placeholder="0–90"
              value={raAverage}
              onChange={(e) => setRaAverage(e.target.value)}
              onBlur={() => handleSave()}
              className="w-full bg-[#151d2e] border border-slate-700 focus:border-emerald-500 rounded-lg py-1 px-2 text-sm font-extrabold text-emerald-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          </div>
        </div>

        {/* Read Aloud (RA) Comma-Separated Scores */}
        <div className="bg-[#0d131f] rounded-xl p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              <span>Read Aloud Question Marks (Commas):</span>
            </label>
            {raScoreList.length > 0 && (
              <span className="text-[10px] font-mono text-slate-400">
                {raScoreList.length} Qs logged
              </span>
            )}
          </div>

          <input
            type="text"
            placeholder="e.g. 78, 85, 72, 80, 83, 79"
            value={raScores}
            onChange={(e) => setRaScores(e.target.value)}
            onBlur={() => handleSave()}
            className="w-full bg-[#151d2e] border border-slate-700 focus:border-blue-500 rounded-lg py-1.5 px-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
          />

          {raScoreList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {raScoreList.map((sc, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    sc >= 78
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : sc >= 65
                      ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800'
                  }`}
                >
                  Q{i + 1}: {sc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Deficiencies & Weaknesses (අඩුපාඩු) */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Deficiencies & Observations (අඩුපාඩු):
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Pauses before difficult words, dropped intonation at commas, oral hesitation on Q3..."
            value={deficiencies}
            onChange={(e) => setDeficiencies(e.target.value)}
            onBlur={() => handleSave()}
            className="w-full bg-[#0d131f] border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{revRec?.durationMinutes || 45}m</span>
          {saveStatus === 'saving' ? (
            <span className="text-[10px] text-amber-400">Saving...</span>
          ) : saveStatus === 'saved' ? (
            <span className="text-[10px] text-emerald-400 font-semibold">✓ Saved</span>
          ) : null}
        </div>

        <button
          onClick={onOpenModal}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-slate-600 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Deep Modal Review</span>
        </button>
      </div>
    </div>
  );
};

export const ReviewPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateMockReview, updateMockExam } = usePteData();
  const [activeModal, setActiveModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const isRevDay = isReviewDay(currentDay);
  const revDayDef = getReviewDayDefinition(currentDay);

  const displayMocks = isRevDay && revDayDef
    ? revDayDef.examNumbers.map((examNum) => {
        const { dayNumber, mockKey, reviewKey } = getDayAndSlotForExam(examNum);
        const dayData = days[dayNumber];
        const mockRec = dayData?.mockExams?.[mockKey];
        const revRec = dayData?.mockReviews?.[reviewKey];
        const details = getMockExamDetails(examNum);
        return {
          mockKey,
          reviewKey,
          dayNumber,
          examNum,
          details,
          mockRec,
          revRec
        };
      })
    : getMockExamsForDay(currentDay).map((key, idx) => {
        const examNum = getExamNumberForMock(currentDay, idx);
        const mockRec = currentDayData?.mockExams?.[key];
        const revRec = currentDayData?.mockReviews?.[`review0${idx + 1}`];
        const details = getMockExamDetails(examNum);
        return {
          mockKey: key,
          reviewKey: `review0${idx + 1}`,
          dayNumber: currentDay,
          examNum,
          details,
          mockRec,
          revRec
        };
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#151d2e] border border-slate-800 p-6 shadow-sm text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>
                {isRevDay && revDayDef
                  ? `Day ${currentDay} Deep Review Day · ${revDayDef.title}`
                  : `Day ${currentDay} Deep Review & Error Center`}
              </span>
              {isRevDay && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800 font-bold">
                  {displayMocks.length} Papers Focus
                </span>
              )}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRevDay
              ? `Dedicated deep review day: analyze all ${displayMocks.length} mock simulations from Days ${revDayDef?.coveredDays.join(' & ')} A-to-Z. Record marks, Read Aloud scores, deficiencies (අඩුපාඩු), and tick completion.`
              : 'Analyze Mock Exam performance, Read Aloud (RA) scores with comma separation, deficiencies (අඩුපාඩු), marks, and tick completion.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/mock-exams"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mock Exam Center</span>
          </Link>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-blue-600 text-white shadow-sm"
        >
          <Mic className="w-4 h-4 text-white" />
          <span>
            {isRevDay
              ? `Cycle Papers to Review (${displayMocks.length} Tests)`
              : "Today's Mock Exam & Read Aloud (RA) Reviews"}
          </span>
        </button>
      </div>

      {/* Mock Exam & Read Aloud (RA) Deep Breakdown */}
      <div className="space-y-4">
        {displayMocks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#151d2e] border border-slate-800 text-center space-y-2 shadow-sm text-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100">No Mock Exams to Review Today</h3>
            <p className="text-xs text-slate-400">Use the calendar or roadmap to select an active study day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayMocks.map(({ mockKey, reviewKey, dayNumber, examNum, details, mockRec, revRec }) => (
              <ReviewItemCard
                key={`${dayNumber}_${mockKey}`}
                dayNumber={dayNumber}
                mockKey={mockKey}
                reviewKey={reviewKey}
                examNum={examNum}
                details={details}
                mockRec={mockRec}
                revRec={revRec}
                onUpdateReview={updateMockReview}
                onUpdateMock={updateMockExam}
                onOpenModal={() =>
                  setActiveModal({
                    mock: mockRec || {
                      id: mockKey,
                      examNumber: examNum,
                      studyDay: dayNumber,
                      isCompleted: false
                    },
                    review: revRec
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {activeModal && (
        <MockReviewModal
          mockExam={activeModal.mock}
          reviewRecord={activeModal.review}
          onSave={async (data) => {
            const revId = activeModal.mock.id.replace('mock', 'review');
            await updateMockReview(activeModal.mock.studyDay, revId, data);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
