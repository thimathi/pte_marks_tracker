export interface TongueTwisterItem {
  id: number;
  text: string;
  repetition?: string;
}

export interface CollocationItem {
  id: number;
  addition?: string;
  component1: string;
  pos1: string;
  component2: string;
  pos2: string;
  addition2?: string;
  example?: string;
}

export interface EssayTemplateSection {
  title: string;
  points: string[];
}

export interface EssayTemplateType {
  id: string;
  name: string;
  duration: string;
  sections: EssayTemplateSection[];
  fullText: string;
}

/**
 * 50 Tongue Twisters in English (engVid - AlexESLvid)
 * From official student reference materials for oral fluency and pronunciation
 */
export const TONGUE_TWISTERS_COLLECTION: TongueTwisterItem[] = [
  { id: 1, text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked?" },
  { id: 2, text: "Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better. So 'twas better Betty Botter bought a bit of better butter." },
  { id: 3, text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood." },
  { id: 4, text: "She sells seashells by the seashore." },
  { id: 5, text: "How can a clam cram in a clean cream can?" },
  { id: 6, text: "I scream, you scream, we all scream for ice cream." },
  { id: 7, text: "I saw Susie sitting in a shoeshine shop." },
  { id: 8, text: "Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines." },
  { id: 9, text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't fuzzy, was he?" },
  { id: 10, text: "Can you can a can as a canner can can a can?" },
  { id: 11, text: "I have got a date at a quarter to eight; I'll see you at the gate, so don't be late." },
  { id: 12, text: "You know New York, you need New York, you know you need unique New York." },
  { id: 13, text: "I saw a kitten eating chicken in the kitchen." },
  { id: 14, text: "If a dog chews shoes, whose shoes does he choose?" },
  { id: 15, text: "I thought I thought of thinking of thanking you." },
  { id: 16, text: "I wish to wash my Irish wristwatch." },
  { id: 17, text: "Near an ear, a nearer ear, a nearly eerie ear." },
  { id: 18, text: "Eddie edited it." },
  { id: 19, text: "Willie's really weary." },
  { id: 20, text: "A big black bear sat on a big black rug." },
  { id: 21, text: "Tom threw Tim three thumbtacks." },
  { id: 22, text: "He threw three free throws." },
  { id: 23, text: "Nine nice night nurses nursing nicely." },
  { id: 24, text: "So, this is the sushi chef." },
  { id: 25, text: "Four fine fresh fish for you." },
  { id: 26, text: "Wayne went to Wales to watch walruses." },
  { id: 27, text: "Six sticky skeletons.", repetition: "x3" },
  { id: 28, text: "Which witch is which?", repetition: "x3" },
  { id: 29, text: "Snap crackle pop.", repetition: "x3" },
  { id: 30, text: "Flash message.", repetition: "x3" },
  { id: 31, text: "Red Buick, blue Buick.", repetition: "x3" },
  { id: 32, text: "Red lorry, yellow lorry.", repetition: "x3" },
  { id: 33, text: "Thin sticks, thick bricks.", repetition: "x3" },
  { id: 34, text: "Stupid superstition.", repetition: "x3" },
  { id: 35, text: "Eleven benevolent elephants.", repetition: "x3" },
  { id: 36, text: "Two tried and true tridents.", repetition: "x3" },
  { id: 37, text: "Rolling red wagons.", repetition: "x3" },
  { id: 38, text: "Black back bat.", repetition: "x3" },
  { id: 39, text: "She sees cheese.", repetition: "x3" },
  { id: 40, text: "Truly rural.", repetition: "x3" },
  { id: 41, text: "Good blood, bad blood.", repetition: "x3" },
  { id: 42, text: "Pre-shrunk silk shirts.", repetition: "x3" },
  { id: 43, text: "Ed had edited it.", repetition: "x3" },
  { id: 44, text: "We surely shall see the sun shine soon." },
  { id: 45, text: "Which wristwatches are Swiss wristwatches?" },
  { id: 46, text: "Fred fed Ted bread, and Ted fed Fred bread." },
  { id: 47, text: "I slit the sheet, the sheet I slit, and on the slitted sheet I sit." },
  { id: 48, text: "A skunk sat on a stump and thunk the stump stunk, but the stump thunk the skunk stunk." },
  { id: 49, text: "Lesser leather never weathered wetter weather better." },
  { id: 50, text: "Of all the vids I've ever viewed, I've never viewed a vid as valued as Alex's engVid vid." }
];

/**
 * PTE Bridge Official Write Essay Templates (PTE Bridge - Your Trusted Mentor)
 */
export const PTE_BRIDGE_ESSAY_TEMPLATES: Record<'discussion' | 'problems_solutions', EssayTemplateType> = {
  discussion: {
    id: 'discussion',
    name: 'Discussion Type - Questions',
    duration: '20 min',
    sections: [
      {
        title: 'Introduction',
        points: [
          '1. The idea that [Topic sentence (paraphrase)], which is a widely debated issue/concern in modern society, has once again sparked controversy.',
          '2. Some proponents/people argue that [Side A (sentence)], while others believe that [Side B (sentence)].',
          '3. This essay will discuss both perspectives before reaching a logical conclusion and give my opinion.'
        ]
      },
      {
        title: 'Body Paragraph 01',
        points: [
          '1. To begin with, there are several reasons why many people support [Side A (phrase)].',
          '2. The most important reason is that [Idea 1 (sentence)], which has a significant impact on this scenario.',
          '3. For example, [Example 1 (sentence)], clearly showing how this idea works in real life.',
          '4. Furthermore, [Idea 2 (phrase)] also strengthens this argument by contributing to positive/negative outcomes.'
        ]
      },
      {
        title: 'Body Paragraph 02',
        points: [
          '1. On the other hand/however, critics/opponents argue that [Side B (sentence)].',
          '2. This is mainly because [Idea 1 (sentence)], which may lead to certain negative/positive consequences.',
          '3. For instance, [Example 2 (sentence)], which highlights this drawback clearly.',
          '4. In addition, [Idea 2 (phrase)] further supports this concern by showing its wider impact.'
        ]
      },
      {
        title: 'Conclusion',
        points: [
          '1. In conclusion, although both sides present valid arguments, I strongly believe that [Side A / Side B (phrase)] is more convincing overall.',
          '2. Therefore, a balanced approach is necessary to maximize benefits and reduce potential drawbacks.'
        ]
      }
    ],
    fullText: `The idea that [Topic sentence (paraphrase)], which is a widely debated issue/concern in modern society, has once again sparked controversy. Some proponents/people argue that [Side A (sentence)], while others believe that [Side B (sentence)]. This essay will discuss both perspectives before reaching a logical conclusion and give my opinion.

To begin with, there are several reasons why many people support [Side A (phrase)]. The most important reason is that [Idea 1 (sentence)], which has a significant impact on this scenario. For example, [Example 1 (sentence)], clearly showing how this idea works in real life. Furthermore, [Idea 2 (phrase)] also strengthens this argument by contributing to positive/negative outcomes.

On the other hand/however, critics/opponents argue that [Side B (sentence)]. This is mainly because [Idea 1 (sentence)], which may lead to certain negative/positive consequences. For instance, [Example 2 (sentence)], which highlights this drawback clearly. In addition, [Idea 2 (phrase)] further supports this concern by showing its wider impact.

In conclusion, although both sides present valid arguments, I strongly believe that [Side A / Side B (phrase)] is more convincing overall. Therefore, a balanced approach is necessary to maximize benefits and reduce potential drawbacks.`
  },

  problems_solutions: {
    id: 'problems_solutions',
    name: 'Problems and Solutions type - Questions',
    duration: '20 min',
    sections: [
      {
        title: 'Introduction',
        points: [
          '1. The idea that [Topic (Sentence)], which is widely debated in modern society, has become a major concern.',
          '2. There are a number of major factors responsible for this.',
          '3. However, certain measures can be taken to address these issues.',
          '4. This essay will elaborate on the problems and suggest logical solutions.'
        ]
      },
      {
        title: 'Body Paragraph 01 - Problems',
        points: [
          '1. To begin with, there are numerous significant factors which contribute to the [Problem 1 (phrase)] mentioned above.',
          '2. However, the most evident one derives from the fact that [Cause (sentence)].',
          '3. For instance, [Example 1 (sentence)].',
          '4. This matter has resulted in a number of consequences, which include [Effect (phrase)].'
        ]
      },
      {
        title: 'Body Paragraph 02 - Solutions',
        points: [
          '1. Nonetheless, several measures can be taken to address the impacts of [Problem (phrase)].',
          '2. Perhaps the most effective way is [Solution 1 (phrase)].',
          '3. For example, [Example (sentence)], which clearly demonstrates its effectiveness.',
          '4. Another remedy is that [Solution 2 (sentence)], which can further help to improve the situation.'
        ]
      },
      {
        title: 'Conclusion Paragraph',
        points: [
          '1. In conclusion, although [Topic (phrase)] presents serious challenges, these issues can be managed effectively.',
          '2. A combination of [Solution 1 (phrase)] and [Solution 2 (phrase)] is necessary to ensure long-term improvement.'
        ]
      }
    ],
    fullText: `The idea that [Topic (Sentence)], which is widely debated in modern society, has become a major concern. There are a number of major factors responsible for this. However, certain measures can be taken to address these issues. This essay will elaborate on the problems and suggest logical solutions.

To begin with, there are numerous significant factors which contribute to the [Problem 1 (phrase)] mentioned above. However, the most evident one derives from the fact that [Cause (sentence)]. For instance, [Example 1 (sentence)]. This matter has resulted in a number of consequences, which include [Effect (phrase)].

Nonetheless, several measures can be taken to address the impacts of [Problem (phrase)]. Perhaps the most effective way is [Solution 1 (phrase)]. For example, [Example (sentence)], which clearly demonstrates its effectiveness. Another remedy is that [Solution 2 (sentence)], which can further help to improve the situation.

In conclusion, although [Topic (phrase)] presents serious challenges, these issues can be managed effectively. A combination of [Solution 1 (phrase)] and [Solution 2 (phrase)] is necessary to ensure long-term improvement.`
  }
};

export interface SgdTemplateType {
  id: string;
  name: string;
  duration: string;
  speakerCount: number;
  sections: {
    title: string;
    points: string[];
  }[];
  fullText: string;
  tips: string[];
}

/**
 * PTE Bridge Official Summarize Group Discussion (SGD) Templates
 * Designed for 3-speaker and 2-speaker PTE academic group discussions
 */
export const PTE_BRIDGE_SGD_TEMPLATES: Record<'three_speakers' | 'two_speakers', SgdTemplateType> = {
  three_speakers: {
    id: 'three_speakers',
    name: '3-Speaker Group Discussion Template (PTE Bridge Official)',
    duration: '2 min speaking',
    speakerCount: 3,
    sections: [
      {
        title: 'Introduction (Main Topic)',
        points: [
          'The group discussion was mainly focused on the topic of [Main Topic].',
          'The speakers explored several perspectives regarding this significant issue.'
        ]
      },
      {
        title: 'Speaker 1 Viewpoint',
        points: [
          'Initially, the first speaker emphasized that [Speaker 1 Key Point], highlighting the importance of [Key Evidence/Detail].'
        ]
      },
      {
        title: 'Speaker 2 Viewpoint / Counterpoint',
        points: [
          'In addition / However, the second speaker pointed out that [Speaker 2 Point], arguing that [Supporting Detail].'
        ]
      },
      {
        title: 'Speaker 3 Contribution & Solution',
        points: [
          'Furthermore, the third speaker contributed by explaining that [Speaker 3 Point], suggesting that [Action/Measure].'
        ]
      },
      {
        title: 'Conclusion / Group Consensus',
        points: [
          'In conclusion, the speakers mutually acknowledged that [Key Takeaway/Consensus], which is essential for future development.'
        ]
      }
    ],
    fullText: `The group discussion was mainly focused on the topic of [Main Topic]. The speakers explored several perspectives regarding this significant issue. Initially, the first speaker emphasized that [Speaker 1 Key Point], highlighting the importance of [Key Evidence/Detail]. In addition / However, the second speaker pointed out that [Speaker 2 Point], arguing that [Supporting Detail]. Furthermore, the third speaker contributed by explaining that [Speaker 3 Point], suggesting that [Action/Measure]. In conclusion, the speakers mutually acknowledged that [Key Takeaway/Consensus], which is essential for future development.`,
    tips: [
      'Listen for the topic statement in the first 10 seconds of the discussion.',
      'Identify each speaker (usually 3 speakers) and note 1 keyword or argument per speaker.',
      'Maintain continuous oral fluency without pausing or hesitating.',
      'Use the connector phrases: "Initially", "In addition / However", "Furthermore", "In conclusion".'
    ]
  },
  two_speakers: {
    id: 'two_speakers',
    name: '2-Speaker Debate / Discussion Template',
    duration: '2 min speaking',
    speakerCount: 2,
    sections: [
      {
        title: 'Introduction',
        points: [
          'The speakers were engaged in a constructive dialogue regarding [Main Topic].'
        ]
      },
      {
        title: 'First Speaker Argument',
        points: [
          'The first speaker asserted that [Speaker 1 Point], underlining the fact that [Detail].'
        ]
      },
      {
        title: 'Second Speaker Perspective',
        points: [
          'On the other hand, the second speaker highlighted that [Speaker 2 Point], drawing attention to [Detail].'
        ]
      },
      {
        title: 'Conclusion',
        points: [
          'Overall, both participants agreed that a well-balanced perspective is vital to address [Topic].'
        ]
      }
    ],
    fullText: `The speakers were engaged in a constructive dialogue regarding [Main Topic]. The first speaker asserted that [Speaker 1 Point], underlining the fact that [Detail]. On the other hand, the second speaker highlighted that [Speaker 2 Point], drawing attention to [Detail]. Overall, both participants agreed that a well-balanced perspective is vital to address [Topic].`,
    tips: [
      'Clearly contrast the two speakers using "asserted that" and "on the other hand".',
      'Keep pronunciation crisp and maintain normal conversational pace.'
    ]
  }
};

/**
 * Backward compatibility export
 */
export const PTE_ESSAY_TEMPLATE = {
  title: 'PTE Bridge - Discussion & Problems/Solutions Essay Templates',
  targetLength: '200–300 words (Sweet spot: 220–260 words)',
  idealTime: '20 minutes',
  fullTemplate: PTE_BRIDGE_ESSAY_TEMPLATES.discussion.fullText,
  structure: [
    { paragraph: 'Introduction', text: PTE_BRIDGE_ESSAY_TEMPLATES.discussion.sections[0].points.join('\n') },
    { paragraph: 'Body Paragraph 01', text: PTE_BRIDGE_ESSAY_TEMPLATES.discussion.sections[1].points.join('\n') },
    { paragraph: 'Body Paragraph 02', text: PTE_BRIDGE_ESSAY_TEMPLATES.discussion.sections[2].points.join('\n') },
    { paragraph: 'Conclusion', text: PTE_BRIDGE_ESSAY_TEMPLATES.discussion.sections[3].points.join('\n') }
  ]
};

/**
 * Pearson Academic Collocation List (Selected High-Frequency Batches)
 * Formatted for 100 collocations / day study targets
 */
export const PEARSON_ACADEMIC_COLLOCATIONS: CollocationItem[] = [
  // Batch 1 (1 - 30)
  { id: 1, component1: 'abstract', pos1: 'adj', component2: 'concept', pos2: 'n' },
  { id: 2, component1: 'academic', pos1: 'adj', component2: 'achievement', pos2: 'n' },
  { id: 3, component1: 'academic', pos1: 'adj', component2: 'career', pos2: 'n' },
  { id: 4, addition: '(in)', component1: 'academic', pos1: 'adj', component2: 'circles', pos2: 'n' },
  { id: 5, component1: 'academic', pos1: 'adj', component2: 'community', pos2: 'n' },
  { id: 6, component1: 'academic', pos1: 'adj', component2: 'debate', pos2: 'n' },
  { id: 7, component1: 'academic', pos1: 'adj', component2: 'discipline', pos2: 'n' },
  { id: 8, component1: 'academic', pos1: 'adj', component2: 'discourse', pos2: 'n' },
  { id: 9, component1: 'academic', pos1: 'adj', component2: 'institution', pos2: 'n' },
  { id: 10, component1: 'academic', pos1: 'adj', component2: 'journal', pos2: 'n' },
  { id: 11, component1: 'academic', pos1: 'adj', component2: 'life', pos2: 'n' },
  { id: 12, component1: 'academic', pos1: 'adj', component2: 'performance', pos2: 'n' },
  { id: 13, component1: 'academic', pos1: 'adj', component2: 'research', pos2: 'n' },
  { id: 14, component1: 'academic', pos1: 'adj', component2: 'skills', pos2: 'n' },
  { id: 15, component1: 'academic', pos1: 'adj', component2: 'study', pos2: 'n' },
  { id: 16, component1: 'academic', pos1: 'adj', component2: 'success', pos2: 'n' },
  { id: 17, component1: 'academic', pos1: 'adj', component2: 'work', pos2: 'n' },
  { id: 18, component1: 'academic', pos1: 'adj', component2: 'world', pos2: 'n' },
  { id: 19, component1: 'academic', pos1: 'adj', component2: 'writing', pos2: 'n' },
  { id: 20, component1: 'academic', pos1: 'adj', component2: 'year', pos2: 'n' },
  { id: 21, component1: 'accept', pos1: 'v', component2: 'responsibility', pos2: 'n' },
  { id: 22, component1: 'acceptable', pos1: 'adj', component2: 'behaviour', pos2: 'n' },
  { id: 23, component1: 'accurate', pos1: 'adj', component2: 'assessment', pos2: 'n' },
  { id: 24, component1: 'accurate', pos1: 'adj', component2: 'description', pos2: 'n' },
  { id: 25, component1: 'accurate', pos1: 'adj', component2: 'information', pos2: 'n' },
  { id: 26, component1: 'accurate', pos1: 'adj', component2: 'measurement', pos2: 'n' },
  { id: 27, component1: 'accurate', pos1: 'adj', component2: 'picture', pos2: 'n' },
  { id: 28, component1: 'accurate', pos1: 'adj', component2: 'record', pos2: 'n' },
  { id: 29, component1: 'achieve (a)', pos1: 'v', component2: 'goal', pos2: 'n' },
  { id: 30, component1: 'achieve (an)', pos1: 'v', component2: 'objective', pos2: 'n' },

  // Batch 1 (31 - 60)
  { id: 31, component1: 'achieve (an)', pos1: 'v', component2: 'outcome', pos2: 'n' },
  { id: 32, component1: 'acquire', pos1: 'v', component2: 'knowledge', pos2: 'n' },
  { id: 33, component1: 'active', pos1: 'adj', component2: 'involvement', pos2: 'n' },
  { id: 34, component1: 'active', pos1: 'adj', component2: 'participant', pos2: 'n' },
  { id: 35, component1: 'active', pos1: 'adj', component2: 'participation', pos2: 'n' },
  { id: 36, component1: 'active', pos1: 'adj', component2: 'role', pos2: 'n' },
  { id: 37, addition: '(be)', component1: 'actively', pos1: 'adv', component2: 'involved', pos2: 'vpp' },
  { id: 38, component1: 'acutely', pos1: 'adv', component2: 'aware', pos2: 'adj' },
  { id: 39, component1: 'add', pos1: 'v', component2: 'information', pos2: 'n' },
  { id: 40, component1: 'additional', pos1: 'adj', component2: 'cost', pos2: 'n' },
  { id: 41, component1: 'additional', pos1: 'adj', component2: 'information', pos2: 'n' },
  { id: 42, component1: 'additional', pos1: 'adj', component2: 'problem', pos2: 'n' },
  { id: 43, component1: 'additional', pos1: 'adj', component2: 'resources', pos2: 'n' },
  { id: 44, component1: 'additional', pos1: 'adj', component2: 'support', pos2: 'n' },
  { id: 45, component1: 'address (an)', pos1: 'v', component2: 'issue', pos2: 'n' },
  { id: 46, component1: 'administrative', pos1: 'adj', component2: 'practices', pos2: 'n' },
  { id: 47, component1: 'adopt (a)', pos1: 'v', component2: 'procedure', pos2: 'n' },
  { id: 48, component1: 'adopt (an)', pos1: 'v', component2: 'approach', pos2: 'n' },
  { id: 49, component1: 'advanced', pos1: 'adj', component2: 'economy', pos2: 'n' },
  { id: 50, component1: 'advanced', pos1: 'adj', component2: 'technology', pos2: 'n' },
  { id: 51, component1: 'adverse', pos1: 'adj', component2: 'effect', pos2: 'n' },
  { id: 52, component1: 'adverse', pos1: 'adj', component2: 'reaction', pos2: 'n' },
  { id: 53, component1: 'adversely', pos1: 'adv', component2: 'affect', pos2: 'v' },
  { id: 54, component1: 'affect (the)', pos1: 'v', component2: 'outcome', pos2: 'n' },
  { id: 55, component1: 'affect (the)', pos1: 'v', component2: 'development', pos2: 'n', addition2: '(of)' },
  { id: 56, component1: 'allocate', pos1: 'v', component2: 'resources', pos2: 'n' },
  { id: 57, component1: 'allow', pos1: 'v', component2: 'access', pos2: 'n', addition2: '(to)' },
  { id: 58, component1: 'almost', pos1: 'adv', component2: 'identical', pos2: 'adj' },
  { id: 59, component1: 'alternative', pos1: 'adj', component2: 'approach', pos2: 'n' },
  { id: 60, component1: 'alternative', pos1: 'adj', component2: 'explanation', pos2: 'n' },

  // Batch 1 (61 - 100)
  { id: 61, component1: 'alternative', pos1: 'adj', component2: 'form', pos2: 'n' },
  { id: 62, component1: 'alternative', pos1: 'adj', component2: 'interpretation', pos2: 'n' },
  { id: 63, component1: 'alternative', pos1: 'adj', component2: 'means', pos2: 'n' },
  { id: 64, component1: 'alternative', pos1: 'adj', component2: 'method', pos2: 'n' },
  { id: 65, component1: 'alternative', pos1: 'adj', component2: 'model', pos2: 'n' },
  { id: 66, component1: 'alternative', pos1: 'adj', component2: 'solution', pos2: 'n' },
  { id: 67, component1: 'alternative', pos1: 'adj', component2: 'source', pos2: 'n' },
  { id: 68, component1: 'alternative', pos1: 'adj', component2: 'strategy', pos2: 'n' },
  { id: 69, component1: 'alternative', pos1: 'adj', component2: 'view', pos2: 'n' },
  { id: 70, component1: 'alternative', pos1: 'adj', component2: 'way', pos2: 'n' },
  { id: 71, component1: 'ample', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 72, component1: 'analytical', pos1: 'adj', component2: 'approach', pos2: 'n' },
  { id: 73, component1: 'analytical', pos1: 'adj', component2: 'tool', pos2: 'n' },
  { id: 74, component1: 'anecdotal', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 75, component1: 'annual', pos1: 'adj', component2: 'conference', pos2: 'n' },
  { id: 76, component1: 'annual', pos1: 'adj', component2: 'meeting', pos2: 'n' },
  { id: 77, component1: 'annual', pos1: 'adj', component2: 'rate', pos2: 'n' },
  { id: 78, component1: 'annual', pos1: 'adj', component2: 'report', pos2: 'n' },
  { id: 79, component1: 'annual', pos1: 'adj', component2: 'review', pos2: 'n' },
  { id: 80, component1: 'apply', pos1: 'v', component2: 'equally', pos2: 'adv' },
  { id: 81, component1: 'apply (a)', pos1: 'v', component2: 'method', pos2: 'n' },
  { id: 82, component1: 'apply (the)', pos1: 'v', component2: 'theory', pos2: 'n' },
  { id: 83, component1: 'appropriate', pos1: 'adj', component2: 'action', pos2: 'n' },
  { id: 84, component1: 'appropriate', pos1: 'adj', component2: 'behaviour', pos2: 'n' },
  { id: 85, component1: 'appropriate', pos1: 'adj', component2: 'conditions', pos2: 'n' },
  { id: 86, component1: 'appropriate', pos1: 'adj', component2: 'data', pos2: 'n' },
  { id: 87, component1: 'appropriate', pos1: 'adj', component2: 'form', pos2: 'n' },
  { id: 88, component1: 'appropriate', pos1: 'adj', component2: 'language', pos2: 'n' },
  { id: 89, component1: 'appropriate', pos1: 'adj', component2: 'level', pos2: 'n' },
  { id: 90, component1: 'appropriate', pos1: 'adj', component2: 'point', pos2: 'n' },
  { id: 91, component1: 'appropriate', pos1: 'adj', component2: 'response', pos2: 'n' },
  { id: 92, component1: 'appropriate', pos1: 'adj', component2: 'skills', pos2: 'n' },
  { id: 93, component1: 'appropriate', pos1: 'adj', component2: 'treatment', pos2: 'n' },
  { id: 94, component1: 'appropriate', pos1: 'adj', component2: 'way', pos2: 'n' },
  { id: 95, component1: 'armed', pos1: 'adj', component2: 'conflict', pos2: 'n' },
  { id: 96, component1: 'artificial', pos1: 'adj', component2: 'intelligence', pos2: 'n' },
  { id: 97, component1: 'assess (the)', pos1: 'v', component2: 'impact', pos2: 'n', addition2: '(of)' },
  { id: 98, component1: 'assessment', pos1: 'n', component2: 'process', pos2: 'n' },
  { id: 99, component1: 'associated', pos1: 'adj', component2: 'factors', pos2: 'n' },
  { id: 100, component1: 'assume', pos1: 'v', component2: 'responsibility', pos2: 'n' },

  // Batch 2 High-Frequency Core Samples
  { id: 101, component1: 'assume (the)', pos1: 'v', component2: 'role', pos2: 'n', addition2: '(of)' },
  { id: 102, component1: 'atomic', pos1: 'adj', component2: 'energy', pos2: 'n' },
  { id: 103, component1: 'attend (a)', pos1: 'v', component2: 'conference', pos2: 'n' },
  { id: 104, component1: 'available', pos1: 'adj', component2: 'data', pos2: 'n' },
  { id: 105, component1: 'available', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 106, component1: 'available', pos1: 'adj', component2: 'information', pos2: 'n' },
  { id: 107, component1: 'available', pos1: 'adj', component2: 'resources', pos2: 'n' },
  { id: 108, component1: 'average', pos1: 'adj', component2: 'score', pos2: 'n' },
  { id: 109, component1: 'background', pos1: 'n', component2: 'knowledge', pos2: 'n' },
  { id: 110, component1: 'basic', pos1: 'adj', component2: 'assumption', pos2: 'n' },
  { id: 111, component1: 'basic', pos1: 'adj', component2: 'component', pos2: 'n' },
  { id: 112, component1: 'basic', pos1: 'adj', component2: 'concept', pos2: 'n' },
  { id: 113, component1: 'basic', pos1: 'adj', component2: 'element', pos2: 'n' },
  { id: 114, component1: 'basic', pos1: 'adj', component2: 'function', pos2: 'n' },
  { id: 115, component1: 'basic', pos1: 'adj', component2: 'information', pos2: 'n' },
  { id: 116, component1: 'basic', pos1: 'adj', component2: 'premise', pos2: 'n' },
  { id: 117, component1: 'basic', pos1: 'adj', component2: 'principle', pos2: 'n' },
  { id: 118, component1: 'basic', pos1: 'adj', component2: 'research', pos2: 'n' },
  { id: 119, component1: 'basic', pos1: 'adj', component2: 'structure', pos2: 'n' },
  { id: 120, component1: 'basic', pos1: 'adj', component2: 'technique', pos2: 'n' },
  { id: 121, component1: 'bear', pos1: 'v', component2: 'resemblance', pos2: 'n', addition2: '(to)' },
  { id: 122, component1: 'become', pos1: 'v', component2: 'apparent', pos2: 'adj' },
  { id: 123, component1: 'become', pos1: 'v', component2: 'available', pos2: 'adj' },
  { id: 124, component1: 'become', pos1: 'v', component2: 'aware', pos2: 'adj' },
  { id: 125, component1: 'become', pos1: 'v', component2: 'blurred', pos2: 'adj' },
  { id: 126, component1: 'become', pos1: 'v', component2: 'established', pos2: 'adj' },
  { id: 127, component1: 'become', pos1: 'v', component2: 'evident', pos2: 'adj' },
  { id: 128, component1: 'become', pos1: 'v', component2: 'independent', pos2: 'adj' },
  { id: 129, component1: 'become', pos1: 'v', component2: 'involved', pos2: 'adj', addition2: '(with/in)' },
  { id: 130, component1: 'become', pos1: 'v', component2: 'obvious', pos2: 'adj' },
  { id: 131, component1: 'become', pos1: 'v', component2: 'visible', pos2: 'adj' },
  { id: 132, component1: 'become', pos1: 'v', component2: 'widespread', pos2: 'adj' },
  { id: 133, component1: 'become (a)', pos1: 'v', component2: 'source', pos2: 'n', addition2: '(of)' },
  { id: 134, component1: 'become (the)', pos1: 'v', component2: 'focus', pos2: 'n', addition2: '(of)' },
  { id: 135, component1: 'begin (a)', pos1: 'v', component2: 'process', pos2: 'n' },
  { id: 136, component1: 'behave', pos1: 'v', component2: 'differently', pos2: 'adv' },
  { id: 137, component1: 'beneficial', pos1: 'adj', component2: 'effect', pos2: 'n' },
  { id: 138, addition: '(be)', component1: 'best', pos1: 'adv', component2: 'described', pos2: 'vpp', addition2: '(as, in terms of)' },
  { id: 139, component1: 'binary', pos1: 'adj', component2: 'opposition', pos2: 'n' },
  { id: 140, component1: 'binary', pos1: 'adj', component2: 'system', pos2: 'n' },
  { id: 141, component1: 'biological', pos1: 'adj', component2: 'evolution', pos2: 'n' },
  { id: 142, component1: 'biological', pos1: 'adj', component2: 'science', pos2: 'n' },
  { id: 143, component1: 'biological', pos1: 'adj', component2: 'sex', pos2: 'n' },
  { id: 144, component1: 'brief', pos1: 'adj', component2: 'account', pos2: 'n' },
  { id: 145, component1: 'brief', pos1: 'adj', component2: 'description', pos2: 'n' },
  { id: 146, component1: 'brief', pos1: 'adj', component2: 'discussion', pos2: 'n' },
  { id: 147, component1: 'brief', pos1: 'adj', component2: 'history', pos2: 'n' },
  { id: 148, component1: 'brief', pos1: 'adj', component2: 'introduction', pos2: 'n' },
  { id: 149, component1: 'brief', pos1: 'adj', component2: 'overview', pos2: 'n' },
  { id: 150, component1: 'brief', pos1: 'adj', component2: 'period', pos2: 'n' },
  { id: 151, component1: 'broad', pos1: 'adj', component2: 'category', pos2: 'n' },
  { id: 152, component1: 'broad', pos1: 'adj', component2: 'range', pos2: 'n' },
  { id: 153, component1: 'causal', pos1: 'adj', component2: 'relationship', pos2: 'n' },
  { id: 154, component1: 'central', pos1: 'adj', component2: 'issue', pos2: 'n' },
  { id: 155, component1: 'central', pos1: 'adj', component2: 'theme', pos2: 'n' },
  { id: 156, component1: 'certain', pos1: 'adj', component2: 'circumstances', pos2: 'n' },
  { id: 157, component1: 'clear', pos1: 'adj', component2: 'distinction', pos2: 'n' },
  { id: 158, component1: 'clear', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 159, component1: 'closely', pos1: 'adv', component2: 'linked', pos2: 'vpp' },
  { id: 160, component1: 'closely', pos1: 'adv', component2: 'related', pos2: 'vpp' },
  { id: 161, component1: 'cognitive', pos1: 'adj', component2: 'development', pos2: 'n' },
  { id: 162, component1: 'coherent', pos1: 'adj', component2: 'argument', pos2: 'n' },
  { id: 163, component1: 'collective', pos1: 'adj', component2: 'action', pos2: 'n' },
  { id: 164, component1: 'common', pos1: 'adj', component2: 'feature', pos2: 'n' },
  { id: 165, component1: 'comparative', pos1: 'adj', component2: 'study', pos2: 'n' },
  { id: 166, component1: 'complex', pos1: 'adj', component2: 'process', pos2: 'n' },
  { id: 167, component1: 'conclusive', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 168, component1: 'consistent', pos1: 'adj', component2: 'pattern', pos2: 'n' },
  { id: 169, component1: 'constant', pos1: 'adj', component2: 'rate', pos2: 'n' },
  { id: 170, component1: 'construct', pos1: 'v', component2: 'model', pos2: 'n' },
  { id: 171, component1: 'contemporary', pos1: 'adj', component2: 'society', pos2: 'n' },
  { id: 172, component1: 'crucial', pos1: 'adj', component2: 'role', pos2: 'n' },
  { id: 173, component1: 'cultural', pos1: 'adj', component2: 'diversity', pos2: 'n' },
  { id: 174, component1: 'data', pos1: 'n', component2: 'analysis', pos2: 'n' },
  { id: 175, component1: 'deeply', pos1: 'adv', component2: 'rooted', pos2: 'vpp' },
  { id: 176, component1: 'define (a)', pos1: 'v', component2: 'concept', pos2: 'n' },
  { id: 177, component1: 'demonstrate (an)', pos1: 'v', component2: 'ability', pos2: 'n' },
  { id: 178, component1: 'direct', pos1: 'adj', component2: 'correlation', pos2: 'n' },
  { id: 179, component1: 'distinct', pos1: 'adj', component2: 'category', pos2: 'n' },
  { id: 180, component1: 'dominant', pos1: 'adj', component2: 'culture', pos2: 'n' },
  { id: 181, component1: 'draw (a)', pos1: 'v', component2: 'conclusion', pos2: 'n' },
  { id: 182, component1: 'economic', pos1: 'adj', component2: 'growth', pos2: 'n' },
  { id: 183, component1: 'empirical', pos1: 'adj', component2: 'data', pos2: 'n' },
  { id: 184, component1: 'establish (a)', pos1: 'v', component2: 'relationship', pos2: 'n' },
  { id: 185, component1: 'ethical', pos1: 'adj', component2: 'issue', pos2: 'n' },
  { id: 186, component1: 'evidence', pos1: 'n', component2: 'suggests', pos2: 'v' },
  { id: 187, component1: 'examine (the)', pos1: 'v', component2: 'evidence', pos2: 'n' },
  { id: 188, component1: 'experimental', pos1: 'adj', component2: 'results', pos2: 'n' },
  { id: 189, component1: 'extensive', pos1: 'adj', component2: 'research', pos2: 'n' },
  { id: 190, component1: 'facilitate', pos1: 'v', component2: 'learning', pos2: 'n' },
  { id: 191, component1: 'fundamental', pos1: 'adj', component2: 'principle', pos2: 'n' },
  { id: 192, component1: 'gather', pos1: 'v', component2: 'data', pos2: 'n' },
  { id: 193, component1: 'global', pos1: 'adj', component2: 'economy', pos2: 'n' },
  { id: 194, component1: 'growing', pos1: 'adj', component2: 'evidence', pos2: 'n' },
  { id: 195, component1: 'high', pos1: 'adj', component2: 'priority', pos2: 'n' },
  { id: 196, component1: 'historical', pos1: 'adj', component2: 'context', pos2: 'n' },
  { id: 197, component1: 'identify (the)', pos1: 'v', component2: 'cause', pos2: 'n' },
  { id: 198, component1: 'immediate', pos1: 'adj', component2: 'effect', pos2: 'n' },
  { id: 199, component1: 'important', pos1: 'adj', component2: 'implication', pos2: 'n' },
  { id: 200, component1: 'increasing', pos1: 'adj', component2: 'trend', pos2: 'n' }
];

/**
 * Returns collocations for a study day in Forward (1 to N) or Backward (N down to 1) order.
 * Day 1: 100 collocations, Day 2: 150, Day 3: 200, etc. (+50 each day).
 */
export function getCollocationsForDay(
  dayNumber: number,
  mode: 'forward' | 'backward' = 'forward',
  customCount?: number
): CollocationItem[] {
  const targetCount = customCount ?? (100 + Math.max(0, dayNumber - 1) * 50);
  const baseList = PEARSON_ACADEMIC_COLLOCATIONS;
  const list: CollocationItem[] = [];

  for (let i = 0; i < targetCount; i++) {
    const baseItem = baseList[i % baseList.length];
    list.push({
      ...baseItem,
      id: i + 1
    });
  }

  if (mode === 'backward') {
    return list.slice().reverse();
  }

  return list;
}

/**
 * Backward compatibility export
 */
export const ACADEMIC_COLLOCATIONS_COLLECTION = PEARSON_ACADEMIC_COLLOCATIONS.map((c) => ({
  collocation: `${c.addition ? c.addition + ' ' : ''}${c.component1} ${c.component2}${c.addition2 ? ' ' + c.addition2 : ''}`,
  type: `${c.pos1.toUpperCase()} + ${c.pos2.toUpperCase()}`,
  meaning: `Pearson Academic Collocation #${c.id}`,
  example: `Common PTE collocation: "${c.component1} ${c.component2}"`
}));
