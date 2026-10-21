import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-20';
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 25;
export const DAILY_PRACTICE_TARGET = 180; // 4 Phases: 45 + 45 + 45 + 45 = 180
export const TOTAL_PRACTICE_TARGET = 4500; // 25 * 180
export const DAILY_MOCK_TARGET = 1;
export const TOTAL_MOCK_TARGET = 25; // 25 * 1
export const MOCK_EXAM_QUESTIONS = 60;

export const DEFAULT_TARGET_SCORES: TargetScores = {
  overall: 79,
  speaking: 79,
  writing: 79,
  reading: 79,
  listening: 79,
  mockExam: 80,
};

// Target progression curve across 25 study days (Mountain Climb Staircase from 62 to 86)
export const DAY_TARGET_SCORES: number[] = [
  62, 63, 64, 65, 66, // Basecamp (Days 1–5): Foundation & Rhythm
  68, 69, 70, 71, 72, // Step 1 (Days 6–10): Prediction Sprint
  73, 74, 75, 76, 77, // Step 2 (Days 11–15): The 75+ Push
  78, 79, 80, 81, 82, // Step 3 (Days 16–20): 79+ Mountain Ridge Mastery
  83, 84, 85, 85, 86  // The Summit (Days 21–25): Peak Performance & Final Exam Simulation
];

export const QUESTION_TYPES: QuestionTypeMeta[] = [
  // SPEAKING (Total: 94 across tasks)
  {
    id: 'read_aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    skill: 'speaking',
    secondarySkill: 'reading',
    defaultTarget: 23,
    estMinutes: '20 min',
    isPrediction: true,
    maxScore: 90,
    description: 'A text appears on screen. Read it aloud naturally with correct pronunciation and oral fluency.'
  },
  {
    id: 'repeat_sentence',
    name: 'Repeat Sentence',
    shortName: 'RS',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 38,
    estMinutes: '30 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Listen to a short recording and repeat the sentence accurately word-for-word.'
  },
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 10,
    estMinutes: '15 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Look at the image and describe its key points, trends, and conclusion in 40 seconds.'
  },
  {
    id: 'retell_lecture',
    name: 'Retell Lecture',
    shortName: 'RL',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 7,
    estMinutes: '15 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Listen to a lecture and retell the main ideas and supporting details in your own words.'
  },
  {
    id: 'respond_to_situation',
    name: 'Respond to a Situation',
    shortName: 'RTS',
    skill: 'speaking',
    defaultTarget: 6, // Phase 1: 5, Phase 2: 1
    estMinutes: '10 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Listen to a scenario description and provide a polite, context-appropriate spoken response.'
  },
  {
    id: 'summarize_group_discussion',
    name: 'Summarize Group Discussion',
    shortName: 'SGD',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 8, // Phase 2: 6, Phase 3: 2
    estMinutes: '15 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Listen to multiple speakers discuss a topic and summarize their differing viewpoints.'
  },
  {
    id: 'answer_short_question',
    name: 'Answer Short Questions',
    shortName: 'ASQ',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 10,
    estMinutes: '8 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Answer simple factual questions with one or a few concise words.'
  },

  // WRITING (Total: 3)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 2,
    estMinutes: '20 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Read a passage and write a one-sentence summary between 5 and 75 words.'
  },
  {
    id: 'write_essay',
    name: 'Write Essay',
    shortName: 'WE',
    skill: 'writing',
    defaultTarget: 1,
    estMinutes: '20 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Write a 200–300 word argumentative essay on a given prompt using proper structure.'
  },

  // READING (Total: 40)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 20,
    estMinutes: '25 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Drop-down vocabulary and grammar choices within a reading text.'
  },
  {
    id: 'r_fill_in_blanks',
    name: 'Reading: Fill in the Blanks',
    shortName: 'R FIB',
    skill: 'reading',
    defaultTarget: 15, // Phase 3: 10, Phase 4: 5
    estMinutes: '20 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Drag and drop missing words into the text boxes.'
  },
  {
    id: 'reorder_paragraph',
    name: 'Reorder Paragraph',
    shortName: 'RO',
    skill: 'reading',
    defaultTarget: 5,
    estMinutes: '10 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence.'
  },

  // LISTENING (Total: 35)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 22,
    estMinutes: '18 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Listen to a short sentence and type it out exactly with accurate spelling and punctuation.'
  },
  {
    id: 'listening_fill_in_blanks',
    name: 'Listening: Fill in the Blanks (Type In)',
    shortName: 'L FIB',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 6,
    estMinutes: '10 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Type in missing words while following along with the audio passage.'
  },
  {
    id: 'highlight_incorrect_words',
    name: 'Highlight Incorrect Words',
    shortName: 'HIW',
    skill: 'listening',
    secondarySkill: 'reading',
    defaultTarget: 5,
    estMinutes: '8 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Click on words in the transcript that differ from what the speaker says.'
  },
  {
    id: 'summarize_spoken_text',
    name: 'Summarize Spoken Text',
    shortName: 'SST',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 2,
    estMinutes: '20 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Listen to a short lecture and write a 50–70 word summary capturing key points.'
  }
];

export const QUESTION_TYPE_MAP = new Map<string, QuestionTypeMeta>(
  QUESTION_TYPES.map(q => [q.id, q])
);

export const DEFAULT_QUESTION_TARGETS: Record<string, number> = Object.fromEntries(
  QUESTION_TYPES.map(q => [q.id, q.defaultTarget])
);

/**
 * 4 Study Phases (Mock-Style Papers: 45 Questions / 2–3 Hours Each) Totaling Exactly 180 Questions
 * Priority Ordered: Prediction First ➔ Hard Question ➔ Medium Question ➔ Easy & Beginner Last
 */
export const STUDY_GROUPS: StudyGroupDefinition[] = [
  {
    id: 'group_1',
    groupNumber: 1,
    title: 'Phase 1 — Speaking (Mock Paper 1)',
    shortTitle: 'Phase 1',
    subtitle: 'Speaking Mastery (45 Qs · 2–3 hrs)',
    skills: ['speaking'],
    totalQuestions: 45,
    color: 'blue',
    items: [
      {
        questionTypeId: 'read_aloud',
        count: 23,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'retell_lecture',
        count: 7,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'describe_image',
        count: 10,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'respond_to_situation',
        count: 5,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_2',
    groupNumber: 2,
    title: 'Phase 2 — Speaking & Writing (Mock Paper 2)',
    shortTitle: 'Phase 2',
    subtitle: 'Recall & Group Discussion (45 Qs · 2–3 hrs)',
    skills: ['speaking', 'writing'],
    totalQuestions: 45,
    color: 'purple',
    items: [
      {
        questionTypeId: 'repeat_sentence',
        count: 38,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_group_discussion',
        count: 6,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'respond_to_situation',
        count: 1,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 5 // following Phase 1's 5 items (0-4)
      }
    ]
  },
  {
    id: 'group_3',
    groupNumber: 3,
    title: 'Phase 3 — Writing & Reading (Mock Paper 3)',
    shortTitle: 'Phase 3',
    subtitle: 'Blanks, Essays & Comprehension (45 Qs · 2–3 hrs)',
    skills: ['writing', 'reading'],
    totalQuestions: 45,
    color: 'emerald',
    items: [
      {
        questionTypeId: 'rw_fill_in_blanks',
        count: 20,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'r_fill_in_blanks',
        count: 10,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_group_discussion',
        count: 2,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 6 // following Phase 2's 6 items (0-5)
      },
      {
        questionTypeId: 'summarize_written_text',
        count: 2,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'write_essay',
        count: 1,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'answer_short_question',
        count: 10,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_4',
    groupNumber: 4,
    title: 'Phase 4 — Reading & Listening (Mock Paper 4)',
    shortTitle: 'Phase 4',
    subtitle: 'Dictation & Audio Analytics (45 Qs · 2–3 hrs)',
    skills: ['reading', 'listening'],
    totalQuestions: 45,
    color: 'amber',
    items: [
      {
        questionTypeId: 'write_from_dictation',
        count: 22,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_spoken_text',
        count: 2,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'reorder_paragraph',
        count: 5,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'r_fill_in_blanks',
        count: 5,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 10 // following Phase 3's 10 items (0-9)
      },
      {
        questionTypeId: 'listening_fill_in_blanks',
        count: 6,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'highlight_incorrect_words',
        count: 5,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 0
      }
    ]
  }
];

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
    requirement: '2 Times daily',
    requiredCount: 2,
    notes: 'Speed, clarity, and continuous oral fluency enunciation drills.'
  },
  {
    id: 'academic_collocations',
    name: 'Academic Collocations Words Drill',
    requirement: '2 Times daily',
    requiredCount: 2,
    notes: 'High-frequency academic collocation pairs for perfect Reading & Writing FIB accuracy.'
  },
  {
    id: 'essay_template',
    name: 'Write Essay Template Practice',
    requirement: '3 Times daily',
    requiredCount: 3,
    notes: 'Speed-type and memorize the standard 4-paragraph PTE 79+ essay template without hesitation.'
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
