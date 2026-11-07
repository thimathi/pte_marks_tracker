import { QuestionPriority, QuestionTypeMeta, SkillType, StudyGroupDefinition, TargetScores } from '../types/pte';

export const DEFAULT_START_DATE = '2026-11-04'; // Start: Nov 4, 2026 (Day 4 = Nov 7, 2026)
export const FINAL_TARGET_DATE = '2026-12-10'; // Postponed Exam Day: Dec 10, 2026 (37 Days Total)
export const APP_TITLE = 'PTE - 78+ Superior Plan (2 Mocks · 153 Practice Qs · 273 Qs/Day · S:87 W:84 R:69 L:68)';
export const APP_ORGANIZATION = 'PTE Bridge - Your Trusted Mentor';
export const TOTAL_STUDY_DAYS = 37; // Nov 4 to Dec 10, 2026 (37 Days Total)
export const DAILY_PRACTICE_TARGET = 153; // Exactly 153 Daily Targeted Practice Questions (PTE Bridge 273 - 120 Mocks)
export const TOTAL_PRACTICE_TARGET = 5661; // 37 * 153 = 5,661 Total Practice Questions
export const DAILY_MOCK_TARGET = 2; // Exactly 2 Mock Exams Daily (60 Qs * 2 = 120 Questions)
export const TOTAL_MOCK_TARGET = 60; // 60 Planned Benchmark Mocks (20 unique VIP papers × 3 passes)
export const TOTAL_UNIQUE_PAPERS = 20; // 20 unique VIP papers
export const REPETITIONS_PER_PAPER = 3; // Repeated in passes
export const TOTAL_SECTION_TESTS = 34; // 34 Section Tests (1 test every day from Day 4 through Day 37) 
export const MOCK_EXAM_QUESTIONS = 60;
export const TOTAL_MOCK_EXAM_QUESTIONS = 4440; // 74 mocks * 60 questions = 4,440
export const DAILY_TOTAL_QUESTIONS = 273; // 153 Practice Qs + 120 Mock Qs = 273 Questions Daily
export const TOTAL_MISSION_QUESTIONS = 10101; // 37 days * 273 questions = 10,101 Total Questions

export interface MockScheduleSlot {
  mockIndex: number;
  timeSlot: string;
  sessionName: string;
}

export const DAILY_MOCK_SCHEDULE: MockScheduleSlot[] = [
  { mockIndex: 0, timeSlot: '09:15 AM – 11:15 AM', sessionName: 'Mock Exam 1 (Morning Simulation)' },
  { mockIndex: 1, timeSlot: '05:00 PM – 07:00 PM', sessionName: 'Mock Exam 2 (Evening Simulation)' }
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

export const SECTION_TEST_SCHEDULE: Record<number, SectionTestDef> = {
  4: {
    dayNumber: 4,
    testId: 'sec_reading_01',
    title: 'VIP Reading Section Test 1',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 1: Reading & Writing Fill in Blanks (Dropdown), Re-order Paragraphs & Drag-and-Drop FIB timing drill.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  5: {
    dayNumber: 5,
    testId: 'sec_listening_01',
    title: 'VIP Listening Section Test 1',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 1: Summarize Spoken Text, Write From Dictation, Listening FIB & Highlight Incorrect Words.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  6: {
    dayNumber: 6,
    testId: 'sec_speaking_01',
    title: 'VIP Speaking Section Test 1',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 1: Full AI speaking battery — Read Aloud, Repeat Sentence, DI, RL & SGD oral fluency.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  7: {
    dayNumber: 7,
    testId: 'sec_reading_02',
    title: 'VIP Reading Section Test 2',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 2: Academic collocations focus, R/W FIB dropdown precision & context clues.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  8: {
    dayNumber: 8,
    testId: 'sec_writing_01',
    title: 'VIP Writing Section Test 1',
    skill: 'writing',
    targetQuestions: 4,
    estMinutes: '40 min',
    description: 'APEUni VIP Writing Test 1: Strict 10-min Summarize Written Text (2 passages) & 20-min Essay template speed drill.',
    recommendedSlot: '07:15 PM – 07:55 PM'
  },
  9: {
    dayNumber: 9,
    testId: 'sec_listening_02',
    title: 'VIP Listening Section Test 2',
    skill: 'listening',
    targetQuestions: 22,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 2: Fast speaker accent adaptation, HIW clicking reflex & FIB spelling accuracy.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  10: {
    dayNumber: 10,
    testId: 'sec_reading_03',
    title: 'VIP Reading Section Test 3',
    skill: 'reading',
    targetQuestions: 19,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 3: Fast-paced Re-order Paragraphs logical structure & drag-and-drop blanks.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  11: {
    dayNumber: 11,
    testId: 'sec_speaking_02',
    title: 'VIP Speaking Section Test 2',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 2: Read Aloud chunking, acoustic rhythm and pause-free oral fluency stabilization.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  12: {
    dayNumber: 12,
    testId: 'sec_listening_03',
    title: 'VIP Listening Section Test 3',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 3: Write From Dictation 100% exact match focus with plural -s and past tense -ed accuracy.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  13: {
    dayNumber: 13,
    testId: 'sec_reading_04',
    title: 'VIP Reading Section Test 4',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '30 min',
    description: 'APEUni VIP Reading Test 4: Time management drill — maximum 2 minutes per R/W FIB passage.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  14: {
    dayNumber: 14,
    testId: 'sec_writing_02',
    title: 'VIP Writing Section Test 2',
    skill: 'writing',
    targetQuestions: 4,
    estMinutes: '40 min',
    description: 'APEUni VIP Writing Test 2: Strict 20-minute Essay template execution with zero spelling errors & perfect structure.',
    recommendedSlot: '07:15 PM – 07:55 PM'
  },
  15: {
    dayNumber: 15,
    testId: 'sec_listening_04',
    title: 'VIP Listening Section Test 4',
    skill: 'listening',
    targetQuestions: 21,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 4: Summarize Spoken Text template integration + key noun phrase capture.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  16: {
    dayNumber: 16,
    testId: 'sec_speaking_03',
    title: 'VIP Speaking Section Test 3',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 3: Repeat Sentence memory retention & phrase-level pitch/intonation drill.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  17: {
    dayNumber: 17,
    testId: 'sec_reading_05',
    title: 'VIP Reading Section Test 5',
    skill: 'reading',
    targetQuestions: 19,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 5: Advanced vocabulary & high-frequency PTE academic phrase matching.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  18: {
    dayNumber: 18,
    testId: 'sec_listening_05',
    title: 'VIP Listening Section Test 5',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 5: Multiple choice & Select Missing Word elimination precision.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  19: {
    dayNumber: 19,
    testId: 'sec_speaking_04',
    title: 'VIP Speaking Section Test 4',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 4: Describe Image & Retell Lecture template speed — 40-second smooth delivery.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  20: {
    dayNumber: 20,
    testId: 'sec_reading_06',
    title: 'VIP Reading Section Test 6',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '30 min',
    description: 'APEUni VIP Reading Test 6: Elimination strategies for tricky multi-choice & high-distractor FIB blanks.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  21: {
    dayNumber: 21,
    testId: 'sec_writing_03',
    title: 'VIP Writing Section Test 3',
    skill: 'writing',
    targetQuestions: 4,
    estMinutes: '40 min',
    description: 'APEUni VIP Writing Test 3: Complex sentences for SWT (5–75 words single sentence) & Essay proofreading.',
    recommendedSlot: '07:15 PM – 07:55 PM'
  },
  22: {
    dayNumber: 22,
    testId: 'sec_listening_06',
    title: 'VIP Listening Section Test 6',
    skill: 'listening',
    targetQuestions: 22,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 6: Advanced Write From Dictation drill under exam pressure & background noise.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  23: {
    dayNumber: 23,
    testId: 'sec_reading_07',
    title: 'VIP Reading Section Test 7',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '30 min',
    description: 'APEUni VIP Reading Test 7: High accuracy sprint under strict exam countdown conditions.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  24: {
    dayNumber: 24,
    testId: 'sec_speaking_05',
    title: 'VIP Speaking Section Test 5',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 5: Superior 79+ Speaking audit — zero hesitation, natural microphone projection.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  25: {
    dayNumber: 25,
    testId: 'sec_listening_07',
    title: 'VIP Listening Section Test 7',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 7: Speed review test — zero lost marks on HIW and listening blanks.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  26: {
    dayNumber: 26,
    testId: 'sec_writing_04',
    title: 'VIP Writing Section Test 4',
    skill: 'writing',
    targetQuestions: 3,
    estMinutes: '35 min',
    description: 'APEUni VIP Writing Test 4: High-scoring essay template speed run + SWT punctuation mastery.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  27: {
    dayNumber: 27,
    testId: 'sec_reading_08',
    title: 'VIP Reading Section Test 8 (Final Readiness)',
    skill: 'reading',
    targetQuestions: 20,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 8: Final summit trial — target 85%+ accuracy on Reading & Writing FIB.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  28: {
    dayNumber: 28,
    testId: 'sec_listening_08',
    title: 'VIP Listening Section Test 8 (Accent Adaptation)',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 8: Fast-paced diverse accents, HIW & FIB spelling accuracy under speed.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  29: {
    dayNumber: 29,
    testId: 'sec_reading_09',
    title: 'VIP Reading Section Test 9 (Dropdown Precision)',
    skill: 'reading',
    targetQuestions: 18,
    estMinutes: '30 min',
    description: 'APEUni VIP Reading Test 9: Rapid R/W FIB dropdown contextual deduction and collocations.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  30: {
    dayNumber: 30,
    testId: 'sec_writing_05',
    title: 'VIP Writing Section Test 5 (Score 84 Essay Sprint)',
    skill: 'writing',
    targetQuestions: 3,
    estMinutes: '35 min',
    description: 'APEUni VIP Writing Test 5: Strict 20-min Essay with advanced vocabulary & 10-min SWT compound sentence.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  31: {
    dayNumber: 31,
    testId: 'sec_listening_09',
    title: 'VIP Listening Section Test 9 (WFD 100% Match)',
    skill: 'listening',
    targetQuestions: 22,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 9: Write From Dictation plural/tense drill + SST template cohesion.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  32: {
    dayNumber: 32,
    testId: 'sec_speaking_06',
    title: 'VIP Speaking Section Test 6 (Score 87 Fluency Drill)',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 6: Zero hesitation, steady pitch, continuous acoustic rhythm across RA & RS.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  33: {
    dayNumber: 33,
    testId: 'sec_reading_10',
    title: 'VIP Reading Section Test 10 (Re-order & Blanks)',
    skill: 'reading',
    targetQuestions: 19,
    estMinutes: '32 min',
    description: 'APEUni VIP Reading Test 10: Topic sentence tracking, pronoun reference links & drag-and-drop FIB.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  34: {
    dayNumber: 34,
    testId: 'sec_listening_10',
    title: 'VIP Listening Section Test 10 (High-Speed Reflex)',
    skill: 'listening',
    targetQuestions: 20,
    estMinutes: '35 min',
    description: 'APEUni VIP Listening Test 10: HIW at 1.2x playback speed and Listening FIB instant spelling.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  35: {
    dayNumber: 35,
    testId: 'sec_writing_06',
    title: 'VIP Writing Section Test 6 (Error-Free Grammar Audit)',
    skill: 'writing',
    targetQuestions: 4,
    estMinutes: '40 min',
    description: 'APEUni VIP Writing Test 6: 2 essays typed back-to-back with zero spelling errors & full paragraph structure.',
    recommendedSlot: '07:15 PM – 07:55 PM'
  },
  36: {
    dayNumber: 36,
    testId: 'sec_speaking_07',
    title: 'VIP Speaking Section Test 7 (Summit Confidence)',
    skill: 'speaking',
    targetQuestions: 35,
    estMinutes: '35 min',
    description: 'APEUni VIP Speaking Test 7: Pearson exam simulation — 87+ target fluency, projection, and no hesitation.',
    recommendedSlot: '07:15 PM – 07:50 PM'
  },
  37: {
    dayNumber: 37,
    testId: 'sec_reading_11',
    title: 'VIP Reading Section Test 11 (Exam Day Readiness)',
    skill: 'reading',
    targetQuestions: 20,
    estMinutes: '30 min',
    description: 'APEUni VIP Reading Test 11: Final sharp focus on academic collocations and R/W blanks before summit.',
    recommendedSlot: '07:15 PM – 07:45 PM'
  }
};

export function getSectionTestForDay(dayNumber: number): SectionTestDef | null {
  return SECTION_TEST_SCHEDULE[dayNumber] || null;
}

export const DEFAULT_TARGET_SCORES: TargetScores = {
  overall: 78,
  speaking: 87,
  writing: 84,
  reading: 69,
  listening: 68,
  mockExam: 78,
};

// Target progression curve across 37 study days (Nov 04 to Dec 10) targeting Overall 78+ (S:87, W:84, R:69, L:68)
export const DAY_TARGET_SCORES: number[] = [
  60, 61, 62, 63, 64, 65, 66, // Week 1 (Days 1–7): Nov 04–10 (Baseline Stabilization & Speaking Fluency Reset)
  67, 68, 69, 70, 71, 71, 72, // Week 2 (Days 8–14): Nov 11–17 (Writing Templates & Dictation Lockdown)
  72, 73, 73, 74, 74, 75, 75, // Week 3 (Days 15–21): Nov 18–24 (Reading Blanks & Collocations Acceleration)
  75, 76, 76, 77, 77, 77, 78, // Week 4 (Days 22–28): Nov 25–Dec 01 (Speed & Timed Stress Conditioning)
  78, 78, 78, 78, 78, 78, 78, // Week 5 (Days 29–35): Dec 02–08 (Summit 87 Speaking & 84 Writing Precision)
  78, 78                      // Final Summit (Days 36–37): Dec 09–10 (Peak Confidence & Pearson Exam Day)
];

export interface DailyMasterBlock {
  blockNumber: number;
  timeSlot: string;
  durationHours: number;
  title: string;
  targetSkill: 'speaking' | 'writing' | 'reading' | 'listening' | 'mock' | 'review';
  targetScoreBenchmark: number;
  badge: string;
  badgeColor: string;
  coreTasks: string[];
  efficiencyRule: string;
}

export const DAILY_15H_MASTER_SCHEDULE: DailyMasterBlock[] = [
  {
    blockNumber: 1,
    timeSlot: '06:30 AM – 09:00 AM',
    durationHours: 2.5,
    title: 'Block 1: Speaking 87 Fluency & Acoustic Drills (PTE Bridge 82 Qs)',
    targetSkill: 'speaking',
    targetScoreBenchmark: 87,
    badge: 'Speaking Target: 87 · 82 Qs',
    badgeColor: 'bg-red-950/60 text-red-300 border border-red-800/60',
    coreTasks: [
      'Tongue Twisters & Vocal Cord Warmup (10 min articulation & pitch stabilization)',
      'Read Aloud (RA): 20 passages (PTE Bridge daily target: uninterrupted fluency, steady volume)',
      'Repeat Sentence (RS): 30 audios (3-4 word phrase chunking + acoustic shadow delivery)',
      'Describe Image (DI): 8 images (Fixed 25s template delivery: title, high/low, conclusion)',
      'Retell Lecture (RL): 5 audios (Key phrases note-taking + oral template fluency)',
      'Respond to Situation (RTS): 5 drills & Answer Short Questions (ASQ): 8 drills'
    ],
    efficiencyRule: 'Never restart or pause during recording. Pearson AI penalizes hesitations harder than minor pronunciation slips.'
  },
  {
    blockNumber: 2,
    timeSlot: '09:15 AM – 12:15 PM',
    durationHours: 3.0,
    title: 'Block 2: MOCK EXAM 1 (60 Qs) + DEEP ERROR AUDIT & RA REVIEW (1h)',
    targetSkill: 'mock',
    targetScoreBenchmark: 78,
    badge: 'Mock 1: 60 Qs + 1h Review',
    badgeColor: 'bg-blue-950/60 text-blue-300 border border-blue-800/60',
    coreTasks: [
      'Full Timed Mock Exam 1 (2 Hours · 60 Questions under Pearson Exam Conditions)',
      'Instant Diagnostic Verification across Speaking, Writing, Reading & Listening',
      'Deep 1-Hour Question-by-Question Review: RA Acoustic Analysis, Missed WFDs, R/W Blanks',
      'Log all error patterns directly into the Mock Review Center'
    ],
    efficiencyRule: 'Simulate with real headset microphone positioning (2 fingers distance below lower lip).'
  },
  {
    blockNumber: 3,
    timeSlot: '01:15 PM – 03:30 PM',
    durationHours: 2.25,
    title: 'Block 3: Reading 69 & Writing 84 Precision Drills (PTE Bridge 39 Qs)',
    targetSkill: 'reading',
    targetScoreBenchmark: 69,
    badge: 'Reading 69 & Writing 84 · 39 Qs',
    badgeColor: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
    coreTasks: [
      'Reading & Writing FIB (Dropdown): 18 passages (PTE Bridge: context clues & collocation pairs)',
      'Reading FIB (Drag & Drop): 14 passages (Grammatical category deduction: Noun/Verb/Adj)',
      'Re-order Paragraphs (RO): 4 exercises (Independent topic sentences & pronoun referents)',
      'Summarize Written Text (SWT): 2 passages (Strict 1-sentence compound grammar, 35–45 words)',
      'Write Essay (WE): 1 full essay typed in 20 min under exam conditions (Zero spelling errors)'
    ],
    efficiencyRule: 'Never spend more than 2 minutes on a single reading passage; mark best educated guess and proceed.'
  },
  {
    blockNumber: 4,
    timeSlot: '03:45 PM – 04:45 PM',
    durationHours: 1.0,
    title: 'Block 4: DAILY VIP SECTION TEST (APEUni Section Speed Run)',
    targetSkill: 'reading',
    targetScoreBenchmark: 75,
    badge: 'VIP Section Test · 1.0h',
    badgeColor: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60',
    coreTasks: [
      'Complete the day assigned VIP Section Test (Reading, Listening, Speaking, or Writing)',
      'Priority Sequence: Reading > Listening > Speaking > Writing',
      'Immediate 15-minute diagnostic review of incorrect choices and time-spent per question'
    ],
    efficiencyRule: 'Section tests build rapid reflex speed without the physical fatigue of a full 2-hour paper.'
  },
  {
    blockNumber: 5,
    timeSlot: '05:00 PM – 08:00 PM',
    durationHours: 3.0,
    title: 'Block 5: MOCK EXAM 2 (60 Qs) + DEEP ERROR AUDIT & RA REVIEW (1h)',
    targetSkill: 'mock',
    targetScoreBenchmark: 78,
    badge: 'Mock 2: 60 Qs + 1h Review',
    badgeColor: 'bg-purple-950/60 text-purple-300 border border-purple-800/60',
    coreTasks: [
      'Full Timed Mock Exam 2 (2 Hours · 60 Questions under Pearson Exam Conditions)',
      'Instant Diagnostic Score Verification and target comparison against 78+ benchmark',
      'Deep 1-Hour Question-by-Question Review: Transcription analysis and scoring audit',
      'Update deficiency tags (අඩුපාඩු) and identify repetitive mistakes'
    ],
    efficiencyRule: 'Compare Mock 2 performance with Mock 1 to check if afternoon fatigue impacted reading speed.'
  },
  {
    blockNumber: 6,
    timeSlot: '08:30 PM – 10:30 PM',
    durationHours: 2.0,
    title: 'Block 6: Listening 68 & Dictation Lockdown (PTE Bridge 32 Qs)',
    targetSkill: 'listening',
    targetScoreBenchmark: 68,
    badge: 'Listening 68 · 32 Qs',
    badgeColor: 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60',
    coreTasks: [
      'Write From Dictation (WFD): 20 sentences (Spelling audit: plurals -s, past tense -ed, capital letters)',
      'Summarize Spoken Text (SST): 2 audios (55–65 words strict template, noun-phrase accuracy)',
      'Listening Fill in the Blanks: 6 audios (Immediate shorthand on notepad, rapid type-in)',
      'Highlight Incorrect Words: 4 audios (Trained at 1.2x playback speed for reflex sharpening)'
    ],
    efficiencyRule: 'Never take negative-marking risks on MC Multiple Answers unless 100% confident.'
  },
  {
    blockNumber: 7,
    timeSlot: '10:30 PM – 11:00 PM',
    durationHours: 0.5,
    title: 'Block 7: Night Mistake Log Rectification & Academic Collocations',
    targetSkill: 'review',
    targetScoreBenchmark: 78,
    badge: 'Mistake Log: 0.5h',
    badgeColor: 'bg-slate-900 text-slate-300 border border-slate-700',
    coreTasks: [
      'Review day consolidated mistake notebook (missed WFD words, tricky FIB vocabulary)',
      'Academic Collocations list review (30 high-frequency pairs)',
      'Milestone signoff & mental reset for next morning'
    ],
    efficiencyRule: 'Close all screens by 11:00 PM. 7.5 hours of solid sleep restores vocal cords for 87+ Speaking.'
  }
];

export interface ReviewScheduleSlot {
  slotIndex: number;
  timeSlot: string;
  sessionName: string;
  focus: string;
}

export const DAILY_REVIEW_SCHEDULE: ReviewScheduleSlot[] = [
  { slotIndex: 0, timeSlot: '11:15 AM – 12:15 PM', sessionName: 'Mock 1 Deep Error Audit & RA Review (1.0h)', focus: 'Mock 1 Question-by-Question Analysis & RA Acoustic Audit' },
  { slotIndex: 1, timeSlot: '07:00 PM – 08:00 PM', sessionName: 'Mock 2 Deep Error Audit & RA Review (1.0h)', focus: 'Mock 2 Question-by-Question Analysis & Mistake Log' }
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
  return dayNumber === 3;
}

export function getReviewDayDefinition(dayNumber: number): ReviewDayDefinition | null {
  return REVIEW_DAYS[dayNumber] || null;
}

export function getDailyMockTarget(dayNumber: number): number {
  if (dayNumber === 1) return 4;
  if (dayNumber === 2) return 3;
  if (dayNumber === 3) return 0;
  return 2;
}

export function getDailyPracticeTarget(_dayNumber: number): number {
  return 153;
}

export function getMockExamsForDay(dayNumber: number): string[] {
  if (dayNumber === 1) {
    return ['mock01', 'mock02', 'mock03', 'mock04'];
  }
  if (dayNumber === 2) {
    return ['mock01', 'mock02', 'mock03'];
  }
  if (dayNumber === 3) {
    return [];
  }
  // From Day 4 through Day 37: Exactly 2 Mock Exams per day!
  return ['mock01', 'mock02'];
}

export const DAY_START_EXAM_NUMBER: Record<number, number> = {
  1: 1,
  2: 5,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 18,
  10: 20,
  11: 22,
  12: 24,
  13: 26,
  14: 28,
  15: 30,
  16: 32,
  17: 34,
  18: 36,
  19: 38,
  20: 40,
  21: 42,
  22: 44,
  23: 46,
  24: 48,
  25: 50,
  26: 52,
  27: 54,
  28: 56,
  29: 58,
  30: 60,
  31: 62,
  32: 64,
  33: 66,
  34: 68,
  35: 70,
  36: 72,
  37: 74
};

export function getExamNumberForMock(dayNumber: number, mockIndex: number): number {
  const start = DAY_START_EXAM_NUMBER[dayNumber];
  if (start !== undefined) {
    return start + mockIndex;
  }
  return (dayNumber - 1) * 2 + mockIndex + 1;
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
  // SPEAKING (Total: 82 targeted daily questions from PTE Bridge)
  {
    id: 'read_aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    skill: 'speaking',
    secondarySkill: 'reading',
    defaultTarget: 20,
    estMinutes: '20 min',
    isPrediction: true,
    scoreWeight: 4,
    maxScore: 90,
    description: 'Read the text aloud naturally with steady rhythm and acoustic projection. (PTE Bridge daily focus)'
  },
  {
    id: 'repeat_sentence',
    name: 'Repeat Sentence',
    shortName: 'RS',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 30,
    estMinutes: '20 min',
    isPrediction: true,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Listen to a short recording and repeat the sentence accurately word-for-word. (PTE Bridge daily focus)'
  },
  {
    id: 'describe_image',
    name: 'Describe Image',
    shortName: 'DI',
    skill: 'speaking',
    defaultTarget: 8,
    estMinutes: '10 min',
    isPrediction: true,
    scoreWeight: 15,
    maxScore: 90,
    description: 'Describe the key points and conclusions of the image using a clean 25s template flow.'
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
    description: 'Listen to a lecture and retell the key points in your own words with zero hesitation.'
  },
  {
    id: 'respond_to_situation',
    name: 'Respond to a Situation',
    shortName: 'RTS',
    skill: 'speaking',
    defaultTarget: 5,
    estMinutes: '6 min',
    isPrediction: false,
    scoreWeight: 6,
    maxScore: 90,
    description: 'Spoken situational response with natural intonation.'
  },
  {
    id: 'summarize_group_discussion',
    name: 'Summarize Group Discussion',
    shortName: 'SGD',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 6,
    estMinutes: '8 min',
    isPrediction: true,
    scoreWeight: 9,
    maxScore: 90,
    description: 'Summarize group viewpoints with oral fluency.'
  },
  {
    id: 'answer_short_question',
    name: 'Answer Short Questions',
    shortName: 'ASQ',
    skill: 'speaking',
    secondarySkill: 'listening',
    defaultTarget: 8,
    estMinutes: '5 min',
    isPrediction: false,
    scoreWeight: 2,
    maxScore: 90,
    description: 'Quick factual 1-word answers.'
  },

  // WRITING (Total: 3 targeted daily questions from PTE Bridge)
  {
    id: 'summarize_written_text',
    name: 'Summarize Written Text',
    shortName: 'SWT',
    skill: 'writing',
    secondarySkill: 'reading',
    defaultTarget: 2,
    estMinutes: '15 min',
    isPrediction: false,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Single complex/compound sentence between 35–45 words with flawless punctuation.'
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
    description: '200–300 word argumentative essay written in 20 min using proper structure.'
  },

  // READING (Total: 36 targeted daily questions from PTE Bridge)
  {
    id: 'rw_fill_in_blanks',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'R&W FIB',
    skill: 'reading',
    secondarySkill: 'writing',
    defaultTarget: 18,
    estMinutes: '25 min',
    isPrediction: true,
    scoreWeight: 7,
    maxScore: 90,
    description: 'Dropdown blanks focus: academic collocations and grammar context clues.'
  },
  {
    id: 'r_fill_in_blanks',
    name: 'Reading: Fill in the Blanks',
    shortName: 'R FIB',
    skill: 'reading',
    defaultTarget: 14,
    estMinutes: '18 min',
    isPrediction: false,
    scoreWeight: 6,
    maxScore: 90,
    description: 'Drag and drop missing words using parts of speech deduction.'
  },
  {
    id: 'reorder_paragraph',
    name: 'Reorder Paragraph',
    shortName: 'RO',
    skill: 'reading',
    defaultTarget: 4,
    estMinutes: '8 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Logical sequencing of independent topic sentences and referents.'
  },

  // LISTENING (Total: 32 targeted daily questions from PTE Bridge)
  {
    id: 'write_from_dictation',
    name: 'Write From Dictation',
    shortName: 'WFD',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 20,
    estMinutes: '20 min',
    isPrediction: true,
    scoreWeight: 5,
    maxScore: 90,
    description: 'Listen and type out sentence with 100% spelling precision (-s, -ed, plurals).'
  },
  {
    id: 'listening_fill_in_blanks',
    name: 'Listening: Fill in the Blanks (Type In)',
    shortName: 'L FIB',
    skill: 'listening',
    secondarySkill: 'writing',
    defaultTarget: 6,
    estMinutes: '8 min',
    isPrediction: false,
    scoreWeight: 3,
    maxScore: 90,
    description: 'Type in missing words while following along with the audio passage.'
  },
  {
    id: 'highlight_incorrect_words',
    name: 'Highlight Incorrect Words',
    shortName: 'HIW',
    skill: 'listening',
    secondarySkill: 'reading',
    defaultTarget: 4,
    estMinutes: '6 min',
    isPrediction: false,
    scoreWeight: 4,
    maxScore: 90,
    description: 'Click transcript words that differ from the speaker (tested at 1.2x speed).'
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
    description: '50–70 word audio summary capturing key points with grammatical correctness.'
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
