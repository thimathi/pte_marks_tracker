import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, generateGroupedStudyQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES } from '../config/constants';

describe('High-Yield Priority Study Plan & 120-Question Daily Queue Generation', () => {
  it('generates exactly 120 questions in total matching the priority plan', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(120);
  });

  it('correctly structures 120 questions across 6 phases (20 Qs per phase)', () => {
    const queue = generateGroupedStudyQueue();
    expect(queue.length).toBe(120);

    // Verify first question type in queue is Describe Image (Phase 1)
    expect(queue[0].questionTypeId).toBe('describe_image');
    expect(queue[0].scoreWeight).toBe(15);
    expect(queue[0].phaseNumber).toBe(1);

    // Verify Phase 6 questions exist (Indices 100 to 119)
    const p6Items = queue.filter(q => q.phaseNumber === 6);
    expect(p6Items.length).toBe(20);
  });

  it('matches each question-type target count exactly summing to 120', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    const counts: Record<string, number> = {};
    for (const item of queue) {
      counts[item.questionTypeId] = (counts[item.questionTypeId] || 0) + 1;
    }

    for (const meta of QUESTION_TYPES) {
      const expectedTarget = DEFAULT_QUESTION_TARGETS[meta.id];
      expect(counts[meta.id]).toBe(expectedTarget);
    }

    // Exact counts for 120 Qs:
    expect(counts['describe_image']).toBe(12);
    expect(counts['repeat_sentence']).toBe(20); // 15 + 5
    expect(counts['read_aloud']).toBe(12); // 8 + 4
    expect(counts['summarize_group_discussion']).toBe(8);
    expect(counts['retell_lecture']).toBe(5);
    expect(counts['respond_to_situation']).toBe(5);
    expect(counts['answer_short_question']).toBe(2);

    expect(counts['summarize_written_text']).toBe(4);
    expect(counts['write_essay']).toBe(4); // 2 + 2

    expect(counts['rw_fill_in_blanks']).toBe(14); // 10 + 4
    expect(counts['r_fill_in_blanks']).toBe(8);
    expect(counts['reorder_paragraph']).toBe(2);

    expect(counts['write_from_dictation']).toBe(15); // 10 + 5
    expect(counts['listening_fill_in_blanks']).toBe(3);
    expect(counts['highlight_incorrect_words']).toBe(3);
    expect(counts['summarize_spoken_text']).toBe(3);

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(120);
  });

  it('verifies non-overlapping instance indices across all phases', () => {
    const queue = generateGroupedStudyQueue();
    const indicesByType: Record<string, number[]> = {};

    for (const item of queue) {
      if (!indicesByType[item.questionTypeId]) {
        indicesByType[item.questionTypeId] = [];
      }
      indicesByType[item.questionTypeId].push(item.instanceIndex);
    }

    for (const [typeId, indices] of Object.entries(indicesByType)) {
      const sorted = [...indices].sort((a, b) => a - b);
      const unique = new Set(indices);
      expect(unique.size).toBe(sorted.length); // No duplicates
      expect(sorted[0]).toBe(0);
      expect(sorted[sorted.length - 1]).toBe(DEFAULT_QUESTION_TARGETS[typeId] - 1);
    }
  });

  it('generates correct phase groupings of up to 20 questions', () => {
    const phases = getPhaseRanges(120);
    expect(phases.length).toBe(6);
    expect(phases[0]).toEqual({ phaseNumber: 1, startIndex: 0, endIndex: 20 });
    expect(phases[5]).toEqual({ phaseNumber: 6, startIndex: 100, endIndex: 120 });
  });
});
