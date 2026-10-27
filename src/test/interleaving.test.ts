import { describe, it, expect } from 'vitest';
import { generateInterleavedQueue, generateGroupedStudyQueue, getPhaseRanges } from '../utils/interleaving';
import { DEFAULT_QUESTION_TARGETS, QUESTION_TYPES, STUDY_GROUPS } from '../config/constants';

describe('10-Phase Study Plan & 300-Question Daily Queue Generation', () => {
  it('generates exactly 300 questions in total matching the 10 phases', () => {
    const queue = generateInterleavedQueue(DEFAULT_QUESTION_TARGETS, 1, 42);
    expect(queue.length).toBe(300);
  });

  it('correctly divides questions into the 10 user-defined focused phases totaling 300 questions', () => {
    const queue = generateGroupedStudyQueue();
    expect(queue.length).toBe(300);

    const expectedPhaseCounts = [30, 30, 30, 20, 30, 40, 30, 30, 30, 30];
    for (let p = 1; p <= 10; p++) {
      const phaseQuestions = queue.filter(q => q.groupId === `phase_${p}`);
      expect(phaseQuestions.length).toBe(expectedPhaseCounts[p - 1]);
    }

    // Verify Phase 1: 20 ASQ + 10 SGD
    const p1 = queue.filter(q => q.groupId === 'phase_1');
    expect(p1.filter(q => q.questionTypeId === 'answer_short_question').length).toBe(20);
    expect(p1.filter(q => q.questionTypeId === 'summarize_group_discussion').length).toBe(10);

    // Verify Phase 2: 15 RS + 15 RA
    const p2 = queue.filter(q => q.groupId === 'phase_2');
    expect(p2.filter(q => q.questionTypeId === 'repeat_sentence').length).toBe(15);
    expect(p2.filter(q => q.questionTypeId === 'read_aloud').length).toBe(15);

    // Verify Phase 3: 10 RTS + 10 RO + 10 HIW
    const p3 = queue.filter(q => q.groupId === 'phase_3');
    expect(p3.filter(q => q.questionTypeId === 'respond_to_situation').length).toBe(10);
    expect(p3.filter(q => q.questionTypeId === 'reorder_paragraph').length).toBe(10);
    expect(p3.filter(q => q.questionTypeId === 'highlight_incorrect_words').length).toBe(10);

    // Verify Phase 4: 8 SWT + 2 WE + 10 SST
    const p4 = queue.filter(q => q.groupId === 'phase_4');
    expect(p4.filter(q => q.questionTypeId === 'summarize_written_text').length).toBe(8);
    expect(p4.filter(q => q.questionTypeId === 'write_essay').length).toBe(2);
    expect(p4.filter(q => q.questionTypeId === 'summarize_spoken_text').length).toBe(10);

    // Verify Phase 5: 10 RL + 20 DI
    const p5 = queue.filter(q => q.groupId === 'phase_5');
    expect(p5.filter(q => q.questionTypeId === 'retell_lecture').length).toBe(10);
    expect(p5.filter(q => q.questionTypeId === 'describe_image').length).toBe(20);

    // Verify Phase 6: 20 RS + 20 RA
    const p6 = queue.filter(q => q.groupId === 'phase_6');
    expect(p6.filter(q => q.questionTypeId === 'repeat_sentence').length).toBe(20);
    expect(p6.filter(q => q.questionTypeId === 'read_aloud').length).toBe(20);

    // Verify Phase 7: 30 WFD
    const p7 = queue.filter(q => q.groupId === 'phase_7');
    expect(p7.filter(q => q.questionTypeId === 'write_from_dictation').length).toBe(30);

    // Verify Phase 8: 30 R&W FIB
    const p8 = queue.filter(q => q.groupId === 'phase_8');
    expect(p8.filter(q => q.questionTypeId === 'rw_fill_in_blanks').length).toBe(30);

    // Verify Phase 9: 20 R FIB + 10 L FIB
    const p9 = queue.filter(q => q.groupId === 'phase_9');
    expect(p9.filter(q => q.questionTypeId === 'r_fill_in_blanks').length).toBe(20);
    expect(p9.filter(q => q.questionTypeId === 'listening_fill_in_blanks').length).toBe(10);

    // Verify Phase 10: 25 RS + 5 RA
    const p10 = queue.filter(q => q.groupId === 'phase_10');
    expect(p10.filter(q => q.questionTypeId === 'repeat_sentence').length).toBe(25);
    expect(p10.filter(q => q.questionTypeId === 'read_aloud').length).toBe(5);
  });

  it('matches each question-type target count exactly across all phases', () => {
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
    expect(counts['repeat_sentence']).toBe(60);
    expect(counts['read_aloud']).toBe(40);
    expect(counts['summarize_group_discussion']).toBe(10);
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