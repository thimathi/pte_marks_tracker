import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, STUDY_GROUPS } from '../config/constants';

/**
 * Generates the structured 180-question study queue divided into 4 Phases (Mock-Style Papers: 45 Qs / 2–3 hrs each):
 * Prioritized according to PTE Exam Score Weight Percentages (Highest % First ➔ Lowest % Last):
 * 
 * Phase 1 — Speaking (Mock Paper 1: 45 questions):
 *   1. Describe Image (18) [15% Score Weight · Top Priority]
 *   2. Retell Lecture (9) [6% Score Weight · High Priority]
 *   3. Respond to a Situation (8) [6% Score Weight · High Priority]
 *   4. Read Aloud (10) [4% Score Weight · Score Weight]
 * 
 * Phase 2 — Speaking & Writing (Mock Paper 2: 45 questions):
 *   1. Summarize Group Discussion (15) [9% Score Weight · Top Priority]
 *   2. Repeat Sentences (25) [7% Score Weight · High Priority]
 *   3. Respond to a Situation (5) [6% Score Weight · High Priority]
 * 
 * Phase 3 — Writing & Reading (Mock Paper 3: 45 questions):
 *   1. Summarize Group Discussion (3) [9% Score Weight · Top Priority]
 *   2. R/W Fill in the Blanks (18) [7% Score Weight · High Priority]
 *   3. Summarize Written Text (3) [7% Score Weight · High Priority]
 *   4. Write Essay (2) [7% Score Weight · High Priority]
 *   5. R Fill in the Blanks (14) [6% Score Weight · High Priority]
 *   6. Answer Short Questions (5) [2% Score Weight · Supporting Weight]
 * 
 * Phase 4 — Reading & Listening (Mock Paper 4: 45 questions):
 *   1. R Fill in the Blanks (8) [6% Score Weight · High Priority]
 *   2. Write From Dictation (18) [5% Score Weight · Core Weight]
 *   3. Summarize Spoken Text (3) [4% Score Weight · Score Weight]
 *   4. Highlight Incorrect Words (6) [4% Score Weight · Score Weight]
 *   5. Reorder Paragraph (5) [3% Score Weight · Score Weight]
 *   6. Fill in the Blanks (Type In) (5) [3% Score Weight · Score Weight]
 * 
 * Priority Rule Enforced: Highest Score Weight % First ➔ Lowest Score Weight % Last
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
          scoreWeight: item.scoreWeight ?? meta.scoreWeight,
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
