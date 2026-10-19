import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-20';
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 25;
export const DAILY_PRACTICE_TARGET = 278; // 4 Groups: 69 + 70 + 69 + 70 = 278
export const TOTAL_PRACTICE_TARGET = 6950; // 25 * 278
export const DAILY_MOCK_TARGET = 2;
export const TOTAL_MOCK_TARGET = 50; // 25 * 2
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
  // SPEAKING (Total: 147 across tasks)
  {
    id: 'read_aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    skill: 'speaking',
    secondarySkill: 'reading',
    defaultTarget: 35,
    estMinutes: '30 min',
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
    defaultTarget: 60,
    estMinutes: '45 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Listen to a short recording and repeat the sentence accurately word-for-word.'
  },
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 15,
    estMinutes: '20 min',
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
    defaultTarget: 10,
    estMinutes: '20 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Listen to a lecture and retell the main ideas and supporting details in your own words.'
  },
  {
    id: 'respond_to_situation',
    name: 'Respond to a Situation',
    shortName: 'RTS',
    skill: 'speaking',
    defaultTarget: 10, // Group 1: 9, Group 2: 1
    estMinutes: '15 min',
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
    defaultTarget: 12, // Group 2: 9, Group 3: 3
    estMinutes: '25 min',
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
    defaultTarget: 15,
    estMinutes: '10 min',
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

  // READING (Total: 63)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 30,
    estMinutes: '40 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Drop-down vocabulary and grammar choices within a reading text.'
  },
  {
    id: 'r_fill_in_blanks',
    name: 'Reading: Fill in the Blanks',
    shortName: 'R FIB',
    skill: 'reading',
    defaultTarget: 25, // Group 3: 18, Group 4: 7
    estMinutes: '30 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Drag and drop missing words into the text boxes.'
  },
  {
    id: 'reorder_paragraph',
    name: 'Reorder Paragraph',
    shortName: 'RO',
    skill: 'reading',
    defaultTarget: 8,
    estMinutes: '15 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence.'
  },

  // LISTENING (Total: 55)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 35,
    estMinutes: '25 min',
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
    defaultTarget: 10,
    estMinutes: '15 min',
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
    defaultTarget: 8,
    estMinutes: '10 min',
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
 * 4 Study Groups (Sections / Mock-Style Papers) Totaling Exactly 278 Questions
 * Priority Ordered: Prediction First ➔ Hard Question ➔ Medium Question ➔ Easy & Beginner Last
 */
export const STUDY_GROUPS: StudyGroupDefinition[] = [
  {
    id: 'group_1',
    groupNumber: 1,
    title: 'Group 1 — Speaking',
    shortTitle: 'Group 1',
    subtitle: 'Speaking Mastery',
    skills: ['speaking'],
    totalQuestions: 69,
    color: 'blue',
    items: [
      {
        questionTypeId: 'read_aloud',
        count: 35,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'retell_lecture',
        count: 10,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'describe_image',
        count: 15,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'respond_to_situation',
        count: 9,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_2',
    groupNumber: 2,
    title: 'Group 2 — Speaking & Writing',
    shortTitle: 'Group 2',
    subtitle: 'Recall & Group Discussion',
    skills: ['speaking', 'writing'],
    totalQuestions: 70,
    color: 'purple',
    items: [
      {
        questionTypeId: 'repeat_sentence',
        count: 60,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_group_discussion',
        count: 9,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'respond_to_situation',
        count: 1,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 9 // following Group 1's 9 items (0-8)
      }
    ]
  },
  {
    id: 'group_3',
    groupNumber: 3,
    title: 'Group 3 — Writing & Reading',
    shortTitle: 'Group 3',
    subtitle: 'Blanks, Essays & Comprehension',
    skills: ['writing', 'reading'],
    totalQuestions: 69,
    color: 'emerald',
    items: [
      {
        questionTypeId: 'rw_fill_in_blanks',
        count: 30,
        priority: 'prediction',
        priorityLabel: 'Prediction First',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'r_fill_in_blanks',
        count: 18,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_group_discussion',
        count: 3,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 9 // following Group 2's 9 items (0-8)
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
        count: 15,
        priority: 'easy',
        priorityLabel: 'Easy & Beginner',
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_4',
    groupNumber: 4,
    title: 'Group 4 — Reading & Listening',
    shortTitle: 'Group 4',
    subtitle: 'Dictation & Audio Analytics',
    skills: ['reading', 'listening'],
    totalQuestions: 70,
    color: 'amber',
    items: [
      {
        questionTypeId: 'write_from_dictation',
        count: 35,
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
        count: 8,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'r_fill_in_blanks',
        count: 7,
        priority: 'hard',
        priorityLabel: 'Hard Question',
        startInstanceIndex: 18 // following Group 3's 18 items (0-17)
      },
      {
        questionTypeId: 'listening_fill_in_blanks',
        count: 10,
        priority: 'medium',
        priorityLabel: 'Medium Question',
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'highlight_incorrect_words',
        count: 8,
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
