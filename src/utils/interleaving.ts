import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, STUDY_GROUPS } from '../config/constants';

/**
 * Generates the structured 254-question daily study queue divided into 4 Sections:
 *   - Speaking Section: 144 questions (2,880 over 20 days)
 *   - Writing Section: 3 questions (60 over 20 days)
 *   - Reading Section: 57 questions (1,140 over 20 days)
 *   - Listening Section: 50 questions (1,000 over 20 days)
 * 
 * Total: Exactly 254 questions per day (5,080 questions over 20 days).
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
