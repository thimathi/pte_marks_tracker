import { QuestionTypeMeta, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-10-18';
export const TOTAL_STUDY_DAYS = 25;
export const DAILY_PRACTICE_TARGET = 200;
export const TOTAL_PRACTICE_TARGET = 5000; // 25 * 200
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
  // SPEAKING (Total: 80)
  {
    id: 'read_aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    skill: 'speaking',
    secondarySkill: 'reading',
    defaultTarget: 20,
    estMinutes: '18 min',
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
    defaultTarget: 30,
    estMinutes: '25 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Listen to a short recording and repeat the sentence accurately word-for-word.'
  },
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 8,
    estMinutes: '12 min',
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
    defaultTarget: 6,
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
    defaultTarget: 6,
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
    defaultTarget: 5,
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
    defaultTarget: 5,
    estMinutes: '5 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Answer simple factual questions with one or a few concise words.'
  },

  // WRITING (Total: 15)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 10,
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
    defaultTarget: 5,
    estMinutes: '35 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Write a 200–300 word argumentative essay on a given prompt using proper structure.'
  },

  // READING (Total: 55)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 25,
    estMinutes: '35 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Drop-down vocabulary and grammar choices within a reading text.'
  },
  {
    id: 'r_fill_in_blanks',
    name: 'Reading: Fill in the Blanks',
    shortName: 'R FIB',
    skill: 'reading',
    defaultTarget: 20,
    estMinutes: '25 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Drag and drop missing words into the text boxes.'
  },
  {
    id: 'reorder_paragraph',
    name: 'Reorder Paragraph',
    shortName: 'RO',
    skill: 'reading',
    defaultTarget: 10,
    estMinutes: '18 min',
    isPrediction: false,
    maxScore: 90,
    description: 'Arrange text boxes in the correct chronological or logical sequence.'
  },

  // LISTENING (Total: 50)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 25,
    estMinutes: '20 min',
    isPrediction: true,
    maxScore: 90,
    description: 'Listen to a short sentence and type it out exactly with accurate spelling and punctuation.'
  },
  {
    id: 'listening_fill_in_blanks',
    name: 'Listening: Fill in the Blanks',
    shortName: 'L FIB',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 12,
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
    defaultTarget: 5,
    estMinutes: '25 min',
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
