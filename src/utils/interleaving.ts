import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, STUDY_GROUPS } from '../config/constants';

/**
 * Generates the structured 278-question study queue divided into 4 Groups (Sections / Mock Styles):
 * 
 * Group 1 — Speaking (69 questions):
 *   1. Read Aloud (35) [Prediction First]
 *   2. Retell Lecture (10) [Hard Question]
 *   3. Describe Image (15) [Medium Question]
 *   4. Respond to a Situation (9) [Easy & Beginner]
 * 
 * Group 2 — Speaking & Writing (70 questions):
 *   1. Repeat Sentences (60) [Prediction First]
 *   2. Summarize Group Discussion (9) [Hard Question]
 *   3. Respond to a Situation (1) [Easy & Beginner]
 * 
 * Group 3 — Writing & Reading (69 questions):
 *   1. R/W Fill in the Blanks (30) [Prediction First]
 *   2. R Fill in the Blanks (18) [Hard Question]
 *   3. Summarize Group Discussion (3) [Hard Question]
 *   4. Summarize Written Text (2) [Medium Question]
 *   5. Write Essay (1) [Medium Question]
 *   6. Answer Short Questions (15) [Easy & Beginner]
 * 
 * Group 4 — Reading & Listening (70 questions):
 *   1. Write From Dictation (35) [Prediction First]
 *   2. Summarize Spoken Text (2) [Hard Question]
 *   3. Reorder Paragraph (8) [Hard Question]
 *   4. R Fill in the Blanks (7) [Hard Question]
 *   5. Fill in the Blanks (Type In) (10) [Medium Question]
 *   6. Highlight Incorrect Words (8) [Easy & Beginner]
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
 * Standard queue generator function matching the 4-group, 278-question prioritized study plan.
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
