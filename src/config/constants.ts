import { QuestionPriority, QuestionTypeMeta, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-20';
export const APP_TITLE = 'PTE - Daily Study Plan – Superior English';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 25;
export const DAILY_PRACTICE_TARGET = 193; // 4 Sections: Speaking (102) + Writing (3) + Reading (45) + Listening (43) = 193
export const TOTAL_PRACTICE_TARGET = 4825; // 25 * 193
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
  // SPEAKING (Total: 102 questions per day)
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 15,
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
    defaultTarget: 35,
    estMinutes: '25 min',
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
    defaultTarget: 22,
    estMinutes: '20 min',
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
    defaultTarget: 9,
    estMinutes: '18 min',
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
    defaultTarget: 7,
    estMinutes: '15 min',
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
    defaultTarget: 7,
    estMinutes: '12 min',
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
    defaultTarget: 7,
    estMinutes: '7 min',
    isPrediction: false,
    scoreWeight: 2,
    maxScore: 90,
    description: 'Answer simple factual questions with one or a few concise words. (PTE score weight: 2%)'
  },

  // WRITING (Total: 3 questions per day)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 2,
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
    defaultTarget: 1,
    estMinutes: '20 min',
    isPrediction: false,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Write a 200–300 word argumentative essay on a given prompt using proper structure. (PTE score weight: 7%)'
  },

  // READING (Total: 45 questions per day)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 22,
    estMinutes: '30 min',
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
    defaultTarget: 18,
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
    defaultTarget: 5,
    estMinutes: '10 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence. (PTE score weight: 3%)'
  },

  // LISTENING (Total: 43 questions per day)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 28,
    estMinutes: '25 min',
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
    defaultTarget: 7,
    estMinutes: '10 min',
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
    defaultTarget: 6,
    estMinutes: '8 min',
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
    defaultTarget: 2,
    estMinutes: '15 min',
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
 * 4 Study Groups (Speaking 102 · Writing 3 · Reading 45 · Listening 43) Totaling Exactly 193 Questions
 * Prioritized according to PTE Score Weight Percentage
 */
export const STUDY_GROUPS: StudyGroupDefinition[] = [
  {
    id: 'group_1',
    groupNumber: 1,
    title: 'Speaking Section (102 Qs)',
    shortTitle: 'Speaking',
    subtitle: '102 Questions · Speaking Mastery',
    skills: ['speaking'],
    totalQuestions: 102,
    color: 'blue',
    items: [
      {
        questionTypeId: 'describe_image',
        count: 15,
        priority: 'prediction',
        priorityLabel: 'Top Score Weight (15%)',
        scoreWeight: 15,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_group_discussion',
        count: 9,
        priority: 'prediction',
        priorityLabel: 'Top Score Weight (9%)',
        scoreWeight: 9,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'repeat_sentence',
        count: 35,
        priority: 'hard',
        priorityLabel: 'High Score Weight (7%)',
        scoreWeight: 7,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'retell_lecture',
        count: 7,
        priority: 'hard',
        priorityLabel: 'High Score Weight (6%)',
        scoreWeight: 6,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'respond_to_situation',
        count: 7,
        priority: 'hard',
        priorityLabel: 'High Score Weight (6%)',
        scoreWeight: 6,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'read_aloud',
        count: 22,
        priority: 'medium',
        priorityLabel: 'Score Weight (4%)',
        scoreWeight: 4,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'answer_short_question',
        count: 7,
        priority: 'easy',
        priorityLabel: 'Supporting Weight (2%)',
        scoreWeight: 2,
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_2',
    groupNumber: 2,
    title: 'Writing Section (3 Qs)',
    shortTitle: 'Writing',
    subtitle: '3 Questions · Intensive Composition',
    skills: ['writing'],
    totalQuestions: 3,
    color: 'purple',
    items: [
      {
        questionTypeId: 'summarize_written_text',
        count: 2,
        priority: 'hard',
        priorityLabel: 'High Score Weight (7%)',
        scoreWeight: 7,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'write_essay',
        count: 1,
        priority: 'hard',
        priorityLabel: 'High Score Weight (7%)',
        scoreWeight: 7,
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_3',
    groupNumber: 3,
    title: 'Reading Section (45 Qs)',
    shortTitle: 'Reading',
    subtitle: '45 Questions · Blanks & Reorder',
    skills: ['reading'],
    totalQuestions: 45,
    color: 'emerald',
    items: [
      {
        questionTypeId: 'rw_fill_in_blanks',
        count: 22,
        priority: 'hard',
        priorityLabel: 'High Score Weight (7%)',
        scoreWeight: 7,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'r_fill_in_blanks',
        count: 18,
        priority: 'hard',
        priorityLabel: 'High Score Weight (6%)',
        scoreWeight: 6,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'reorder_paragraph',
        count: 5,
        priority: 'easy',
        priorityLabel: 'Supporting Weight (3%)',
        scoreWeight: 3,
        startInstanceIndex: 0
      }
    ]
  },
  {
    id: 'group_4',
    groupNumber: 4,
    title: 'Listening Section (43 Qs)',
    shortTitle: 'Listening',
    subtitle: '43 Questions · Dictation & Audio',
    skills: ['listening'],
    totalQuestions: 43,
    color: 'amber',
    items: [
      {
        questionTypeId: 'write_from_dictation',
        count: 28,
        priority: 'medium',
        priorityLabel: 'Core Score Weight (5%)',
        scoreWeight: 5,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'highlight_incorrect_words',
        count: 6,
        priority: 'medium',
        priorityLabel: 'Score Weight (4%)',
        scoreWeight: 4,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'summarize_spoken_text',
        count: 2,
        priority: 'medium',
        priorityLabel: 'Score Weight (4%)',
        scoreWeight: 4,
        startInstanceIndex: 0
      },
      {
        questionTypeId: 'listening_fill_in_blanks',
        count: 7,
        priority: 'easy',
        priorityLabel: 'Supporting Weight (3%)',
        scoreWeight: 3,
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
