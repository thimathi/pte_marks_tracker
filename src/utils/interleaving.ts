import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, STUDY_GROUPS } from '../config/constants';

/**
 * Generates the structured 180-question study queue divided into 4 Phases (Mock-Style Papers: 45 Qs / 2–3 hrs each):
 * 
 * Phase 1 — Speaking (Mock Paper 1: 45 questions):
 *   1. Read Aloud (23) [Prediction First]
 *   2. Retell Lecture (7) [Hard Question]
 *   3. Describe Image (10) [Medium Question]
 *   4. Respond to a Situation (5) [Easy & Beginner]
 * 
 * Phase 2 — Speaking & Writing (Mock Paper 2: 45 questions):
 *   1. Repeat Sentences (38) [Prediction First]
 *   2. Summarize Group Discussion (6) [Hard Question]
 *   3. Respond to a Situation (1) [Easy & Beginner]
 * 
 * Phase 3 — Writing & Reading (Mock Paper 3: 45 questions):
 *   1. R/W Fill in the Blanks (20) [Prediction First]
 *   2. R Fill in the Blanks (10) [Hard Question]
 *   3. Summarize Group Discussion (2) [Hard Question]
 *   4. Summarize Written Text (2) [Medium Question]
 *   5. Write Essay (1) [Medium Question]
 *   6. Answer Short Questions (10) [Easy & Beginner]
 * 
 * Phase 4 — Reading & Listening (Mock Paper 4: 45 questions):
 *   1. Write From Dictation (22) [Prediction First]
 *   2. Summarize Spoken Text (2) [Hard Question]
 *   3. Reorder Paragraph (5) [Hard Question]
 *   4. R Fill in the Blanks (5) [Hard Question]
 *   5. Fill in the Blanks (Type In) (6) [Medium Question]
 *   6. Highlight Incorrect Words (5) [Easy & Beginner]
 * 
 * Priority Rule Enforced: Prediction First ➔ Hard Question Second ➔ Medium Question Third ➔ Easy & Beginner Last
 */
export function generateGroupedStudyQueue(): QueueItem[] {
  const queue: QueueItem[] = [];

  for (const group of STUDY_GROUPS) {
    let groupIndex = 0;
    for (const item of group.items) {
      const meta = QUESTION_TYPE_MAP.get(item.questionTypeId);
      if (!meta) continue;

      for (let i = 0; i < item.count; i++) {
        const instanceIndex = item.startInstanceIndex + i;
        queue.push({
          id: `${group.id}_${item.questionTypeId}_${i}`,
          questionTypeId: item.questionTypeId,
          questionTypeName: meta.name,
          skill: meta.skill,
          secondarySkill: meta.secondarySkill,
          instanceIndex,
          isPrediction: item.priority === 'prediction' || meta.isPrediction,
          overallQueueIndex: queue.length,
          groupId: group.id,
          groupNumber: group.groupNumber,
          groupTitle: group.title,
          groupIndex,
          groupTotal: group.totalQuestions,
          priority: item.priority,
          priorityLabel: item.priorityLabel,
          typeIndexInGroup: i + 1,
          typeTotalInGroup: item.count
        });
        groupIndex++;
      }
    }
  }

  return queue;
}

/**
 * Standard queue generator function matching the 4-phase, 180-question prioritized study plan.
 * Retains signature for backward compatibility with studyPlan parameters.
 */
export function generateInterleavedQueue(
  _questionTargets?: Record<string, number>,
  _dayNumber: number = 1,
  _seedModifier: number = 42
): QueueItem[] {
  return generateGroupedStudyQueue();
}

/**
 * Returns questions filtered by group ID ('group_1', 'group_2', 'group_3', 'group_4')
 */
export function getGroupQuestions(groupId: string, queue: QueueItem[]): QueueItem[] {
  return queue.filter(q => q.groupId === groupId);
}

/**
 * Calculates phase groupings (up to 5 questions per phase) for a given target count
 */
export function getPhaseRanges(targetCount: number): { phaseNumber: number; startIndex: number; endIndex: number }[] {
  const ranges = [];
  let phase = 1;
  for (let st = 0; st < targetCount; st += 5) {
    const en = Math.min(st + 5, targetCount);
    ranges.push({
      phaseNumber: phase++,
      startIndex: st,
      endIndex: en
    });
  }
  return ranges;
}
