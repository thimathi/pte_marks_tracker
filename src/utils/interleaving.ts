import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, STUDY_GROUPS } from '../config/constants';

/**
 * Generates the structured 193-question daily study queue divided into 4 Sections:
 *   - Speaking Section: 102 questions
 *   - Writing Section: 3 questions
 *   - Reading Section: 45 questions
 *   - Listening Section: 43 questions
 * 
 * Speaking Section (102 questions):
 *   1. Describe Image (15) [15% Score Weight · Top Priority]
 *   2. Summarize Group Discussion (9) [9% Score Weight · Top Priority]
 *   3. Repeat Sentence (35) [7% Score Weight · High Priority]
 *   4. Retell Lecture (7) [6% Score Weight · High Priority]
 *   5. Respond to a Situation (7) [6% Score Weight · High Priority]
 *   6. Read Aloud (22) [4% Score Weight · Core Weight]
 *   7. Answer Short Question (7) [2% Score Weight · Supporting Weight]
 * 
 * Writing Section (3 questions):
 *   1. Summarize Written Text (2) [7% Score Weight · High Priority]
 *   2. Write Essay (1) [7% Score Weight · High Priority]
 * 
 * Reading Section (45 questions):
 *   1. Fill in the Blanks (Dropdown) (22) [7% Score Weight · High Priority]
 *   2. Fill in the Blanks (Drag and Drop) (18) [6% Score Weight · High Priority]
 *   3. Reorder Paragraph (5) [3% Score Weight · Supporting Weight]
 * 
 * Listening Section (43 questions):
 *   1. Write From Dictation (28) [5% Score Weight · Core Weight]
 *   2. Highlight Incorrect Words (6) [4% Score Weight · Score Weight]
 *   3. Summarize Spoken Text (2) [4% Score Weight · Score Weight]
 *   4. Fill in the Blanks (Type In) (7) [3% Score Weight · Supporting Weight]
 * 
 * Total: Exactly 193 questions per day.
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
 * Standard queue generator function matching the 4-section, 193-question prioritized study plan.
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
