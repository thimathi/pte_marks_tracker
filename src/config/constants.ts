import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-28';
export const FINAL_TARGET_DATE = '2026-11-13'; // Exactly 17 Days: Oct 28 to Nov 13, 2026
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 17; // Exactly 17 Days Plan
export const DAILY_PRACTICE_TARGET = 300; // 10 Phases * 30 Qs = 300 Questions/Day (Speaking 170 · Writing 10 · Reading 60 · Listening 60)
export const TOTAL_PRACTICE_TARGET = 5100; // 17 practice days * 300 = 5,100 Questions (Exceeds 4,000+ benchmark)
export const DAILY_MOCK_TARGET = 3; // 3 Mocks every day across 17 days
export const TOTAL_MOCK_TARGET = 51; // 17 days * 3 = 51 Mocks (17 unique tests repeated 3 rounds)
export const MOCK_EXAM_QUESTIONS = 60;

export const DEFAULT_TARGET_SCORES: TargetScores = {
  overall: 79,
  speaking: 79,
  writing: 76,
  reading: 72,
  listening: 76,
  mockExam: 76,
};

// Target progression curve across 17 study days (from baseline 59 to summit 79)
export const DAY_TARGET_SCORES: number[] = [
  60, 61, 62, 64, 65, // Days 1–5: Baseline Stabilization & Rhythm
  67, 68, 70, 71, 72, // Days 6–10: Reading & Writing Acceleration
  73, 74, 75, 76, 77, // Days 11–15: Approaching Summit 76+
  78, 79              // Days 16–17: Peak 79+ Exam Ready
];

export function getDailyMockTarget(dayNumber: number): number {
  if (dayNumber === 1) return 1;
  if (dayNumber === 2 || dayNumber === 3) return 4;
  return 3;
}

export function getDailyPracticeTarget(dayNumber: number): number {
  if (dayNumber === 1) return 0;
  if (dayNumber >= 2 && dayNumber <= 13) return 319;
  return 318;
}

export function getMockExamsForDay(dayNumber: number): string[] {
  const count = getDailyMockTarget(dayNumber);
  return Array.from({ length: count }, (_, i) => `mock0${i + 1}`);
}

export function getExamNumberForMock(dayNumber: number, mockIndex: number): number {
  if (dayNumber === 1) {
    return 1;
  }
  if (dayNumber === 2) {
    return 1 + (mockIndex + 1); // 2, 3, 4, 5
  }
  if (dayNumber === 3) {
    return 5 + (mockIndex + 1); // 6, 7, 8, 9
  }
  return 9 + (dayNumber - 4) * 3 + (mockIndex + 1); // Day 4..17: 10..51
}

// 17 APEUni VIP Mock Exams (Repeated across 3 Rounds = 51 total mocks)
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
  '【VIP Full Test】PTE Mock Test 41B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 41A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 40B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 40A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 39B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 39A (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 38B (7th Aug. new version)',
  '【VIP Full Test】PTE Mock Test 38A (7th Aug. new version)'
];

export interface MockExamDetails {
  examNumber: number;
  testName: string;
  roundNumber: number;
  roundTitle: string;
  roundBadgeColor: string;
}

export function getMockExamDetails(examNumber: number): MockExamDetails {
  const safeNumber = Math.max(1, examNumber);
  const testIndex = (safeNumber - 1) % APEUNI_VIP_MOCKS.length;
  const roundNumber = Math.floor((safeNumber - 1) / APEUNI_VIP_MOCKS.length) + 1;
  const testName = APEUNI_VIP_MOCKS[testIndex] || `PTE Mock Test #${safeNumber}`;

  let roundTitle = 'Round 1: Diagnostic Baseline';
  let roundBadgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (roundNumber === 2) {
    roundTitle = 'Round 2: Targeted Error Correction';
    roundBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (roundNumber >= 3) {
    roundTitle = 'Round 3: Summit Peak 79+ Simulation';
    roundBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  }

  return {
    examNumber: safeNumber,
    testName,
    roundNumber,
    roundTitle,
    roundBadgeColor
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
  // SPEAKING (Total: 170 questions per day · 17 per phase · 3,400 over 20 days)
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 20,
    estMinutes: '20 min',
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
    defaultTarget: 50,
    estMinutes: '35 min',
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
    defaultTarget: 40,
    estMinutes: '32 min',
    isPrediction: true,
    scoreWeight: 4,
    maxScore: 90,
    description: 'A text appears on screen. Read it aloud naturally with correct pronunciation and oral fluency. (PTE score weight: 4% · 800 total over 20 days)'
  },
  {
    id: 'summarize_group_discussion',
    name: 'Summarize Group Discussion',
    shortName: 'SGD',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 20,
    estMinutes: '25 min',
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
    defaultTarget: 10,
    estMinutes: '18 min',
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
    defaultTarget: 10,
    estMinutes: '16 min',
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
    defaultTarget: 20,
    estMinutes: '15 min',
    isPrediction: false,
    scoreWeight: 2,
    maxScore: 90,
    description: 'Answer simple factual questions with one or a few concise words. (PTE score weight: 2%)'
  },

  // WRITING (Total: 10 questions per day · 1 per phase · 200 over 20 days)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 8,
    estMinutes: '20 min',
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

  // READING (Total: 60 questions per day · 6 per phase · 1,200 over 20 days)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 30,
    estMinutes: '40 min',
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
    defaultTarget: 20,
    estMinutes: '25 min',
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
    defaultTarget: 10,
    estMinutes: '15 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence. (PTE score weight: 3%)'
  },

  // LISTENING (Total: 60 questions per day · 6 per phase · 1,200 over 20 days)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 30,
    estMinutes: '30 min',
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
    defaultTarget: 10,
    estMinutes: '15 min',
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
    defaultTarget: 10,
    estMinutes: '15 min',
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
    defaultTarget: 10,
    estMinutes: '20 min',
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
 * 10 User-Defined Focused Phases per day (Reordered):
 * Phase 1: 20 ASQ + 10 SGD = 30 Qs
 * Phase 2: 30 R&W FIB (Dropdown) = 30 Qs
 * Phase 3: 10 RL + 20 DI = 30 Qs
 * Phase 4: 8 SWT + 2 WE + 10 SST = 20 Qs
 * Phase 5: 30 WFD = 30 Qs  (Mid-Day Checkpoint: Mock Exam #1)
 * Phase 6: 20 R FIB (Drag & Drop) + 10 L FIB (Type In) = 30 Qs
 * Phase 7: 15 RS + 5 RA + 10 SGD = 30 Qs
 * Phase 8: 15 RS + 15 RA = 30 Qs  (Afternoon Checkpoint: Mock Exam #2)
 * Phase 9: 20 RS + 20 RA = 40 Qs
 * Phase 10: 10 RTS + 10 RO + 10 HIW = 30 Qs  (End-of-Day Checkpoint: Mock Exam #3)
 * Total: Exactly 300 Questions per day.
 */
function build10Phases(): StudyGroupDefinition[] {
  const phaseColors = ['blue', 'indigo', 'purple', 'violet', 'fuchsia', 'cyan', 'teal', 'emerald', 'amber', 'rose'];

  const phaseConfigs: {
    groupNumber: number;
    title: string;
    shortTitle: string;
    subtitle: string;
    skills: ('speaking' | 'writing' | 'reading' | 'listening')[];
    checkpointMock?: number;
    items: {
      questionTypeId: string;
      count: number;
      startInstanceIndex: number;
      priority: QuestionPriority;
      priorityLabel: string;
      scoreWeight: number;
    }[];
  }[] = [
    // Phase 1: 20 ASQ + 10 SGD = 30 Qs (Current Phase 1)
    {
      groupNumber: 1,
      title: 'Phase 1: Speed & Fluency (30 Qs)',
      shortTitle: 'Phase 1',
      subtitle: '20 ASQ · 10 SGD',
      skills: ['speaking'],
      items: [
        { questionTypeId: 'answer_short_question', count: 20, startInstanceIndex: 0, priority: 'easy', priorityLabel: 'Supporting Weight (2%)', scoreWeight: 2 },
        { questionTypeId: 'summarize_group_discussion', count: 10, startInstanceIndex: 0, priority: 'prediction', priorityLabel: 'Top Score Weight (9%)', scoreWeight: 9 }
      ]
    },
    // Phase 2: 30 R&W FIB (Dropdown) = 30 Qs (Current Phase 8 -> Phase 2)
    {
      groupNumber: 2,
      title: 'Phase 2: Collocation Mastery (30 Qs)',
      shortTitle: 'Phase 2',
      subtitle: '30 R&W FIB (Dropdown)',
      skills: ['reading'],
      items: [
        { questionTypeId: 'rw_fill_in_blanks', count: 30, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 }
      ]
    },
    // Phase 3: 10 RL + 20 DI = 30 Qs (Current Phase 5 -> Phase 3)
    {
      groupNumber: 3,
      title: 'Phase 3: High-Yield Speaking (30 Qs)',
      shortTitle: 'Phase 3',
      subtitle: '10 RL · 20 DI',
      skills: ['speaking'],
      items: [
        { questionTypeId: 'retell_lecture', count: 10, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (6%)', scoreWeight: 6 },
        { questionTypeId: 'describe_image', count: 20, startInstanceIndex: 0, priority: 'prediction', priorityLabel: 'Top Score Weight (15%)', scoreWeight: 15 }
      ]
    },
    // Phase 4: 8 SWT + 2 WE + 10 SST = 20 Qs (Current Phase 4)
    {
      groupNumber: 4,
      title: 'Phase 4: Writing & Summary Master (20 Qs)',
      shortTitle: 'Phase 4',
      subtitle: '8 SWT · 2 WE · 10 SST',
      skills: ['writing', 'listening'],
      items: [
        { questionTypeId: 'summarize_written_text', count: 8, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 },
        { questionTypeId: 'write_essay', count: 2, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 },
        { questionTypeId: 'summarize_spoken_text', count: 10, startInstanceIndex: 0, priority: 'medium', priorityLabel: 'Score Weight (4%)', scoreWeight: 4 }
      ]
    },
    // Phase 5: 30 WFD = 30 Qs (Current Phase 7 -> Phase 5) (Mid-Day Checkpoint: Mock Exam #1)
    {
      groupNumber: 5,
      title: 'Phase 5: Dictation Fortress (30 Qs)',
      shortTitle: 'Phase 5',
      subtitle: '30 WFD',
      skills: ['listening'],
      checkpointMock: 1,
      items: [
        { questionTypeId: 'write_from_dictation', count: 30, startInstanceIndex: 0, priority: 'medium', priorityLabel: 'Core Score Weight (5%)', scoreWeight: 5 }
      ]
    },
    // Phase 6: 20 R FIB + 10 L FIB = 30 Qs (Current Phase 9 -> Phase 6)
    {
      groupNumber: 6,
      title: 'Phase 6: Blanks Precision (30 Qs)',
      shortTitle: 'Phase 6',
      subtitle: '20 R FIB · 10 L FIB',
      skills: ['reading', 'listening'],
      items: [
        { questionTypeId: 'r_fill_in_blanks', count: 20, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (6%)', scoreWeight: 6 },
        { questionTypeId: 'listening_fill_in_blanks', count: 10, startInstanceIndex: 0, priority: 'easy', priorityLabel: 'Supporting Weight (3%)', scoreWeight: 3 }
      ]
    },
    // Phase 7: 15 RS + 5 RA + 10 SGD = 30 Qs (Current Phase 10 -> Phase 7)
    {
      groupNumber: 7,
      title: 'Phase 7: Oral Push & Speed (30 Qs)',
      shortTitle: 'Phase 7',
      subtitle: '15 RS · 5 RA · 10 SGD',
      skills: ['speaking'],
      items: [
        { questionTypeId: 'repeat_sentence', count: 15, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 },
        { questionTypeId: 'read_aloud', count: 5, startInstanceIndex: 0, priority: 'medium', priorityLabel: 'Score Weight (4%)', scoreWeight: 4 },
        { questionTypeId: 'summarize_group_discussion', count: 10, startInstanceIndex: 10, priority: 'prediction', priorityLabel: 'Top Score Weight (9%)', scoreWeight: 9 }
      ]
    },
    // Phase 8: 15 RS + 15 RA = 30 Qs (Current Phase 2 -> Phase 8) (Afternoon Checkpoint: Mock Exam #2)
    {
      groupNumber: 8,
      title: 'Phase 8: Oral Foundations (30 Qs)',
      shortTitle: 'Phase 8',
      subtitle: '15 RS · 15 RA',
      skills: ['speaking'],
      checkpointMock: 2,
      items: [
        { questionTypeId: 'repeat_sentence', count: 15, startInstanceIndex: 15, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 },
        { questionTypeId: 'read_aloud', count: 15, startInstanceIndex: 5, priority: 'medium', priorityLabel: 'Score Weight (4%)', scoreWeight: 4 }
      ]
    },
    // Phase 9: 20 RS + 20 RA = 40 Qs (Current Phase 6 -> Phase 9)
    {
      groupNumber: 9,
      title: 'Phase 9: Core Speech Power (40 Qs)',
      shortTitle: 'Phase 9',
      subtitle: '20 RS · 20 RA',
      skills: ['speaking'],
      items: [
        { questionTypeId: 'repeat_sentence', count: 20, startInstanceIndex: 30, priority: 'hard', priorityLabel: 'High Score Weight (7%)', scoreWeight: 7 },
        { questionTypeId: 'read_aloud', count: 20, startInstanceIndex: 20, priority: 'medium', priorityLabel: 'Score Weight (4%)', scoreWeight: 4 }
      ]
    },
    // Phase 10: 10 RTS + 10 RO + 10 HIW = 30 Qs (Current Phase 3 -> Phase 10) (End-of-Day Checkpoint: Mock Exam #3)
    {
      groupNumber: 10,
      title: 'Phase 10: Logic & Attention (30 Qs)',
      shortTitle: 'Phase 10',
      subtitle: '10 RTS · 10 RO · 10 HIW',
      skills: ['speaking', 'reading', 'listening'],
      checkpointMock: 3,
      items: [
        { questionTypeId: 'respond_to_situation', count: 10, startInstanceIndex: 0, priority: 'hard', priorityLabel: 'High Score Weight (6%)', scoreWeight: 6 },
        { questionTypeId: 'reorder_paragraph', count: 10, startInstanceIndex: 0, priority: 'easy', priorityLabel: 'Supporting Weight (3%)', scoreWeight: 3 },
        { questionTypeId: 'highlight_incorrect_words', count: 10, startInstanceIndex: 0, priority: 'medium', priorityLabel: 'Score Weight (4%)', scoreWeight: 4 }
      ]
    }
  ];

  return phaseConfigs.map((cfg, idx) => ({
    id: `phase_${cfg.groupNumber}`,
    groupNumber: cfg.groupNumber,
    title: cfg.title,
    shortTitle: cfg.shortTitle,
    subtitle: cfg.subtitle,
    skills: cfg.skills,
    totalQuestions: cfg.items.reduce((acc, item) => acc + item.count, 0),
    color: phaseColors[idx % phaseColors.length],
    items: cfg.items,
    checkpointMock: cfg.checkpointMock
  }));
}

export const STUDY_GROUPS: StudyGroupDefinition[] = build10Phases();

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

export const DEFAULT_ADDITIONAL_EXERCISES = [
  {
    id: 'tongue_twister',
    name: 'Tongue Twisters Enunciation Drill',
    requirement: '50 Twisters List x 2 Reps / Day',
    requiredCount: 2,
    notes: 'Speed, clarity, and continuous oral fluency enunciation drills.'
  },
  {
    id: 'academic_collocations',
    name: 'Pearson Academic Collocations',
    requirement: '100 Collocations / Day',
    requiredCount: 100,
    notes: 'Master 100 high-frequency Pearson academic collocations daily for Reading & Writing FIB.'
  },
  {
    id: 'essay_template',
    name: 'PTE Bridge Essay Templates',
    requirement: 'Write 2x / Day (Discussion + Problems/Solutions)',
    requiredCount: 2,
    notes: 'Practice writing the two official PTE Bridge essay templates (Discussion & Problems/Solutions).'
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
