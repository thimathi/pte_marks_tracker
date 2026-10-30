export type SkillType = 'speaking' | 'writing' | 'reading' | 'listening';

export interface QuestionTypeMeta {
  id: string;
  name: string;
  shortName: string;
  skill: SkillType;
  secondarySkill?: SkillType;
  defaultTarget: number;
  estMinutes: string;
  isPrediction: boolean;
  scoreWeight: number; // percentage from official score weight chart (e.g. 15 for 15%)
  maxScore: number;
  description: string;
}

export interface QuestionAttempt {
  qIndex: number; // 0 to (target - 1)
  score: number | null; // 0 to 90 or null if blank
  notes?: string;
  isFlaggedForReview?: boolean;
  reviewed?: boolean;
  reviewNotes?: string;
  updatedAt?: string;
}

export interface QuestionTypeProgress {
  attempts: Record<number, QuestionAttempt>;
}

export interface MockExamRecord {
  id: string; // 'mock01' | 'mock02' | 'mock03' | 'mock04' | 'mock05'
  studyDay: number;
  examNumber: number; // 1 to 47
  date: string;
  targetQuestions: number; // default 60
  questionsAttempted: number;
  overallScore: number | null; // 0-90
  speakingScore: number | null;
  writingScore: number | null;
  readingScore: number | null;
  listeningScore: number | null;
  mainMistakes?: string;
  weakQuestionTypes?: string[];
  notes?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface MockReviewRecord {
  id: string; // 'review01' | 'review02' | 'review03' | 'review04' | 'review05'
  mockId: string;
  studyDay: number;
  examNumber: number; // 1 to 47
  durationMinutes: number;
  incorrectQuestionsSummary?: string;
  repeatedMistakes?: string;
  vocabularyIssues?: string;
  grammarIssues?: string;
  pronunciationFluencyIssues?: string;
  timeManagementIssues?: string;
  correctiveActions?: string;
  questionsToRepeat?: string;
  reviewNotes?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface AdditionalExerciseRecord {
  id: string;
  name: string;
  requirement: string;
  requiredCount: number;
  completedCount: number;
  notes?: string;
}

export interface DailyGateStatus {
  practiceCompleted: boolean; // all practice questions scored
  dailyPracticeReviewCompleted: boolean;
  mock1Completed: boolean;
  mock1ReviewCompleted: boolean;
  mock2Completed: boolean;
  mock2ReviewCompleted: boolean;
  mock3Completed?: boolean;
  mock3ReviewCompleted?: boolean;
  mock4Completed?: boolean;
  mock4ReviewCompleted?: boolean;
  additionalExercisesCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: string;
  unlockedAt?: string;
}

export interface DayData {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  status: 'locked' | 'active' | 'completed' | 'overdue';
  questionProgress: Record<string, QuestionTypeProgress>;
  mockExams: Record<string, MockExamRecord>;
  mockReviews: Record<string, MockReviewRecord>;
  additionalExercises: Record<string, AdditionalExerciseRecord>;
  gateStatus: DailyGateStatus;
  notes?: string;
  lastQueueIndex?: number;
  updatedAt?: string;
}

export interface TargetScores {
  overall: number;
  speaking: number;
  writing: number;
  reading: number;
  listening: number;
  mockExam: number;
}

export interface StudyPlan {
  startDate: string; // YYYY-MM-DD, e.g. 2026-10-11
  durationDays: number; // 21
  currentDay: number; // 1 to 21
  targetScores: TargetScores;
  questionTargets: Record<string, number>;
  additionalExerciseTargets: Record<string, number>;
  shuffleSeed?: number;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export type QuestionPriority = 'prediction' | 'hard' | 'medium' | 'easy';

export interface StudyGroupItem {
  questionTypeId: string;
  count: number;
  priority: QuestionPriority;
  priorityLabel: string;
  scoreWeight: number; // e.g. 15 for 15%
  startInstanceIndex: number;
}

export interface StudyGroupDefinition {
  id: string;
  groupNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  skills: SkillType[];
  totalQuestions: number;
  color: string;
  items: StudyGroupItem[];
  checkpointMock?: number; // e.g. Mock #1 checkpoint after Phase 5, Mock #2 after Phase 10
}

export interface QueueItem {
  id: string; // unique item id in queue, e.g. "phase_1_q_0"
  questionTypeId: string;
  questionTypeName: string;
  skill: SkillType;
  secondarySkill?: SkillType;
  instanceIndex: number; // e.g. 3rd Read Aloud today
  isPrediction: boolean;
  scoreWeight: number; // e.g. 15 for 15%
  overallQueueIndex: number; // 0 to 299
  groupId: string;
  groupNumber: number;
  groupTitle: string;
  groupIndex: number; // 0 to (groupTotal - 1)
  groupTotal: number;
  priority: QuestionPriority;
  priorityLabel: string;
  typeIndexInGroup: number; // 1 to count
  typeTotalInGroup: number;
  phaseNumber?: number; // 1 to 5
  phaseTitle?: string;
  phaseQuestionIndex?: number; // 0 to 19
}

export interface DayPerformanceSummary {
  dayNumber: number;
  date: string;
  targetScore: number;
  status: 'locked' | 'active' | 'completed' | 'overdue';
  completedPracticeQuestions: number;
  practiceAverage: number | null;
  speakingAverage: number | null;
  writingAverage: number | null;
  readingAverage: number | null;
  listeningAverage: number | null;
  mock1Score: number | null;
  mock2Score: number | null;
  gateDone: boolean;
}
