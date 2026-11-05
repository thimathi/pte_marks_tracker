import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Flag,
  CheckCircle2,
  Check,
  GraduationCap,
  Mic,
  Clock,
  BookOpen
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

export const ReviewPage: React.FC = () => {
  const { currentDay, currentDayData, days, studyPlan, updateMockReview } = usePteData();
  const [activeModal, setActiveModal] = useState<{
    mock: MockExamRecord;
    review: MockReviewRecord | undefined;
  } | null>(null);

  const isRevDay = isReviewDay(currentDay);
  const revDayDef = getReviewDayDefinition(currentDay);

  // If today is a dedicated review day, list the mock exams from the completed block
  // (e.g. Day 3: Mocks 1–7 from Days 1 & 2)
  const displayMocks = isRevDay && revDayDef
    ? revDayDef.examNumbers.map((examNum) => {
        const { dayNumber, mockKey, reviewKey } = getDayAndSlotForExam(examNum);
        const dayData = days[dayNumber];
        const mockRec = dayData?.mockExams?.[mockKey];
        const revRec = dayData?.mockReviews?.[reviewKey];
        const details = getMockExamDetails(examNum);
        return {
          key: mockKey,
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
          key,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#141c31] border border-slate-800 p-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-[#edf2ff] flex items-center gap-2 flex-wrap">
              <span>
                {isRevDay && revDayDef
                  ? `Day ${currentDay} Deep Review Day · ${revDayDef.title}`
                  : `Day ${currentDay} Deep Review & Error Center`}
              </span>
              {isRevDay && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {displayMocks.length} Papers Focus
                </span>
              )}
            </h1>
          </div>
          <p className="text-xs text-[#a9b5d0] mt-1">
            {isRevDay
              ? `Dedicated deep review day: analyze all ${displayMocks.length} mock simulations from Days ${revDayDef?.coveredDays.join(' & ')} A-to-Z. Record comma-separated Read Aloud scores, deficiencies (අඩුපාඩු), and action plans.`
              : 'Analyze Mock Exam performance, Read Aloud (RA) scores with comma separation, deficiencies (අඩුපාඩු), and corrective actions.'}
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
          <Mic className="w-4 h-4 text-blue-300" />
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
          <div className="p-8 rounded-2xl bg-[#141c31] border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Mock Exams to Review Today</h3>
            <p className="text-xs text-slate-400">Use the calendar or roadmap to select an active study day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayMocks.map(({ key, dayNumber, examNum, details, mockRec, revRec }) => {
              const raScoreList = (revRec?.raScores || '')
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s !== '')
                .map(Number)
                .filter((n) => !isNaN(n));

              return (
                <div
                  key={`${dayNumber}_${key}`}
                  className="rounded-2xl bg-[#141c31] border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-400 font-mono">
                            Mock #{examNum}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${details.roundBadgeColor}`}>
                            Day {dayNumber} · {details.timeSlot}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 line-clamp-1" title={details.testName}>
                          {details.testName}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          revRec?.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {revRec?.isCompleted ? 'Reviewed ✓' : 'Review Incomplete'}
                      </span>
                    </div>

                    {/* Overall Score Badge */}
                    <div className="flex items-center justify-between text-xs bg-[#0e1729] rounded-xl p-2.5 border border-slate-800">
                      <span className="text-slate-400">Overall Score:</span>
                      <span className="font-bold text-white">
                        {mockRec?.overallScore !== null && mockRec?.overallScore !== undefined
                          ? `${mockRec.overallScore} / 90`
                          : 'Not Scored'}
                      </span>
                    </div>

                    {/* Read Aloud (RA) Deep Section */}
                    <div className="rounded-xl bg-blue-950/20 border border-blue-500/30 p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Mic className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-blue-200">
                            Read Aloud (RA) Performance
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {revRec?.raAverageScore !== undefined && revRec?.raAverageScore !== null
                            ? `Average: ${revRec.raAverageScore} / 90`
                            : 'No RA scores logged'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Questions Count:</span>
                        <b className="text-white">{revRec?.raQuestionCount || 6} Questions</b>
                      </div>

                      {/* Comma-separated scores */}
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Individual Scores (Commas):
                        </span>
                        {raScoreList.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {raScoreList.map((sc, i) => (
                              <span
                                key={i}
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  sc >= 79
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : sc >= 65
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                Q{i + 1}: {sc}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            None entered (e.g. 78, 85, 62, 70, 80, 83)
                          </span>
                        )}
                      </div>

                      {/* Deficiencies / Adupadu */}
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Deficiencies & Weaknesses (අඩුපාඩු):
                        </span>
                        {revRec?.raDeficiencies ? (
                          <p className="text-xs text-amber-200/90 bg-[#0c1324] p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                            {revRec.raDeficiencies}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            No weaknesses documented yet. Document pauses, intonation drops, and pronunciation errors.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Repeated Mistakes / Observations */}
                    {revRec?.repeatedMistakes && (
                      <div className="text-xs text-slate-300 bg-[#0e1729] p-2.5 rounded-xl border border-slate-800">
                        <span className="font-semibold text-rose-300 block mb-0.5">Repeated Mistakes:</span>
                        {revRec.repeatedMistakes}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {revRec?.durationMinutes || 0} min review
                    </span>

                    <button
                      onClick={() =>
                        setActiveModal({
                          mock: mockRec || {
                            id: key,
                            examNumber: examNum,
                            studyDay: dayNumber,
                            isCompleted: false
                          },
                          review: revRec
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{revRec?.isCompleted ? 'Edit RA & Review' : 'Log RA & Review'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
