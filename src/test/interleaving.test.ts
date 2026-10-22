import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, generateGroupedStudyQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES, STUDY_GROUPS } from '../config/constants';

describe('4-Phase Study Plan & 180-Question Queue Generation', () => {
  it('generates exactly 180 questions in total matching the 4 phases', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(180);
  });

  it('correctly divides questions into 4 phases (45 questions each)', () => {
    const queue = generateGroupedStudyQueue();

    const g1 = queue.filter(q => q.groupId === 'group_1');
    const g2 = queue.filter(q => q.groupId === 'group_2');
    const g3 = queue.filter(q => q.groupId === 'group_3');
    const g4 = queue.filter(q => q.groupId === 'group_4');

    expect(g1.length).toBe(45); // Phase 1 — Speaking (Mock Paper 1)
    expect(g2.length).toBe(45); // Phase 2 — Speaking & Writing (Mock Paper 2)
    expect(g3.length).toBe(45); // Phase 3 — Writing & Reading (Mock Paper 3)
    expect(g4.length).toBe(45); // Phase 4 — Reading & Listening (Mock Paper 4)
    expect(g1.length + g2.length + g3.length + g4.length).toBe(180);
  });

  it('matches each question-type target count exactly across all 4 phases', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    const counts: Record<string, number> = {};
    for (const item of queue) {
      counts[item.questionTypeId] = (counts[item.questionTypeId] || 0) + 1;
    }

    for (const meta of QUESTION_TYPES) {
      const expectedTarget = DEFAULT_QUESTION_TARGETS[meta.id];
      expect(counts[meta.id]).toBe(expectedTarget);
    }

    // Specific counts from 180-question 4-phase plan based on score weight:
    expect(counts['describe_image']).toBe(18); // 15% Weight
    expect(counts['summarize_group_discussion']).toBe(18); // 9% Weight (15 in P2 + 3 in P3)
    expect(counts['repeat_sentence']).toBe(25); // 7% Weight
    expect(counts['rw_fill_in_blanks']).toBe(18); // 7% Weight
    expect(counts['summarize_written_text']).toBe(3); // 7% Weight
    expect(counts['write_essay']).toBe(2); // 7% Weight
    expect(counts['retell_lecture']).toBe(9); // 6% Weight
    expect(counts['respond_to_situation']).toBe(13); // 6% Weight (8 in P1 + 5 in P2)
    expect(counts['r_fill_in_blanks']).toBe(22); // 6% Weight (14 in P3 + 8 in P4)
    expect(counts['write_from_dictation']).toBe(18); // 5% Weight
    expect(counts['read_aloud']).toBe(10); // 4% Weight
    expect(counts['summarize_spoken_text']).toBe(3); // 4% Weight
    expect(counts['highlight_incorrect_words']).toBe(6); // 4% Weight
    expect(counts['reorder_paragraph']).toBe(5); // 3% Weight
    expect(counts['listening_fill_in_blanks']).toBe(5); // 3% Weight
    expect(counts['answer_short_question']).toBe(5); // 2% Weight
  });

  it('enforces score weight priority order (highest % first in each phase)', () => {
    for (const group of STUDY_GROUPS) {
      let prevWeight = 100;
      for (const item of group.items) {
        expect(item.scoreWeight).toBeLessThanOrEqual(prevWeight);
        prevWeight = item.scoreWeight;
      }
    }
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

    const phases35 = getPhaseRanges(35);
    expect(phases35.length).toBe(7);
  });
});
