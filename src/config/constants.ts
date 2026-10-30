import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-30';
export const FINAL_TARGET_DATE = '2026-11-13'; // Exactly 15 Days: Oct 30 to Nov 13, 2026
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 15; // Exactly 15 Days Mission
export const DAILY_PRACTICE_TARGET = 100; // 100 Daily Questions ordered across 5 phases (20 Qs per phase)
export const TOTAL_PRACTICE_TARGET = 1500; // 15 practice days * 100 = 1,500 Individual Questions
export const DAILY_MOCK_TARGET = 5; // 5 Mock Exams every day (1 Mock per phase)
export const TOTAL_MOCK_TARGET = 75; // 15 days * 5 = 75 Mocks total (2 Full Rounds of 35 Shuffled VIP Tests + Final Summit Simulation)
export const MOCK_EXAM_QUESTIONS = 60;
export const TOTAL_MOCK_EXAM_QUESTIONS = 4500; // 75 mocks * 60 questions = 4,500 Mock Exam Questions
export const TOTAL_MISSION_QUESTIONS = 6000; // 1,500 Individual Questions + 4,500 Mock Questions = 6,000 Questions Cover With Review & Progress

export interface MockScheduleSlot {
  mockIndex: number;
  timeSlot: string;
  sessionName: string;
}

export const DAILY_MOCK_SCHEDULE: MockScheduleSlot[] = [
  { mockIndex: 0, timeSlot: '8:00 AM – 10:00 AM', sessionName: 'Session 1: Morning Simulation' },
  { mockIndex: 1, timeSlot: '11:00 AM – 1:00 PM', sessionName: 'Session 2: Late Morning Simulation' },
  { mockIndex: 2, timeSlot: '2:00 PM – 4:00 PM', sessionName: 'Session 3: Afternoon Simulation' },
  { mockIndex: 3, timeSlot: '8:00 PM – 10:00 PM', sessionName: 'Session 4: Night Simulation' },
  { mockIndex: 4, timeSlot: '11:00 PM – 1:00 AM', sessionName: 'Session 5: Late Night Peak Simulation' }
];

export const DEFAULT_TARGET_SCORES: TargetScores = {
  overall: 79,
  speaking: 79,
  writing: 76,
  reading: 72,
  listening: 76,
  mockExam: 76,
};

// Target progression curve across 15 study days (from baseline 60 to summit 79)
export const DAY_TARGET_SCORES: number[] = [
  60, 61, 63, 64, 66, // Days 1–5: Baseline Stabilization & Rhythm
  68, 69, 71, 72, 73, // Days 6–10: Reading & Writing Acceleration
  74, 75, 77, 78, 79  // Days 11–15: Approaching & Achieving Summit Peak 79+
];

export function getDailyMockTarget(_dayNumber: number): number {
  return 5;
}

export function getDailyPracticeTarget(_dayNumber: number): number {
  return 100;
}

export function getMockExamsForDay(_dayNumber: number): string[] {
  return ['mock01', 'mock02', 'mock03', 'mock04', 'mock05'];
}

export function getExamNumberForMock(dayNumber: number, mockIndex: number): number {
  return (dayNumber - 1) * 5 + (mockIndex + 1);
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
 * 75 Planned Mock Exams Across 15 Days (5 Mocks / Day):
 * - Round 1 (Days 1–7, Mocks 1–35): All 35 papers shuffled (Complete 1st Pass)
 * - Round 2 (Days 8–14, Mocks 36–70): All 35 papers re-shuffled (Complete 2nd Pass Error Correction)
 * - Round 3 / Summit (Day 15, Mocks 71–75): Top 5 VIP Mock Tests (Mock 45C, 44C, 44B, 44A, 43B)
 */
export const MOCK_EXAM_SCHEDULE_INDICES: number[] = [
  ...generateSeededPermutation(35, 777),   // Round 1: 35 tests
  ...generateSeededPermutation(35, 1492),  // Round 2: 35 tests
  0, 1, 2, 3, 5                            // Day 15 Summit: 5 top tests (45C, 44C, 44B, 44A, 43B)
];

export interface MockExamDetails {
  examNumber: number;
  testName: string;
  roundNumber: number;
  roundTitle: string;
  roundBadgeColor: string;
  paperNumber: number;
  timeSlot: string;
  sessionName: string;
}

export function getMockExamDetails(examNumber: number): MockExamDetails {
  const safeNumber = Math.max(1, examNumber);
  const scheduleIndex = (safeNumber - 1) % MOCK_EXAM_SCHEDULE_INDICES.length;
  const paperIndex = MOCK_EXAM_SCHEDULE_INDICES[scheduleIndex] ?? 0;
  const testName = APEUNI_VIP_MOCKS[paperIndex] || `PTE Mock Test #${safeNumber}`;

  let roundNumber = 1;
  let roundTitle = 'Round 1: Shuffled Diagnostic Simulation';
  let roundBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';

  if (safeNumber > 70) {
    roundNumber = 3;
    roundTitle = 'Round 3: Grand Summit 79+ Peak Simulation';
    roundBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  } else if (safeNumber > 35) {
    roundNumber = 2;
    roundTitle = 'Round 2: Shuffled Error Correction & 2nd Pass';
    roundBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }

  const slotIndex = (safeNumber - 1) % DAILY_MOCK_SCHEDULE.length;
  const scheduleSlot = DAILY_MOCK_SCHEDULE[slotIndex] || DAILY_MOCK_SCHEDULE[0];

  return {
    examNumber: safeNumber,
    testName,
    roundNumber,
    roundTitle,
    roundBadgeColor,
    paperNumber: paperIndex + 1,
    timeSlot: scheduleSlot.timeSlot,
    sessionName: scheduleSlot.sessionName
  };
}

export function getMockExamTitle(examNumber: number): string {
  const details = getMockExamDetails(examNumber);
  return `${details.testName} (${details.roundTitle.split(':')[0]})`;
}

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
    defaultTarget: 15,
    estMinutes: '15 min',
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
    defaultTarget: 8,
    estMinutes: '10 min',
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
    defaultTarget: 2,
    estMinutes: '20 min',
    isPrediction: false,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Write a 200–300 word argumentative essay on a given prompt using proper structure. (PTE score weight: 7%)'
  },

  // READING (Total: 20 targeted daily questions)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 10,
    estMinutes: '15 min',
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

  // LISTENING (Total: 19 targeted daily questions)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 10,
    estMinutes: '10 min',
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
    title: 'Phase 5: Synthesis, Speed & Template Reinforcement',
    subtitle: 'Mock Exam 5 · 20 Daily Questions · Essay Template - 1 · SGD Template - 1',
    mockIndex: 4,
    mockName: 'Mock Exam 5',
    timeSlot: '11:00 PM – 1:00 AM',
    sessionName: 'Session 5: Late Night Peak Simulation',
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
