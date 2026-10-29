import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-28';
export const FINAL_TARGET_DATE = '2026-11-13'; // Exactly 17 Days: Oct 28 to Nov 13, 2026
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 17; // Exactly 17 Days Plan
export const DAILY_PRACTICE_TARGET = 300; // 300 Questions/Day ordered by High Score Weight Priority
export const TOTAL_PRACTICE_TARGET = 5100; // 17 practice days * 300 = 5,100 Questions
export const DAILY_MOCK_TARGET = 4; // 4 Mock Exams every day across 17 days
export const TOTAL_MOCK_TARGET = 68; // 17 days * 4 = 68 Mocks total (4 Mocks/Day)
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

export function getDailyMockTarget(_dayNumber: number): number {
  return 4;
}

export function getDailyPracticeTarget(_dayNumber: number): number {
  return 300;
}

export function getMockExamsForDay(_dayNumber: number): string[] {
  return ['mock01', 'mock02', 'mock03', 'mock04'];
}

export function getExamNumberForMock(dayNumber: number, mockIndex: number): number {
  return (dayNumber - 1) * 4 + (mockIndex + 1);
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
 * 16 High-Yield Priority Question Groups (300 Questions/Day):
 * Ordered strictly by PTE Score Weight Priority (Highest Impact First):
 * 1. Describe Image (DI) — 15% Score Weight · 20 Qs
 * 2. Summarize Group Discussion (SGD) — 9% Score Weight · 20 Qs
 * 3. Repeat Sentence (RS) — 7% Score Weight · 50 Qs
 * 4. Reading & Writing FIB (Dropdown) — 7% Score Weight · 30 Qs
 * 5. Summarize Written Text (SWT) — 7% Score Weight · 8 Qs
 * 6. Write Essay (WE) — 7% Score Weight · 2 Qs
 * 7. Retell Lecture (RL) — 6% Score Weight · 10 Qs
 * 8. Respond to a Situation (RTS) — 6% Score Weight · 10 Qs
 * 9. Reading FIB (Drag & Drop) — 6% Score Weight · 20 Qs
 * 10. Write from Dictation (WFD) — 5% Score Weight · 30 Qs
 * 11. Read Aloud (RA) — 4% Score Weight · 40 Qs
 * 12. Summarize Spoken Text (SST) — 4% Score Weight · 10 Qs
 * 13. Highlight Incorrect Words (HIW) — 4% Score Weight · 10 Qs
 * 14. Listening FIB (Type In) — 3% Score Weight · 10 Qs
 * 15. Reorder Paragraph (RO) — 3% Score Weight · 10 Qs
 * 16. Answer Short Question (ASQ) — 2% Score Weight · 20 Qs
 * Total: Exactly 300 Questions per day.
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
