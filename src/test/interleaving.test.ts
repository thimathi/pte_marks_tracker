import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES } from '../config/constants';

describe('Mixed Question Interleaving & Queue Generation', () => {
  it('generates exactly 200 questions in total for default targets', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(200);
  });

  it('matches each question-type target count exactly', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    const counts: Record<string, number> = {};
    for (const item of queue) {
      counts[item.questionTypeId] = (counts[item.questionTypeId] || 0) + 1;
    }

    for (const meta of QUESTION_TYPES) {
      const expectedTarget = DEFAULT_QUESTION_TARGETS[meta.id];
      expect(counts[meta.id]).toBe(expectedTarget);
    }
  });

  it('interleaves skills and avoids long uninterrupted blocks of the same question type', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    // Verify no single question type appears more than 3 times in a row
    let maxConsecutive = 1;
    let curConsecutive = 1;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].questionTypeId === queue[i - 1].questionTypeId) {
        curConsecutive++;
        if (curConsecutive > maxConsecutive) maxConsecutive = curConsecutive;
      } else {
        curConsecutive = 1;
      }
    }

    // In a balanced shuffle of 200 items across 16 types, consecutive count shouldn't be large
    expect(maxConsecutive).toBeLessThanOrEqual(3);
  });

  it('is deterministic when given the same dayNumber and seed', () => {
    const queue1 = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 3, 100);
    const queue2 = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 3, 100);

    expect(queue1.map(q => q.id)).toEqual(queue2.map(q => q.id));
    expect(queue1.map(q => q.questionTypeId)).toEqual(queue2.map(q => q.questionTypeId));
  });

  it('generates correct phase groupings of up to 5 questions', () => {
    const phases20 = getPhaseRanges(20);
    expect(phases20.length).toBe(4);
    expect(phases20[0]).toEqual({ phaseNumber: 1, startIndex: 0, endIndex: 5 });
    expect(phases20[3]).toEqual({ phaseNumber: 4, startIndex: 15, endIndex: 20 });

    const phases8 = getPhaseRanges(8);
    expect(phases8.length).toBe(2);
    expect(phases8[0]).toEqual({ phaseNumber: 1, startIndex: 0, endIndex: 5 });
    expect(phases8[1]).toEqual({ phaseNumber: 2, startIndex: 5, endIndex: 8 });
  });
});
