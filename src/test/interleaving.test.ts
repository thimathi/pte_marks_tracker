import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, generateGroupedStudyQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES, STUDY_GROUPS } from '../config/constants';

describe('4-Section Study Plan & 240-Question Queue Generation', () => {
  it('generates exactly 240 questions in total matching the 4 sections', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(240);
  });

  it('correctly divides questions into 4 sections (Speaking 125, Writing 5, Reading 55, Listening 55)', () => {
    const queue = generateGroupedStudyQueue();

    const g1 = queue.filter(q => q.groupId === 'group_1');
    const g2 = queue.filter(q => q.groupId === 'group_2');
    const g3 = queue.filter(q => q.groupId === 'group_3');
    const g4 = queue.filter(q => q.groupId === 'group_4');

    expect(g1.length).toBe(125); // Speaking Section
    expect(g2.length).toBe(5);   // Writing Section
    expect(g3.length).toBe(55);  // Reading Section
    expect(g4.length).toBe(55);  // Listening Section
    expect(g1.length + g2.length + g3.length + g4.length).toBe(240);
  });

  it('matches each question-type target count exactly across all sections', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    const counts: Record<string, number> = {};
    for (const item of queue) {
      counts[item.questionTypeId] = (counts[item.questionTypeId] || 0) + 1;
    }

    for (const meta of QUESTION_TYPES) {
      const expectedTarget = DEFAULT_QUESTION_TARGETS[meta.id];
      expect(counts[meta.id]).toBe(expectedTarget);
    }

    // Exact counts:
    expect(counts['describe_image']).toBe(18);
    expect(counts['repeat_sentence']).toBe(42);
    expect(counts['read_aloud']).toBe(26);
    expect(counts['summarize_group_discussion']).toBe(12);
    expect(counts['retell_lecture']).toBe(9);
    expect(counts['respond_to_situation']).toBe(9);
    expect(counts['answer_short_question']).toBe(9);

    expect(counts['summarize_written_text']).toBe(3);
    expect(counts['write_essay']).toBe(2);

    expect(counts['rw_fill_in_blanks']).toBe(26);
    expect(counts['r_fill_in_blanks']).toBe(22);
    expect(counts['reorder_paragraph']).toBe(7);

    expect(counts['write_from_dictation']).toBe(34);
    expect(counts['listening_fill_in_blanks']).toBe(9);
    expect(counts['highlight_incorrect_words']).toBe(9);
    expect(counts['summarize_spoken_text']).toBe(3);
  });

  it('enforces score weight priority order', () => {
    for (const group of STUDY_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
      expect(group.totalQuestions).toBeGreaterThan(0);
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