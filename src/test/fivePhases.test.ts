import { describe, it, expect } from 'vitest';
import {
  PHASE_DEFINITIONS,
  DEFAULT_START_DATE,
  FINAL_TARGET_DATE,
  TOTAL_STUDY_DAYS,
  TOTAL_MOCK_TARGET,
  DAILY_PRACTICE_TARGET,
  getAcademicCollocationsTarget,
  getMockExamDetails
} from '../config/constants';
import { generateGroupedStudyQueue, getPhaseQuestions } from '../utils/interleaving';
import { PTE_BRIDGE_SGD_TEMPLATES, PTE_BRIDGE_ESSAY_TEMPLATES, getCollocationsForDay } from '../data/dailyTasksData';

describe('5-Phase Daily Study Curriculum Verification', () => {
  it('starts on 30-10-2026 and spans 15 days until 13-11-2026', () => {
    expect(DEFAULT_START_DATE).toBe('2026-10-30');
    expect(FINAL_TARGET_DATE).toBe('2026-11-13');
    expect(TOTAL_STUDY_DAYS).toBe(15);
  });

  it('contains exactly 5 distinct phases with 20 questions each totaling 100 questions', () => {
    expect(PHASE_DEFINITIONS.length).toBe(5);

    let totalQs = 0;
    for (const phase of PHASE_DEFINITIONS) {
      expect(phase.questionCount).toBe(20);
      const sum = phase.questionTypes.reduce((acc, q) => acc + q.count, 0);
      expect(sum).toBe(20);
      totalQs += phase.questionCount;
    }
    expect(totalQs).toBe(100);
    expect(DAILY_PRACTICE_TARGET).toBe(100);
  });

  it('configures Phase 1: Mock Exam 1, 20 Qs (DI 12 + SGD 8), Tongue Twisters 2x', () => {
    const p1 = PHASE_DEFINITIONS[0];
    expect(p1.phaseNumber).toBe(1);
    expect(p1.mockIndex).toBe(0); // Mock Exam 1
    expect(p1.mockName).toBe('Mock Exam 1');

    // 20 Questions
    expect(p1.questionTypes).toEqual([
      expect.objectContaining({ typeId: 'describe_image', count: 12, scoreWeight: 15 }),
      expect.objectContaining({ typeId: 'summarize_group_discussion', count: 8, scoreWeight: 9 })
    ]);

    // Tongue Twisters
    expect(p1.drills[0].drillKey).toBe('tongue_twister');
    expect(p1.drills[0].getTargetCount(1)).toBe(2);
  });

  it('configures Phase 2: Mock Exam 2, 20 Qs (RS 15 + RL 5), Academic Collocations Fwd', () => {
    const p2 = PHASE_DEFINITIONS[1];
    expect(p2.phaseNumber).toBe(2);
    expect(p2.mockIndex).toBe(1); // Mock Exam 2
    expect(p2.mockName).toBe('Mock Exam 2');

    // 20 Questions
    expect(p2.questionTypes).toEqual([
      expect.objectContaining({ typeId: 'repeat_sentence', count: 15, scoreWeight: 7 }),
      expect.objectContaining({ typeId: 'retell_lecture', count: 5, scoreWeight: 6 })
    ]);

    // Collocations Fwd: Day 1: 100, Day 2: 150, Day 3: 200...
    expect(p2.drills[0].drillKey).toBe('collocations_fwd');
    expect(p2.drills[0].getTargetCount(1)).toBe(100);
    expect(p2.drills[0].getTargetCount(2)).toBe(150);
    expect(p2.drills[0].getTargetCount(3)).toBe(200);
    expect(p2.drills[0].getTargetCount(15)).toBe(800);
  });

  it('configures Phase 3: Mock Exam 3, 20 Qs (R&W FIB 10 + R FIB 8 + RO 2), Academic Collocations Bwd', () => {
    const p3 = PHASE_DEFINITIONS[2];
    expect(p3.phaseNumber).toBe(3);
    expect(p3.mockIndex).toBe(2); // Mock Exam 3
    expect(p3.mockName).toBe('Mock Exam 3');

    // 20 Questions
    expect(p3.questionTypes).toEqual([
      expect.objectContaining({ typeId: 'rw_fill_in_blanks', count: 10, scoreWeight: 7 }),
      expect.objectContaining({ typeId: 'r_fill_in_blanks', count: 8, scoreWeight: 6 }),
      expect.objectContaining({ typeId: 'reorder_paragraph', count: 2, scoreWeight: 3 })
    ]);

    // Collocations Bwd: Day 1: 100, Day 2: 150, Day 3: 200...
    expect(p3.drills[0].drillKey).toBe('collocations_bwd');
    expect(p3.drills[0].getTargetCount(1)).toBe(100);
    expect(p3.drills[0].getTargetCount(2)).toBe(150);
    expect(p3.drills[0].getTargetCount(3)).toBe(200);
  });

  it('configures Phase 4: Mock Exam 4, 20 Qs (WFD 10 + RA 8 + WE 2), Essay Template 1, SGD Template 1', () => {
    const p4 = PHASE_DEFINITIONS[3];
    expect(p4.phaseNumber).toBe(4);
    expect(p4.mockIndex).toBe(3); // Mock Exam 4
    expect(p4.mockName).toBe('Mock Exam 4');

    // 20 Questions
    expect(p4.questionTypes).toEqual([
      expect.objectContaining({ typeId: 'write_from_dictation', count: 10, scoreWeight: 5 }),
      expect.objectContaining({ typeId: 'read_aloud', count: 8, scoreWeight: 4 }),
      expect.objectContaining({ typeId: 'write_essay', count: 2, scoreWeight: 7 })
    ]);

    // Drills: 1 Essay + 1 SGD
    expect(p4.drills).toHaveLength(2);
    expect(p4.drills.find(d => d.drillKey === 'essay_template')?.getTargetCount(1)).toBe(1);
    expect(p4.drills.find(d => d.drillKey === 'sgd_template')?.getTargetCount(1)).toBe(1);
  });

  it('configures Phase 5: Mock Exam 5, 20 Qs (RTS 5 + SWT 4 + SST 3 + HIW 3 + L FIB 3 + ASQ 2), Essay Template 1, SGD Template 1', () => {
    const p5 = PHASE_DEFINITIONS[4];
    expect(p5.phaseNumber).toBe(5);
    expect(p5.mockIndex).toBe(4); // Mock Exam 5
    expect(p5.mockName).toBe('Mock Exam 5');

    // 20 Questions
    expect(p5.questionTypes).toEqual([
      expect.objectContaining({ typeId: 'respond_to_situation', count: 5, scoreWeight: 6 }),
      expect.objectContaining({ typeId: 'summarize_written_text', count: 4, scoreWeight: 7 }),
      expect.objectContaining({ typeId: 'summarize_spoken_text', count: 3, scoreWeight: 4 }),
      expect.objectContaining({ typeId: 'highlight_incorrect_words', count: 3, scoreWeight: 4 }),
      expect.objectContaining({ typeId: 'listening_fill_in_blanks', count: 3, scoreWeight: 3 }),
      expect.objectContaining({ typeId: 'answer_short_question', count: 2, scoreWeight: 2 })
    ]);

    // Drills: 1 Essay + 1 SGD
    expect(p5.drills).toHaveLength(2);
    expect(p5.drills.find(d => d.drillKey === 'essay_template')?.getTargetCount(1)).toBe(1);
    expect(p5.drills.find(d => d.drillKey === 'sgd_template')?.getTargetCount(1)).toBe(1);
  });

  it('tags each question in the queue with its exact phase (20 Qs per phase)', () => {
    const queue = generateGroupedStudyQueue();
    expect(queue.length).toBe(100);

    for (let pNum = 1; pNum <= 5; pNum++) {
      const phaseQs = getPhaseQuestions(pNum, queue);
      expect(phaseQs.length).toBe(20);
      for (const q of phaseQs) {
        expect(q.phaseNumber).toBe(pNum);
      }
    }
  });

  it('verifies SGD and Essay templates are populated with full structure and text', () => {
    expect(PTE_BRIDGE_SGD_TEMPLATES.three_speakers).toBeDefined();
    expect(PTE_BRIDGE_SGD_TEMPLATES.three_speakers.sections.length).toBeGreaterThanOrEqual(4);
    expect(PTE_BRIDGE_SGD_TEMPLATES.three_speakers.fullText.length).toBeGreaterThan(100);

    expect(PTE_BRIDGE_ESSAY_TEMPLATES.discussion).toBeDefined();
    expect(PTE_BRIDGE_ESSAY_TEMPLATES.problems_solutions).toBeDefined();
  });

  it('generates collocations in forward and backward order matching daily targets', () => {
    const day1Fwd = getCollocationsForDay(1, 'forward');
    expect(day1Fwd.length).toBe(100);

    const day1Bwd = getCollocationsForDay(1, 'backward');
    expect(day1Bwd.length).toBe(100);
    expect(day1Bwd[0].id).toBe(100); // Reversed

    const day2Fwd = getCollocationsForDay(2, 'forward');
    expect(day2Fwd.length).toBe(150);
  });
});
