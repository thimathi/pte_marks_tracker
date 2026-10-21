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

    // Specific counts from 180-question 4-phase plan:
    expect(counts['read_aloud']).toBe(23);
    expect(counts['repeat_sentence']).toBe(38);
    expect(counts['describe_image']).toBe(10);
    expect(counts['retell_lecture']).toBe(7);
    expect(counts['respond_to_situation']).toBe(6);
    expect(counts['summarize_group_discussion']).toBe(8);
    expect(counts['answer_short_question']).toBe(10);
    expect(counts['summarize_written_text']).toBe(2);
    expect(counts['write_essay']).toBe(1);
    expect(counts['rw_fill_in_blanks']).toBe(20);
    expect(counts['r_fill_in_blanks']).toBe(15);
    expect(counts['reorder_paragraph']).toBe(5);
    expect(counts['write_from_dictation']).toBe(22);
    expect(counts['listening_fill_in_blanks']).toBe(6);
    expect(counts['highlight_incorrect_words']).toBe(5);
    expect(counts['summarize_spoken_text']).toBe(2);
  });

  it('enforces priority order: Prediction First -> Hard Second -> Medium Third -> Easy Last', () => {
    const priorityRank = {
      prediction: 1,
      hard: 2,
      medium: 3,
      easy: 4
    };

    for (const group of STUDY_GROUPS) {
      let lastRank = 1;
      for (const item of group.items) {
        const currentRank = priorityRank[item.priority];
        expect(currentRank).toBeGreaterThanOrEqual(lastRank);
        lastRank = currentRank;
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
