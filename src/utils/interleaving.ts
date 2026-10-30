import { QueueItem } from '../types/pte';
import { QUESTION_TYPE_MAP, PHASE_DEFINITIONS } from '../config/constants';

/**
 * Generates the structured 120-question daily study queue ordered across the 6 Daily Phases:
 *   - Exactly 6 distinct phases with 20 questions each = 120 questions daily
 *   - Each question type is mapped to its exact instance index
 */
export function generateGroupedStudyQueue(): QueueItem[] {
  const queue: QueueItem[] = [];
  const typeInstanceCounter: Record<string, number> = {};

  for (const phase of PHASE_DEFINITIONS) {
    let phaseQuestionIndex = 0;
    for (const qt of phase.questionTypes) {
      const meta = QUESTION_TYPE_MAP.get(qt.typeId);
      if (!meta) continue;

      const startIndex = typeInstanceCounter[qt.typeId] || 0;
      for (let i = 0; i < qt.count; i++) {
        const instanceIndex = startIndex + i;
        const currentOverallIndex = queue.length;

        queue.push({
          id: `${phase.id}_${qt.typeId}_${instanceIndex}`,
          questionTypeId: qt.typeId,
          questionTypeName: meta.name,
          skill: meta.skill,
          secondarySkill: meta.secondarySkill,
          instanceIndex,
          isPrediction: meta.isPrediction,
          scoreWeight: qt.scoreWeight ?? meta.scoreWeight,
          overallQueueIndex: currentOverallIndex,
          groupId: qt.typeId,
          groupNumber: phase.phaseNumber,
          groupTitle: `${phase.title} · ${meta.name}`,
          groupIndex: phaseQuestionIndex,
          groupTotal: phase.questionCount,
          priority:
            meta.scoreWeight >= 9
              ? 'prediction'
              : meta.scoreWeight >= 6
              ? 'hard'
              : meta.scoreWeight >= 4
              ? 'medium'
              : 'easy',
          priorityLabel: qt.priorityLabel,
          typeIndexInGroup: i + 1,
          typeTotalInGroup: qt.count,
          phaseNumber: phase.phaseNumber,
          phaseTitle: phase.title,
          phaseQuestionIndex
        });
        phaseQuestionIndex++;
      }
      typeInstanceCounter[qt.typeId] = startIndex + qt.count;
    }
  }

  return queue;
}

/**
 * Standard queue generator function matching the 6-phase, 120-question study plan.
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
 * Returns questions filtered by Phase Number (1 to 6, exactly 20 questions each)
 */
export function getPhaseQuestions(phaseNumber: number, queue: QueueItem[]): QueueItem[] {
  return queue.filter((q) => q.phaseNumber === phaseNumber);
}

/**
 * Returns questions filtered by group ID ('describe_image', 'repeat_sentence', etc.)
 */
export function getGroupQuestions(groupId: string, queue: QueueItem[]): QueueItem[] {
  return queue.filter((q) => q.groupId === groupId);
}

/**
 * Calculates phase groupings for a given target count
 */
export function getPhaseRanges(targetCount: number): { phaseNumber: number; startIndex: number; endIndex: number }[] {
  const ranges = [];
  let phase = 1;
  for (let st = 0; st < targetCount; st += 20) {
    const en = Math.min(st + 20, targetCount);
    ranges.push({
      phaseNumber: phase++,
      startIndex: st,
      endIndex: en
    });
  }
  return ranges;
}
