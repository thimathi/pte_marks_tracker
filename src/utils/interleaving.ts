import { QuestionTypeMeta, QueueItem } from '../types/pte';
import { QUESTION_TYPES, QUESTION_TYPE_MAP } from '../config/constants';

/**
 * Seeded PRNG (Mulberry32) for deterministic balanced interleaving
 */
function createPrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an interleaved, balanced mixed queue of exactly N questions (default 200)
 * using Weighted Fair Queueing (Deficit Round Robin) with seeded jitter.
 * 
 * Guarantees:
 * 1. Total questions generated equals exact sum of question targets (200).
 * 2. Every question type appears exactly its target number of times.
 * 3. Every question type is distributed uniformly from question 1 to question 200.
 * 4. No question type ever bunches up at the beginning or end.
 * 5. Deterministic output based on dayNumber and seed.
 */
export function generateInterleavedQueue(
  questionTargets: Record<string, number>,
  dayNumber: number = 1,
  seedModifier: number = 42
): QueueItem[] {
  const seed = (dayNumber * 10007) + seedModifier;
  const rng = createPrng(seed);

  // Initialize accumulators and targets
  const typesData: {
    id: string;
    meta: QuestionTypeMeta;
    target: number;
    currentCount: number;
    accumulator: number;
  }[] = [];

  let totalTarget = 0;

  for (const meta of QUESTION_TYPES) {
    const target = questionTargets[meta.id] ?? meta.defaultTarget;
    if (target > 0) {
      // Add slight initial jitter based on seed so order varies deterministically across days
      const jitter = (rng() * 0.25) * target;
      typesData.push({
        id: meta.id,
        meta,
        target,
        currentCount: 0,
        accumulator: jitter
      });
      totalTarget += target;
    }
  }

  const queue: QueueItem[] = [];
  let lastTypeId: string | null = null;

  for (let step = 0; step < totalTarget; step++) {
    // Increment accumulators by their target rate
    for (const t of typesData) {
      if (t.currentCount < t.target) {
        t.accumulator += t.target;
      }
    }

    // Filter available candidates that still have remaining items
    const available = typesData.filter(t => t.currentCount < t.target);
    if (available.length === 0) break;

    // Separate into non-repeats (different from last picked) and repeats
    const nonRepeats = available.filter(t => t.id !== lastTypeId);
    const pool = nonRepeats.length > 0 ? nonRepeats : available;

    // Pick candidate with highest accumulator
    pool.sort((a, b) => b.accumulator - a.accumulator);
    const chosen = pool[0];

    // Deduct total target from chosen accumulator to balance
    chosen.accumulator -= totalTarget;

    const instanceIndex = chosen.currentCount;
    chosen.currentCount++;

    queue.push({
      id: `q_${queue.length}`,
      questionTypeId: chosen.meta.id,
      questionTypeName: chosen.meta.name,
      skill: chosen.meta.skill,
      instanceIndex,
      isPrediction: chosen.meta.isPrediction,
      overallQueueIndex: queue.length
    });

    lastTypeId = chosen.id;
  }

  return queue;
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
