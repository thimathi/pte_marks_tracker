import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, generateGroupedStudyQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES, STUDY_GROUPS } from '../config/constants';

describe('High-Yield Priority Study Plan & 300-Question Daily Queue Generation', () => {
  it('generates exactly 300 questions in total matching the priority plan', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(300);
  });

  it('correctly orders questions by high score weight priority totaling 300 questions', () => {
    const queue = generateGroupedStudyQueue();
    expect(queue.length).toBe(300);

    // Verify first question type in queue is Describe Image (15% weight)
    expect(queue[0].questionTypeId).toBe('describe_image');
    expect(queue[0].scoreWeight).toBe(15);

    // Verify second group is Summarize Group Discussion (9% weight)
    const sgdItems = queue.filter(q => q.questionTypeId === 'summarize_group_discussion');
    expect(sgdItems.length).toBe(20);
    expect(sgdItems[0].scoreWeight).toBe(9);

    // Verify last question type is Answer Short Questions (2% weight)
    expect(queue[queue.length - 1].questionTypeId).toBe('answer_short_question');
    expect(queue[queue.length - 1].scoreWeight).toBe(2);

    // Verify all 16 priority groups exist in STUDY_GROUPS
    expect(STUDY_GROUPS.length).toBe(16);
    const totalGroupQuestions = STUDY_GROUPS.reduce((acc, g) => acc + g.totalQuestions, 0);
    expect(totalGroupQuestions).toBe(300);
  });

  it('matches each question-type target count exactly across all groups', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);

    const counts: Record<string, number> = {};
    for (const item of queue) {
      counts[item.questionTypeId] = (counts[item.questionTypeId] || 0) + 1;
    }

    for (const meta of QUESTION_TYPES) {
      const expectedTarget = DEFAULT_QUESTION_TARGETS[meta.id];
      expect(counts[meta.id]).toBe(expectedTarget);
    }

    // Exact counts for 300 Qs:
    expect(counts['describe_image']).toBe(20);
    expect(counts['repeat_sentence']).toBe(50);
    expect(counts['read_aloud']).toBe(40);
    expect(counts['summarize_group_discussion']).toBe(20);
    expect(counts['retell_lecture']).toBe(10);
    expect(counts['respond_to_situation']).toBe(10);
    expect(counts['answer_short_question']).toBe(20);

    expect(counts['summarize_written_text']).toBe(8);
    expect(counts['write_essay']).toBe(2);

    expect(counts['rw_fill_in_blanks']).toBe(30);
    expect(counts['r_fill_in_blanks']).toBe(20);
    expect(counts['reorder_paragraph']).toBe(10);

    expect(counts['write_from_dictation']).toBe(30);
    expect(counts['listening_fill_in_blanks']).toBe(10);
    expect(counts['highlight_incorrect_words']).toBe(10);
    expect(counts['summarize_spoken_text']).toBe(10);
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