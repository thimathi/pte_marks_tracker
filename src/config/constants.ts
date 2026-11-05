import { QuestionPriority, QuestionTypeMeta, SkillType, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-11-03'; // Start: Nov 3, 2026
export const FINAL_TARGET_DATE = '2026-11-30'; // Exam Day: Nov 30, 2026 (28 Days Total)
export const APP_TITLE = 'PTE - 60-Mock Exam Mastery Mission';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 28; // Exactly 28 Days (Nov 3 to Nov 30, 2026)
export const DAILY_PRACTICE_TARGET = 0; // Pure mock simulation journey
export const TOTAL_PRACTICE_TARGET = 0; 
export const DAILY_MOCK_TARGET = 3; // Flexible pace: 3-4 Mocks on Mock Days, 0 on Review Days
export const TOTAL_MOCK_TARGET = 60; // Exactly 60 Mock Exams (20 unique VIP papers × 3 passes)
export const TOTAL_UNIQUE_PAPERS = 20; // 20 unique VIP papers
export const REPETITIONS_PER_PAPER = 3; // Each paper repeated exactly 3 times in random order
export const TOTAL_SECTION_TESTS = 0; 
export const MOCK_EXAM_QUESTIONS = 60;
export const TOTAL_MOCK_EXAM_QUESTIONS = 3600; // 60 mocks * 60 questions = 3,600
export const TOTAL_MISSION_QUESTIONS = 3600; // 3,600 Total Questions

export interface MockScheduleSlot {
  mockIndex: number;
  timeSlot: string;
  sessionName: string;
}

export const DAILY_MOCK_SCHEDULE: MockScheduleSlot[] = [
  { mockIndex: 0, timeSlot: '12:00 AM – 02:00 AM', sessionName: 'Midnight Session' },
  { mockIndex: 1, timeSlot: '09:00 AM – 11:00 AM', sessionName: 'Morning Session' },
  { mockIndex: 2, timeSlot: '01:00 PM – 03:00 PM', sessionName: 'Afternoon Session' },
  { mockIndex: 3, timeSlot: '04:00 PM – 06:00 PM', sessionName: 'Evening Session' }
];

export interface SectionTestDef {
  dayNumber: number;
  testId: string;
  title: string;
  skill: SkillType | 'all';
  targetQuestions: number;
  estMinutes: string;
  description: string;
  recommendedSlot: string;
}

export const SECTION_TEST_SCHEDULE: Record<number, SectionTestDef> = {};

export function getSectionTestForDay(_dayNumber: number): SectionTestDef | null {
  return null;
}

export const DEFAULT_TARGET_SCORES: TargetScores = {
  overall: 79,
  speaking: 79,
  writing: 76,
  reading: 72,
  listening: 76,
  mockExam: 76,
};

// Target progression curve across 28 study days (Nov 3 to Nov 30)
export const DAY_TARGET_SCORES: number[] = [
  60, 61, 62, 63, 64, 65, 66, // Week 1 (Days 1–7): Nov 03–09 (Baseline Stabilization)
  67, 68, 69, 70, 71, 72, 73, // Week 2 (Days 8–14): Nov 10–16 (Fluency Acceleration)
  74, 74, 75, 75, 76, 76, 77, // Week 3 (Days 15–21): Nov 17–23 (Accuracy & Time Control)
  77, 78, 78, 79, 79, 79, 79  // Week 4 (Days 22–28): Nov 24–30 (Superior 79+ Summit Ready)
];

export interface ReviewScheduleSlot {
  slotIndex: number;
  timeSlot: string;
  sessionName: string;
  focus: string;
}

export const DAILY_REVIEW_SCHEDULE: ReviewScheduleSlot[] = [
  { slotIndex: 0, timeSlot: '09:00 AM – 11:30 AM', sessionName: 'Morning Deep Review (2.5h)', focus: 'A-to-Z Speaking Error Analysis (RA, RS Fluency & Pauses)' },
  { slotIndex: 1, timeSlot: '01:00 PM – 03:30 PM', sessionName: 'Afternoon Deep Review (2.5h)', focus: 'Reading Blanks (R/W FIB) & Writing Corrective Actions' },
  { slotIndex: 2, timeSlot: '05:00 PM – 07:00 PM', sessionName: 'Evening Deep Review (2.0h)', focus: 'Listening (WFD, SST, HIW) & Vocab Error Log' },
  { slotIndex: 3, timeSlot: '08:30 PM – 09:30 PM', sessionName: 'Night Summary (1.0h)', focus: 'Consolidation of Deficiencies (අඩුපාඩු) & Strategy Adjustments' }
];

export interface ReviewDayDefinition {
  dayNumber: number;
  startExam: number;
  endExam: number;
  examNumbers: number[];
  coveredDays: number[];
  title: string;
}

export const REVIEW_DAYS: Record<number, ReviewDayDefinition> = {
  3: {
    dayNumber: 3,
    startExam: 1,
    endExam: 7,
    examNumbers: [1, 2, 3, 4, 5, 6, 7],
    coveredDays: [1, 2],
    title: 'Deep Review: Exams 1–7 (Day 1 & Day 2 Papers)'
  },
  6: {
    dayNumber: 6,
    startExam: 8,
    endExam: 14,
    examNumbers: [8, 9, 10, 11, 12, 13, 14],
    coveredDays: [4, 5],
    title: 'Deep Review: Exams 8–14 (Day 4 & Day 5 Papers)'
  },
  9: {
    dayNumber: 9,
    startExam: 15,
    endExam: 21,
    examNumbers: [15, 16, 17, 18, 19, 20, 21],
    coveredDays: [7, 8],
    title: 'Deep Review: Exams 15–21 (Day 7 & Day 8 Papers)'
  },
  12: {
    dayNumber: 12,
    startExam: 22,
    endExam: 28,
    examNumbers: [22, 23, 24, 25, 26, 27, 28],
    coveredDays: [10, 11],
    title: 'Deep Review: Exams 22–28 (Day 10 & Day 11 Papers)'
  },
  15: {
    dayNumber: 15,
    startExam: 29,
    endExam: 35,
    examNumbers: [29, 30, 31, 32, 33, 34, 35],
    coveredDays: [13, 14],
    title: 'Deep Review: Exams 29–35 (Day 13 & Day 14 Papers)'
  },
  18: {
    dayNumber: 18,
    startExam: 36,
    endExam: 42,
    examNumbers: [36, 37, 38, 39, 40, 41, 42],
    coveredDays: [16, 17],
    title: 'Deep Review: Exams 36–42 (Day 16 & Day 17 Papers)'
  },
  21: {
    dayNumber: 21,
    startExam: 43,
    endExam: 48,
    examNumbers: [43, 44, 45, 46, 47, 48],
    coveredDays: [19, 20],
    title: 'Deep Review: Exams 43–48 (Day 19 & Day 20 Papers)'
  },
  24: {
    dayNumber: 24,
    startExam: 49,
    endExam: 54,
    examNumbers: [49, 50, 51, 52, 53, 54],
    coveredDays: [22, 23],
    title: 'Deep Review: Exams 49–54 (Day 22 & Day 23 Papers)'
  },
  27: {
    dayNumber: 27,
    startExam: 55,
    endExam: 60,
    examNumbers: [55, 56, 57, 58, 59, 60],
    coveredDays: [25, 26],
    title: 'Grand Final Review: Exams 55–60 (Day 25 & Day 26 Papers + Final Summit Readiness)'
  }
};

export function isReviewDay(dayNumber: number): boolean {
  return dayNumber in REVIEW_DAYS;
}

export function getReviewDayDefinition(dayNumber: number): ReviewDayDefinition | null {
  return REVIEW_DAYS[dayNumber] || null;
}

export function getDailyMockTarget(dayNumber: number): number {
  if (isReviewDay(dayNumber) || dayNumber >= 28) return 0;
  if ([1, 4, 7, 10, 13, 16].includes(dayNumber)) return 4;
  return 3;
}

export function getDailyPracticeTarget(_dayNumber: number): number {
  return 0;
}

export function getMockExamsForDay(dayNumber: number): string[] {
  if (dayNumber === 1) {
    return ['mock01', 'mock02', 'mock03', 'mock04'];
  }
  if (dayNumber === 2) {
    return ['mock01', 'mock02', 'mock03'];
  }
  // Dedicated Review Days & Final Exam Day have 0 new mocks scheduled
  if (isReviewDay(dayNumber) || dayNumber >= 28) {
    return [];
  }
  // 4-mock days:
  if ([4, 7, 10, 13, 16].includes(dayNumber)) {
    return ['mock01', 'mock02', 'mock03', 'mock04'];
  }
  // 3-mock days:
  if ([5, 8, 11, 14, 17, 19, 20, 22, 23, 25, 26].includes(dayNumber)) {
    return ['mock01', 'mock02', 'mock03'];
  }
  return [];
}

export const DAY_START_EXAM_NUMBER: Record<number, number> = {
  1: 1,
  2: 5,
  4: 8,
  5: 12,
  7: 15,
  8: 19,
  10: 22,
  11: 26,
  13: 29,
  14: 33,
  16: 36,
  17: 40,
  19: 43,
  20: 46,
  22: 49,
  23: 52,
  25: 55,
  26: 58
};

export function getExamNumberForMock(dayNumber: number, mockIndex: number): number {
  const start = DAY_START_EXAM_NUMBER[dayNumber];
  if (start !== undefined) {
    return start + mockIndex;
  }
  return 60;
}

const EXAM_TO_DAY_SLOT_CACHE: Record<number, { dayNumber: number; mockKey: string; reviewKey: string }> = {};

Object.entries(DAY_START_EXAM_NUMBER).forEach(([dayStr, startExam]) => {
  const d = Number(dayStr);
  const keys = getMockExamsForDay(d);
  keys.forEach((key, idx) => {
    const eNum = startExam + idx;
    EXAM_TO_DAY_SLOT_CACHE[eNum] = {
      dayNumber: d,
      mockKey: key,
      reviewKey: `review0${idx + 1}`
    };
  });
});

export function getDayAndSlotForExam(examNumber: number): { dayNumber: number; mockKey: string; reviewKey: string } {
  const safe = Math.min(Math.max(1, examNumber), 60);
  return EXAM_TO_DAY_SLOT_CACHE[safe] || { dayNumber: 1, mockKey: 'mock01', reviewKey: 'review01' };
}

// 35 Available APEUni VIP Mock Exam Papers (User-Provided Exact Catalog)
export const APEUNI_VIP_MOCKS: string[] = [
  '【VIP Full Test】PTE Mock Test 45C',
  '【VIP Full Test】PTE Mock Test 44C',
  '【VIP Full Test】PTE Mock Test 44B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 44A (7th Aug. new version)',
  '【Free Full Test】Mock Test A (note: VIP required for scoring)',
  '【VIP Full Test】PTE Mock Test 43B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 43A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 42B (8.7 new version)',
  '【VIP Full Test】PTE Mock Test 42A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 41B (7th Aug. new version - Set 1)',
  '【VIP Full Test】PTE Mock Test 41B (7th Aug. new version - Set 2)',
  '【VIP Full Test】PTE Mock Test 41A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 40B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 40A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 39B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 39A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 38B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 38A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 37B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 37A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 36B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 35B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 34B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 33B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 32B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 31B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 30B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 29B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 28B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 27B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 26B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 25B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 24B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 23B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 22B (7th Aug. new version)'
];

/**
 * Deterministic pseudo-random shuffle generator (Seeded Fisher-Yates)
 * Guarantees that every run generates the exact same engaging, reproducible shuffle sequence.
 */
function generateSeededPermutation(count: number, seed: number): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 60 Planned Mock Exams Across 28 Days (20 Unique Papers × 3 Passes):
 * - Round 1 (Exams 1–20): Pass 1 (First Attempt: Initial Diagnostic & Baseline)
 * - Round 2 (Exams 21–40): Pass 2 (Error Rectification & Correction)
 * - Round 3 (Exams 41–60): Pass 3 (79+ Superior Summit Readiness & Fluency Peak)
 * Total: 20 * 3 = 60 Mock Exams (Each unique paper repeated 3 times in random order)
 * Plus 9 dedicated Deep Review Days (Days 3, 6, 9, 12, 15, 18, 21, 24, 27) = 40+ hours saved for error analysis!
 */
function generateRound1Indices(): number[] {
  // Day 1 exact 4 tests as confirmed by user:
  // Mock 1: Mock Test A (Index 4)
  // Mock 2: Mock Test 37B (Index 18)
  // Mock 3: Mock Test 40B (Index 12)
  // Mock 4: Mock Test 45C (Index 0)
  const day1Papers = [4, 18, 12, 0];
  const remaining = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19];
  const perm = generateSeededPermutation(remaining.length, 777);
  const shuffledRemaining = perm.map((i) => remaining[i]);
  return [...day1Papers, ...shuffledRemaining];
}

export const MOCK_EXAM_SCHEDULE_INDICES: number[] = [
  ...generateRound1Indices(),              // Round 1: 20 tests (Pass 1: First Attempt)
  ...generateSeededPermutation(20, 1492),  // Round 2: 20 tests (Pass 2: Error Rectification)
  ...generateSeededPermutation(20, 2026)   // Round 3: 20 tests (Pass 3: 79+ Peak Perfection)
];

export interface MockExamDetails {
  examNumber: number;
  testName: string;
  roundNumber: number;
  roundTitle: string;
  roundBadgeColor: string;
  paperNumber: number;
  paperUniqueIndex: number;
  attemptOfPaper: number;
  timeSlot: string;
  sessionName: string;
}

export function getMockExamDetails(examNumber: number): MockExamDetails {
  const safeNumber = Math.min(Math.max(1, examNumber), 60);
  const scheduleIndex = (safeNumber - 1) % MOCK_EXAM_SCHEDULE_INDICES.length;
  const paperIndex = MOCK_EXAM_SCHEDULE_INDICES[scheduleIndex] ?? 0;
  const testName = APEUNI_VIP_MOCKS[paperIndex] || `PTE Mock Test #${safeNumber}`;

  let roundNumber = 1;
  let roundTitle = 'Pass 1 (First Attempt): Diagnostic Baseline';
  let roundBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';

  if (safeNumber > 40) {
    roundNumber = 3;
    roundTitle = 'Pass 3: 79+ Peak Perfection';
    roundBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (safeNumber > 20) {
    roundNumber = 2;
    roundTitle = 'Pass 2: Error Rectification & Fluency';
    roundBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  }

  // Count how many times this paper appeared up to this exam
  let attemptOfPaper = 0;
  for (let i = 0; i < safeNumber; i++) {
    if (MOCK_EXAM_SCHEDULE_INDICES[i] === paperIndex) {
      attemptOfPaper++;
    }
  }
  if (attemptOfPaper === 0) attemptOfPaper = roundNumber;

  const { mockKey } = getDayAndSlotForExam(safeNumber);
  const slotIndex = parseInt(mockKey.replace('mock0', ''), 10) - 1;
  const scheduleSlot = DAILY_MOCK_SCHEDULE[slotIndex] || DAILY_MOCK_SCHEDULE[0];

  return {
    examNumber: safeNumber,
    testName,
    roundNumber,
    roundTitle,
    roundBadgeColor,
    paperNumber: paperIndex + 1,
    paperUniqueIndex: paperIndex,
    attemptOfPaper,
    timeSlot: scheduleSlot.timeSlot,
    sessionName: scheduleSlot.sessionName
  };
}

export function getExamNumbersForPaper(paperIndex: number): number[] {
  const result: number[] = [];
  MOCK_EXAM_SCHEDULE_INDICES.forEach((pIdx, idx) => {
    if (pIdx === paperIndex) {
      result.push(idx + 1);
    }
  });
  return result;
}

export function getMockExamTitle(examNumber: number): string {
  const details = getMockExamDetails(examNumber);
  return `${details.testName} (${details.roundTitle.split(':')[0]})`;
}

/**
 * Day 1 First Attempt – Pre-Plan Diagnostic Baseline Tests
 * These 4 specific APEUni tests are done on Day 1 (Nov 3, 2026) BEFORE the main
 * 80-mock plan begins. Scores are stored separately to track initial baseline.
 */
export const DAY1_FIRST_ATTEMPT_TESTS = [
  {
    id: 'fa_01',
    testName: '【Free Full Test】Mock Test A (note: VIP required for scoring)',
    shortName: 'Mock Test A',
    testType: 'free' as const,
    timeSlot: '12:00 AM – 02:00 AM',
    sessionLabel: 'Session 1 · Midnight'
  },
  {
    id: 'fa_02',
    testName: '【VIP Full Test】PTE Mock Test 37B (7th Aug. new version)',
    shortName: 'Mock Test 37B',
    testType: 'vip' as const,
    timeSlot: '09:00 AM – 11:00 AM',
    sessionLabel: 'Session 2 · Morning'
  },
  {
    id: 'fa_03',
    testName: '【VIP Full Test】PTE Mock Test 40B (7th Aug. new version)',
    shortName: 'Mock Test 40B',
    testType: 'vip' as const,
    timeSlot: '01:00 PM – 03:00 PM',
    sessionLabel: 'Session 3 · Afternoon'
  },
  {
    id: 'fa_04',
    testName: '【VIP Full Test】PTE Mock Test 45C',
    shortName: 'Mock Test 45C',
    testType: 'vip' as const,
    timeSlot: '04:00 PM – 06:00 PM',
    sessionLabel: 'Session 4 · Evening'
  }
];

export const BASELINE_MOCK_45C_SCORES = {
  overall: 59,
  listening: 64,
  reading: 40,
  speaking: 72,
  writing: 61,
  weaknesses: [
    { item: 'Reading FIB (Drag & Drop)', correctness: 6.7, target: 90.0, urgency: 'EMERGENCY' },
    { item: 'Reading & Writing FIB (Dropdown)', correctness: 34.8, target: 90.0, urgency: 'HIGH' },
    { item: 'Re-order Paragraphs (RO)', correctness: 33.3, target: 50.0, urgency: 'HIGH' },
    { item: 'Summarize Spoken Text (SST)', correctness: 50.0, target: 90.0, urgency: 'HIGH' },
    { item: 'Write From Dictation (WFD)', correctness: 57.1, target: 90.0, urgency: 'HIGH' },
    { item: 'Summarize Written Text (SWT)', correctness: 63.9, target: 95.0, urgency: 'MEDIUM' }
  ]
};

export const QUESTION_TYPES: QuestionTypeMeta[] = [
  // SPEAKING (Total: 50 targeted daily questions)
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 12,
    estMinutes: '12 min',
    isPrediction: true,
    scoreWeight: 15,
    maxScore: 90,
    description: 'Look at the image and describe its key points, trends, and conclusion in 40 seconds. (Highest PTE score weight: 15%)'
  },
  {
    id: 'repeat_sentence',
    name: 'Repeat Sentence',
    shortName: 'RS',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 20,
    estMinutes: '18 min',
    isPrediction: true,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Listen to a short recording and repeat the sentence accurately word-for-word. (PTE score weight: 7%)'
  },
  {
    id: 'read_aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    skill: 'speaking',
    secondarySkill: 'reading',
    defaultTarget: 12,
    estMinutes: '14 min',
    isPrediction: true,
    scoreWeight: 4,
    maxScore: 90,
    description: 'A text appears on screen. Read it aloud naturally with correct pronunciation and oral fluency. (PTE score weight: 4%)'
  },
  {
    id: 'summarize_group_discussion',
    name: 'Summarize Group Discussion',
    shortName: 'SGD',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 8,
    estMinutes: '10 min',
    isPrediction: true,
    scoreWeight: 9,
    maxScore: 90,
    description: 'Listen to multiple speakers discuss a topic and summarize their differing viewpoints. (High PTE score weight: 9%)'
  },
  {
    id: 'retell_lecture',
    name: 'Retell Lecture',
    shortName: 'RL',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 5,
    estMinutes: '8 min',
    isPrediction: false,
    scoreWeight: 6,
    maxScore: 90,
    description: 'Listen to a lecture and retell the main ideas and supporting details in your own words. (PTE score weight: 6%)'
  },
  {
    id: 'respond_to_situation',
    name: 'Respond to a Situation',
    shortName: 'RTS',
    skill: 'speaking',
    defaultTarget: 5,
    estMinutes: '8 min',
    isPrediction: false,
    scoreWeight: 6,
    maxScore: 90,
    description: 'Listen to a scenario description and provide a polite, context-appropriate spoken response. (PTE score weight: 6%)'
  },
  {
    id: 'answer_short_question',
    name: 'Answer Short Questions',
    shortName: 'ASQ',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 2,
    estMinutes: '3 min',
    isPrediction: false,
    scoreWeight: 2,
    maxScore: 90,
    description: 'Answer simple factual questions with one or a few concise words. (PTE score weight: 2%)'
  },

  // WRITING (Total: 6 targeted daily questions)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 4,
    estMinutes: '10 min',
    isPrediction: false,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Read a passage and write a one-sentence summary between 5 and 75 words. (PTE score weight: 7%)'
  },
  {
    id: 'write_essay',
    name: 'Write Essay',
    shortName: 'WE',
    skill: 'writing',
    defaultTarget: 4,
    estMinutes: '25 min',
    isPrediction: false,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Write a 200–300 word argumentative essay on a given prompt using proper structure. (PTE score weight: 7% - High Priority: 6 Mock Essays + 4 Practice Essays Daily)'
  },

  // READING (Total: 24 targeted daily questions)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 14,
    estMinutes: '18 min',
    isPrediction: true,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Drop-down vocabulary and grammar choices within a reading text. (PTE score weight: 7%)'
  },
  {
    id: 'r_fill_in_blanks',
    name: 'Reading: Fill in the Blanks',
    shortName: 'R FIB',
    skill: 'reading',
    defaultTarget: 8,
    estMinutes: '10 min',
    isPrediction: false,
    scoreWeight: 6,
    maxScore: 90,
    description: 'Drag and drop missing words into the text boxes. (PTE score weight: 6%)'
  },
  {
    id: 'reorder_paragraph',
    name: 'Reorder Paragraph',
    shortName: 'RO',
    skill: 'reading',
    defaultTarget: 2,
    estMinutes: '5 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence. (PTE score weight: 3%)'
  },

  // LISTENING (Total: 24 targeted daily questions)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 15,
    estMinutes: '15 min',
    isPrediction: true,
    scoreWeight: 5,
    maxScore: 90,
    description: 'Listen to a short sentence and type it out exactly with accurate spelling and punctuation. (PTE score weight: 5%)'
  },
  {
    id: 'listening_fill_in_blanks',
    name: 'Listening: Fill in the Blanks (Type In)',
    shortName: 'L FIB',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 3,
    estMinutes: '5 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Type in missing words while following along with the audio passage. (PTE score weight: 3%)'
  },
  {
    id: 'highlight_incorrect_words',
    name: 'Highlight Incorrect Words',
    shortName: 'HIW',
    skill: 'listening',
    secondarySkill: 'reading',
    defaultTarget: 3,
    estMinutes: '5 min',
    isPrediction: false,
    scoreWeight: 4,
    maxScore: 90,
    description: 'Click on words in the transcript that differ from what the speaker says. (PTE score weight: 4%)'
  },
  {
    id: 'summarize_spoken_text',
    name: 'Summarize Spoken Text',
    shortName: 'SST',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 3,
    estMinutes: '8 min',
    isPrediction: false,
    scoreWeight: 4,
    maxScore: 90,
    description: 'Listen to a short lecture and write a 50–70 word summary capturing key points. (PTE score weight: 4%)'
  }
];

export const QUESTION_TYPE_MAP = new Map<string, QuestionTypeMeta>(
  QUESTION_TYPES.map(q => [q.id, q])
);

export const DEFAULT_QUESTION_TARGETS: Record<string, number> = Object.fromEntries(
  QUESTION_TYPES.map(q => [q.id, q.defaultTarget])
);

/**
 * 16 High-Yield Priority Question Groups (100 Daily Questions):
 * Ordered strictly by PTE Score Weight Priority (Highest Impact First):
 * 1. Describe Image (DI) — 15% Score Weight · 12 Qs
 * 2. Summarize Group Discussion (SGD) — 9% Score Weight · 8 Qs
 * 3. Repeat Sentence (RS) — 7% Score Weight · 15 Qs
 * 4. Reading & Writing FIB (Dropdown) — 7% Score Weight · 10 Qs
 * 5. Summarize Written Text (SWT) — 7% Score Weight · 4 Qs
 * 6. Write Essay (WE) — 7% Score Weight · 2 Qs
 * 7. Retell Lecture (RL) — 6% Score Weight · 5 Qs
 * 8. Respond to a Situation (RTS) — 6% Score Weight · 5 Qs
 * 9. Reading FIB (Drag & Drop) — 6% Score Weight · 8 Qs
 * 10. Write from Dictation (WFD) — 5% Score Weight · 10 Qs
 * 11. Read Aloud (RA) — 4% Score Weight · 8 Qs
 * 12. Summarize Spoken Text (SST) — 4% Score Weight · 3 Qs
 * 13. Highlight Incorrect Words (HIW) — 4% Score Weight · 3 Qs
 * 14. Listening FIB (Type In) — 3% Score Weight · 3 Qs
 * 15. Reorder Paragraph (RO) — 3% Score Weight · 2 Qs
 * 16. Answer Short Question (ASQ) — 2% Score Weight · 2 Qs
 * Total: Exactly 100 Questions per day (+ 300 Exam Questions covered in 5 Daily Mocks = 400 Total Questions).
 */
function buildPriorityGroups(): StudyGroupDefinition[] {
  const groupColors = [
    'rose', 'fuchsia', 'amber', 'indigo', 'blue', 'cyan',
    'emerald', 'teal', 'violet', 'purple', 'sky', 'amber',
    'rose', 'emerald', 'blue', 'slate'
  ];

  const priorityOrderConfigs: {
    questionTypeId: string;
    priority: QuestionPriority;
    priorityLabel: string;
  }[] = [
    { questionTypeId: 'describe_image', priority: 'prediction', priorityLabel: 'Top Score Weight (15%)' },
    { questionTypeId: 'summarize_group_discussion', priority: 'prediction', priorityLabel: 'Top Score Weight (9%)' },
    { questionTypeId: 'repeat_sentence', priority: 'hard', priorityLabel: 'High Score Weight (7%)' },
    { questionTypeId: 'rw_fill_in_blanks', priority: 'hard', priorityLabel: 'High Score Weight (7%)' },
    { questionTypeId: 'summarize_written_text', priority: 'hard', priorityLabel: 'High Score Weight (7%)' },
    { questionTypeId: 'write_essay', priority: 'hard', priorityLabel: 'High Score Weight (7%)' },
    { questionTypeId: 'retell_lecture', priority: 'hard', priorityLabel: 'Score Weight (6%)' },
    { questionTypeId: 'respond_to_situation', priority: 'hard', priorityLabel: 'Score Weight (6%)' },
    { questionTypeId: 'r_fill_in_blanks', priority: 'hard', priorityLabel: 'Score Weight (6%)' },
    { questionTypeId: 'write_from_dictation', priority: 'medium', priorityLabel: 'Score Weight (5%)' },
    { questionTypeId: 'read_aloud', priority: 'medium', priorityLabel: 'Score Weight (4%)' },
    { questionTypeId: 'summarize_spoken_text', priority: 'medium', priorityLabel: 'Score Weight (4%)' },
    { questionTypeId: 'highlight_incorrect_words', priority: 'medium', priorityLabel: 'Score Weight (4%)' },
    { questionTypeId: 'listening_fill_in_blanks', priority: 'easy', priorityLabel: 'Supporting Weight (3%)' },
    { questionTypeId: 'reorder_paragraph', priority: 'easy', priorityLabel: 'Supporting Weight (3%)' },
    { questionTypeId: 'answer_short_question', priority: 'easy', priorityLabel: 'Supporting Weight (2%)' }
  ];

  return priorityOrderConfigs.map((cfg, idx) => {
    const meta = QUESTION_TYPE_MAP.get(cfg.questionTypeId);
    const count = meta?.defaultTarget || 10;
    const skills: ('speaking' | 'writing' | 'reading' | 'listening')[] = meta ? [meta.skill] : ['speaking'];
    if (meta?.secondarySkill && !skills.includes(meta.secondarySkill)) {
      skills.push(meta.secondarySkill);
    }

    return {
      id: cfg.questionTypeId,
      groupNumber: idx + 1,
      title: `${meta?.name || cfg.questionTypeId} (${meta?.scoreWeight || 0}% Weight)`,
      shortTitle: `${meta?.shortName || ''} · ${meta?.scoreWeight || 0}%`,
      subtitle: `${count} Questions · ${meta?.skill.toUpperCase()} · ${cfg.priorityLabel}`,
      skills,
      totalQuestions: count,
      color: groupColors[idx % groupColors.length],
      items: [
        {
          questionTypeId: cfg.questionTypeId,
          count,
          startInstanceIndex: 0,
          priority: cfg.priority,
          priorityLabel: cfg.priorityLabel,
          scoreWeight: meta?.scoreWeight || 0
        }
      ]
    };
  });
}

export const STUDY_GROUPS: StudyGroupDefinition[] = buildPriorityGroups();

export const PRIORITY_STYLES: Record<QuestionPriority, { bg: string; text: string; border: string; badge: string; icon: string }> = {
  prediction: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '⚡'
  },
  hard: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '🔥'
  },
  medium: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '🎯'
  },
  easy: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🟢'
  }
};

export interface PhaseQuestionType {
  typeId: string;
  name: string;
  shortName: string;
  count: number;
  scoreWeight: number;
  priorityLabel: string;
}

export interface PhaseDrillDefinition {
  id: string;
  drillKey: 'tongue_twister' | 'collocations_fwd' | 'collocations_bwd' | 'essay_template' | 'sgd_template';
  name: string;
  requirement: (dayNumber: number) => string;
  getTargetCount: (dayNumber: number) => number;
  notes: string;
}

export interface PhaseDefinition {
  phaseNumber: number; // 1 to 5
  id: string;
  title: string;
  subtitle: string;
  mockIndex: number; // 0 to 4 (Mock 1 to 5)
  mockName: string;
  timeSlot: string;
  sessionName: string;
  questionCount: number; // 20
  color: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  questionTypes: PhaseQuestionType[];
  drills: PhaseDrillDefinition[];
}

/**
 * Academic Collocations Target Progression:
 * Day 1: 100, each day +50 from previous day (Day 2: 150, Day 3: 200, Day 4: 250...)
 */
export function getAcademicCollocationsTarget(dayNumber: number): number {
  return 100 + Math.max(0, dayNumber - 1) * 50;
}

/**
 * Exactly 5 Daily Phases Configured Per User Request:
 * Phase 1: Mock Exam 1 · 20 Questions (DI 12 + SGD 8) · Tongue Twisters 2
 * Phase 2: Mock Exam 2 · 20 Questions (RS 15 + RL 5) · Academic Collocations Fwd (Day 1: 100, +50/day)
 * Phase 3: Mock Exam 3 · 20 Questions (R&W FIB 10 + R FIB 8 + RO 2) · Academic Collocations Bwd (Day 1: 100, +50/day)
 * Phase 4: Mock Exam 4 · 20 Questions (WFD 10 + RA 8 + WE 2) · Write Essay Template - 1 · SGD Template - 1
 * Phase 5: Mock Exam 5 · 20 Questions (RTS 5 + SWT 4 + SST 3 + HIW 3 + L FIB 3 + ASQ 2) · Write Essay Template - 1 · SGD Template - 1
 */
export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    phaseNumber: 1,
    id: 'phase1',
    title: 'Phase 1: Speaking Foundation & Fluency Warmup',
    subtitle: 'Mock Exam 1 · 20 Daily Questions · Tongue Twisters 2x',
    mockIndex: 0,
    mockName: 'Mock Exam 1',
    timeSlot: '8:00 AM – 10:00 AM',
    sessionName: 'Session 1: Morning Simulation',
    questionCount: 20,
    color: 'blue',
    accentBorder: 'border-blue-500/40',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-400',
    badgeBg: 'bg-blue-500/20',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-300',
    questionTypes: [
      {
        typeId: 'describe_image',
        name: 'Describe Image',
        shortName: 'DI',
        count: 12,
        scoreWeight: 15,
        priorityLabel: 'Top Score Weight (15%)'
      },
      {
        typeId: 'summarize_group_discussion',
        name: 'Summarize Group Discussion',
        shortName: 'SGD',
        count: 8,
        scoreWeight: 9,
        priorityLabel: 'Top Score Weight (9%)'
      }
    ],
    drills: [
      {
        id: 'tongue_twister',
        drillKey: 'tongue_twister',
        name: 'Tongue Twisters Enunciation Drill',
        requirement: () => '50 Twisters List x 2 Reps',
        getTargetCount: () => 2,
        notes: 'Speed, clarity, and continuous oral fluency enunciation drills.'
      }
    ]
  },
  {
    phaseNumber: 2,
    id: 'phase2',
    title: 'Phase 2: Oral Repetition & Forward Collocations',
    subtitle: 'Mock Exam 2 · 20 Daily Questions · Academic Collocations Fwd',
    mockIndex: 1,
    mockName: 'Mock Exam 2',
    timeSlot: '11:00 AM – 1:00 PM',
    sessionName: 'Session 2: Late Morning Simulation',
    questionCount: 20,
    color: 'purple',
    accentBorder: 'border-purple-500/40',
    accentBg: 'bg-purple-500/10',
    accentText: 'text-purple-400',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-300',
    questionTypes: [
      {
        typeId: 'repeat_sentence',
        name: 'Repeat Sentence',
        shortName: 'RS',
        count: 15,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      },
      {
        typeId: 'retell_lecture',
        name: 'Retell Lecture',
        shortName: 'RL',
        count: 5,
        scoreWeight: 6,
        priorityLabel: 'Score Weight (6%)'
      }
    ],
    drills: [
      {
        id: 'collocations_fwd',
        drillKey: 'collocations_fwd',
        name: 'Academic Collocations Forward',
        requirement: (d) => `Day ${d}: ${getAcademicCollocationsTarget(d)} Collocations (+50/day)`,
        getTargetCount: (d) => getAcademicCollocationsTarget(d),
        notes: 'Forward progression through Pearson Academic Collocations list (Day 1: 100, Day 2: 150, Day 3: 200...).'
      }
    ]
  },
  {
    phaseNumber: 3,
    id: 'phase3',
    title: 'Phase 3: Reading FIB Blanks & Backward Collocations',
    subtitle: 'Mock Exam 3 · 20 Daily Questions · Academic Collocations Bwd',
    mockIndex: 2,
    mockName: 'Mock Exam 3',
    timeSlot: '2:00 PM – 4:00 PM',
    sessionName: 'Session 3: Afternoon Simulation',
    questionCount: 20,
    color: 'emerald',
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    questionTypes: [
      {
        typeId: 'rw_fill_in_blanks',
        name: 'Reading & Writing FIB (Dropdown)',
        shortName: 'R&W FIB',
        count: 10,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      },
      {
        typeId: 'r_fill_in_blanks',
        name: 'Reading FIB (Drag & Drop)',
        shortName: 'R FIB',
        count: 8,
        scoreWeight: 6,
        priorityLabel: 'Score Weight (6%)'
      },
      {
        typeId: 'reorder_paragraph',
        name: 'Reorder Paragraph',
        shortName: 'RO',
        count: 2,
        scoreWeight: 3,
        priorityLabel: 'Supporting Weight (3%)'
      }
    ],
    drills: [
      {
        id: 'collocations_bwd',
        drillKey: 'collocations_bwd',
        name: 'Academic Collocations Backward',
        requirement: (d) => `Day ${d}: ${getAcademicCollocationsTarget(d)} Collocations in Reverse (+50/day)`,
        getTargetCount: (d) => getAcademicCollocationsTarget(d),
        notes: 'Backward progression through Pearson Academic Collocations in reverse order (Day 1: 100, Day 2: 150, Day 3: 200...).'
      }
    ]
  },
  {
    phaseNumber: 4,
    id: 'phase4',
    title: 'Phase 4: Dictation, Read Aloud & Template Mastery',
    subtitle: 'Mock Exam 4 · 20 Daily Questions · Essay Template - 1 · SGD Template - 1',
    mockIndex: 3,
    mockName: 'Mock Exam 4',
    timeSlot: '8:00 PM – 10:00 PM',
    sessionName: 'Session 4: Night Simulation',
    questionCount: 20,
    color: 'amber',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    questionTypes: [
      {
        typeId: 'write_from_dictation',
        name: 'Write From Dictation',
        shortName: 'WFD',
        count: 10,
        scoreWeight: 5,
        priorityLabel: 'Score Weight (5%)'
      },
      {
        typeId: 'read_aloud',
        name: 'Read Aloud',
        shortName: 'RA',
        count: 8,
        scoreWeight: 4,
        priorityLabel: 'Score Weight (4%)'
      },
      {
        typeId: 'write_essay',
        name: 'Write Essay',
        shortName: 'WE',
        count: 2,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      }
    ],
    drills: [
      {
        id: 'essay_template_p4',
        drillKey: 'essay_template',
        name: 'Write Essay Template - 1',
        requirement: () => 'Write Essay Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Essay Template practice (Discussion / Problem-Solution).'
      },
      {
        id: 'sgd_template_p4',
        drillKey: 'sgd_template',
        name: 'Summarize Group Discussion Template - 1',
        requirement: () => 'SGD Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Summarize Group Discussion 3-speaker template practice.'
      }
    ]
  },
  {
    phaseNumber: 5,
    id: 'phase5',
    title: 'Phase 5: Late Night Simulation & Synthesis Drills',
    subtitle: 'Mock Exam 5 · 20 Daily Questions · Essay Template - 1 · SGD Template - 1',
    mockIndex: 4,
    mockName: 'Mock Exam 5',
    timeSlot: '10:30 PM – 12:30 AM',
    sessionName: 'Mock 5: Late Night Simulation',
    questionCount: 20,
    color: 'rose',
    accentBorder: 'border-rose-500/40',
    accentBg: 'bg-rose-500/10',
    accentText: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-300',
    questionTypes: [
      {
        typeId: 'respond_to_situation',
        name: 'Respond to a Situation',
        shortName: 'RTS',
        count: 5,
        scoreWeight: 6,
        priorityLabel: 'Score Weight (6%)'
      },
      {
        typeId: 'summarize_written_text',
        name: 'Summarize Written Text',
        shortName: 'SWT',
        count: 4,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      },
      {
        typeId: 'summarize_spoken_text',
        name: 'Summarize Spoken Text',
        shortName: 'SST',
        count: 3,
        scoreWeight: 4,
        priorityLabel: 'Score Weight (4%)'
      },
      {
        typeId: 'highlight_incorrect_words',
        name: 'Highlight Incorrect Words',
        shortName: 'HIW',
        count: 3,
        scoreWeight: 4,
        priorityLabel: 'Score Weight (4%)'
      },
      {
        typeId: 'listening_fill_in_blanks',
        name: 'Listening FIB (Type In)',
        shortName: 'L FIB',
        count: 3,
        scoreWeight: 3,
        priorityLabel: 'Supporting Weight (3%)'
      },
      {
        typeId: 'answer_short_question',
        name: 'Answer Short Question',
        shortName: 'ASQ',
        count: 2,
        scoreWeight: 2,
        priorityLabel: 'Supporting Weight (2%)'
      }
    ],
    drills: [
      {
        id: 'essay_template_p5',
        drillKey: 'essay_template',
        name: 'Write Essay Template - 1',
        requirement: () => 'Write Essay Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Essay Template practice (Discussion / Problem-Solution).'
      },
      {
        id: 'sgd_template_p5',
        drillKey: 'sgd_template',
        name: 'Summarize Group Discussion Template - 1',
        requirement: () => 'SGD Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Summarize Group Discussion 3-speaker template practice.'
      }
    ]
  },
  {
    phaseNumber: 6,
    id: 'phase6',
    title: 'Phase 6: Midnight Peak Simulation & High-Yield Essay Mastery',
    subtitle: 'Mock Exam 6 · 20 Daily Questions · Essay Template - 1 · SGD Template - 1',
    mockIndex: 5,
    mockName: 'Mock Exam 6',
    timeSlot: '1:00 AM – 3:00 AM',
    sessionName: 'Mock 6: Midnight Peak Simulation',
    questionCount: 20,
    color: 'teal',
    accentBorder: 'border-teal-500/40',
    accentBg: 'bg-teal-500/10',
    accentText: 'text-teal-400',
    badgeBg: 'bg-teal-500/20',
    badgeBorder: 'border-teal-500/30',
    badgeText: 'text-teal-300',
    questionTypes: [
      {
        typeId: 'repeat_sentence',
        name: 'Repeat Sentence (High Frequency)',
        shortName: 'RS',
        count: 5,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      },
      {
        typeId: 'write_from_dictation',
        name: 'Write From Dictation (High Frequency)',
        shortName: 'WFD',
        count: 5,
        scoreWeight: 5,
        priorityLabel: 'Score Weight (5%)'
      },
      {
        typeId: 'read_aloud',
        name: 'Read Aloud (Fluency Speed)',
        shortName: 'RA',
        count: 4,
        scoreWeight: 4,
        priorityLabel: 'Score Weight (4%)'
      },
      {
        typeId: 'rw_fill_in_blanks',
        name: 'R&W FIB (Collocation Pairs)',
        shortName: 'R&W FIB',
        count: 4,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      },
      {
        typeId: 'write_essay',
        name: 'Write Essay (Prompt Mastery)',
        shortName: 'WE',
        count: 2,
        scoreWeight: 7,
        priorityLabel: 'High Score Weight (7%)'
      }
    ],
    drills: [
      {
        id: 'essay_template_p6',
        drillKey: 'essay_template',
        name: 'Write Essay Template - 1',
        requirement: () => 'Write Essay Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Essay Template practice (Discussion / Problem-Solution).'
      },
      {
        id: 'sgd_template_p6',
        drillKey: 'sgd_template',
        name: 'Summarize Group Discussion Template - 1',
        requirement: () => 'SGD Template - 1 rep',
        getTargetCount: () => 1,
        notes: 'Official PTE Bridge Summarize Group Discussion 3-speaker template practice.'
      }
    ]
  }
];

export const DEFAULT_ADDITIONAL_EXERCISES = [
  {
    id: 'tongue_twister',
    name: 'Tongue Twisters Enunciation Drill (Phase 1)',
    requirement: '50 Twisters List x 2 Reps',
    requiredCount: 2,
    phaseNumber: 1,
    notes: 'Phase 1: Speed, clarity, and continuous oral fluency enunciation drills.'
  },
  {
    id: 'collocations_fwd',
    name: 'Academic Collocations Forward (Phase 2)',
    requirement: 'Day 1: 100, +50 each day',
    requiredCount: 100,
    phaseNumber: 2,
    notes: 'Phase 2: Academic Collocations Fwd (Day 1: 100, Day 2: 150, Day 3: 200...).'
  },
  {
    id: 'collocations_bwd',
    name: 'Academic Collocations Backward (Phase 3)',
    requirement: 'Day 1: 100, +50 each day',
    requiredCount: 100,
    phaseNumber: 3,
    notes: 'Phase 3: Academic Collocations Bwd in reverse order (Day 1: 100, Day 2: 150, Day 3: 200...).'
  },
  {
    id: 'essay_template_p4',
    name: 'Write Essay Template (Phase 4)',
    requirement: 'Write Essay Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 4,
    notes: 'Phase 4: Official PTE Bridge Essay Template practice.'
  },
  {
    id: 'sgd_template_p4',
    name: 'Summarize Group Discussion Template (Phase 4)',
    requirement: 'SGD Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 4,
    notes: 'Phase 4: Official PTE Bridge SGD 3-speaker template practice.'
  },
  {
    id: 'essay_template_p5',
    name: 'Write Essay Template (Phase 5)',
    requirement: 'Write Essay Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 5,
    notes: 'Phase 5: Official PTE Bridge Essay Template practice.'
  },
  {
    id: 'sgd_template_p5',
    name: 'Summarize Group Discussion Template (Phase 5)',
    requirement: 'SGD Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 5,
    notes: 'Phase 5: Official PTE Bridge SGD 3-speaker template practice.'
  },
  {
    id: 'essay_template_p6',
    name: 'Write Essay Template (Phase 6)',
    requirement: 'Write Essay Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 6,
    notes: 'Phase 6: Official PTE Bridge Essay Template practice.'
  },
  {
    id: 'sgd_template_p6',
    name: 'Summarize Group Discussion Template (Phase 6)',
    requirement: 'SGD Template - 1 rep',
    requiredCount: 1,
    phaseNumber: 6,
    notes: 'Phase 6: Official PTE Bridge SGD 3-speaker template practice.'
  },
  // Backward compatibility aliases
  {
    id: 'academic_collocations',
    name: 'Pearson Academic Collocations',
    requirement: '100 Collocations / Day',
    requiredCount: 100,
    phaseNumber: 2,
    notes: 'Master 100 high-frequency Pearson academic collocations daily.'
  },
  {
    id: 'essay_template',
    name: 'PTE Bridge Essay Templates',
    requirement: 'Write 2x / Day',
    requiredCount: 2,
    phaseNumber: 4,
    notes: 'Practice writing official PTE Bridge essay templates.'
  }
];

export const DEFAULT_ADDITIONAL_TARGETS: Record<string, number> = Object.fromEntries(
  DEFAULT_ADDITIONAL_EXERCISES.map(e => [e.id, e.requiredCount])
);

export const SKILL_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  speaking: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  writing: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  reading: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  listening: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  }
};
