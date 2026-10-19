export interface TongueTwisterItem {
  id: string;
  category: string;
  text: string;
  focus: string;
  tip: string;
}

export interface CollocationItem {
  collocation: string;
  type: string;
  meaning: string;
  example: string;
}

export const TONGUE_TWISTERS_COLLECTION: TongueTwisterItem[] = [
  {
    id: 'tt_1',
    category: 'Plosives & Oral Fluency',
    text: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where is the peck of pickled peppers Peter Piper picked?',
    focus: 'Clear /p/ and /k/ consonant releases without puffing air into the mic.',
    tip: 'PTE Speaking Fluency: Keep a steady 130–150 wpm pace. Do not stop at commas; connect syllables smoothly.'
  },
  {
    id: 'tt_2',
    category: 'Sibilants & High Pitch',
    text: 'She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I am sure she sells seashore shells.',
    focus: '/s/ vs /ʃ/ distinction and crisp acoustic acoustic enunciation.',
    tip: 'Keep your tongue tip low behind bottom teeth for /s/, pull back slightly for /sh/.'
  },
  {
    id: 'tt_3',
    category: 'Liquids & Blends (L / R)',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry. Unique New York, unique New York, you know you need unique New York.',
    focus: 'Rapid tongue movement between /l/ and /r/ without vocal hesitation.',
    tip: 'Essential for Read Aloud & Repeat Sentence where mixed consonant clusters cause acoustic hesitations.'
  },
  {
    id: 'tt_4',
    category: 'Dental & Fricatives (TH / W / V)',
    text: 'Which witch wished which wicked wish while walking through the winter wind? Whether the weather is warm, whether the weather is hot, we must weather the weather whatever the weather.',
    focus: '/w/ vs /v/ and voiced/unvoiced /θ/ and /ð/.',
    tip: 'Do not pronounce /w/ with teeth touching lip. Round lips for /w/, upper teeth on lower lip for /v/.'
  },
  {
    id: 'tt_5',
    category: 'Vowel Rhythm & Speed',
    text: 'Betty Botter bought some butter, but she said the butter’s bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my bitter batter better.',
    focus: 'Stress-timed English sentence rhythm and short vowels (/ʌ/, /ɪ/, /e/).',
    tip: 'Speak in thought chunks of 3–4 words to mimic native prosody.'
  },
  {
    id: 'tt_6',
    category: 'Complex Cluster Challenge',
    text: 'The sixth sick sheik’s sixth sheep’s sick. Pad kid pour curd pulled cod. How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    focus: 'End-of-word consonant clusters (/ksθs/, /pt/).',
    tip: 'Clear final consonants contribute significantly to pronunciation scores.'
  }
];

export const ACADEMIC_COLLOCATIONS_COLLECTION: CollocationItem[] = [
  {
    collocation: 'conduct research',
    type: 'Verb + Noun',
    meaning: 'To carry out a systematic scientific investigation',
    example: 'Scientists conduct extensive research to evaluate climate variations.'
  },
  {
    collocation: 'crucial role',
    type: 'Adjective + Noun',
    meaning: 'An extremely important part or position',
    example: 'Renewable energy plays a crucial role in curbing greenhouse emissions.'
  },
  {
    collocation: 'empirical evidence',
    type: 'Adjective + Noun',
    meaning: 'Evidence based on verifiable observation or experience',
    example: 'The hypothesis is firmly substantiated by empirical evidence.'
  },
  {
    collocation: 'pose a threat',
    type: 'Verb + Noun',
    meaning: 'To create a danger or hazard',
    example: 'Uncontrolled deforestation continues to pose a severe threat to biodiversity.'
  },
  {
    collocation: 'significant impact',
    type: 'Adjective + Noun',
    meaning: 'A notable or major effect',
    example: 'Technological advancements have had a significant impact on global logistics.'
  },
  {
    collocation: 'draw a conclusion',
    type: 'Verb + Noun',
    meaning: 'To reach a final decision based on facts',
    example: 'It is premature to draw a definitive conclusion without further longitudinal trials.'
  },
  {
    collocation: 'readily available',
    type: 'Adverb + Adjective',
    meaning: 'Easily obtainable or accessible',
    example: 'Online educational repositories are now readily available to students worldwide.'
  },
  {
    collocation: 'vast majority',
    type: 'Adjective + Noun',
    meaning: 'The greater part by a very large percentage',
    example: 'The vast majority of participants reported measurable performance gains.'
  },
  {
    collocation: 'underlying cause',
    type: 'Adjective + Noun',
    meaning: 'The fundamental root reason for a condition',
    example: 'Poverty remains the underlying cause of high child malnutrition in the region.'
  },
  {
    collocation: 'raise awareness',
    type: 'Verb + Noun',
    meaning: 'To increase public knowledge of an issue',
    example: 'Public campaigns help raise awareness regarding cardiovascular health.'
  },
  {
    collocation: 'integral part',
    type: 'Adjective + Noun',
    meaning: 'An essential and inseparable component',
    example: 'Critical thinking forms an integral part of higher academic education.'
  },
  {
    collocation: 'meet requirements',
    type: 'Verb + Noun',
    meaning: 'To satisfy established conditions or benchmarks',
    example: 'Applicants must meet all regulatory requirements before visa issuance.'
  },
  {
    collocation: 'profound effect',
    type: 'Adjective + Noun',
    meaning: 'An intense, deep, or far-reaching influence',
    example: 'Artificial intelligence is having a profound effect on labor economics.'
  },
  {
    collocation: 'widespread belief',
    type: 'Adjective + Noun',
    meaning: 'A widely accepted conviction or consensus',
    example: 'There is a widespread belief that early bilingualism enhances cognition.'
  },
  {
    collocation: 'vitally important',
    type: 'Adverb + Adjective',
    meaning: 'Of paramount necessity',
    example: 'Microphone position is vitally important for automated speech scoring.'
  },
  {
    collocation: 'in terms of',
    type: 'Prepositional Phrase',
    meaning: 'With regard to or in relation to',
    example: 'The two approaches differ significantly in terms of cost efficiency.'
  }
];

export const PTE_ESSAY_TEMPLATE = {
  title: 'Standard 4-Paragraph PTE Academic 79+ Essay Template',
  targetLength: '200–300 words (Sweet spot: 220–260 words)',
  idealTime: '18–20 minutes (Target typing speed: under 6 minutes for structure)',
  structure: [
    {
      paragraph: 'Paragraph 1: Introduction (approx. 50 words)',
      text: 'It is often argued that [TOPIC / GENERAL STATEMENT]. While some individuals advocate that [VIEWPOINT A], others firmly believe that [VIEWPOINT B]. In my opinion, I predominantly agree with the former perspective, and this essay will elucidate relevant arguments supported by examples to substantiate this viewpoint.'
    },
    {
      paragraph: 'Paragraph 2: First Main Argument (approx. 70 words)',
      text: 'To begin with, the primary rationale supporting this stance is that [FIRST SUPPORTING REASON]. A salient case in point is that [DETAILED EXPLANATION OR EXAMPLE]. Consequently, this demonstrates that [POSITIVE IMPACT / RESULT], which directly reinforces the imperative need for [KEY POINT].'
    },
    {
      paragraph: 'Paragraph 3: Second Main Argument / Analysis (approx. 70 words)',
      text: 'Furthermore, another compelling facet worthy of consideration is [SECOND SUPPORTING REASON]. To illustrate, recent empirical investigations have revealed that [EVIDENCE OR REAL-WORLD OBSERVATION]. As a direct result, [SECONDARY BENEFIT], thereby cementing the viability of this approach in modern society.'
    },
    {
      paragraph: 'Paragraph 4: Conclusion (approx. 40 words)',
      text: 'In conclusion, although counterarguments may suggest that [OPPOSING VIEW], the overwhelming benefits regarding [MAIN THEME] remain undeniable. Therefore, it is reasonable to deduce that proactive measures in this direction will yield profound long-term advantages.'
    }
  ],
  fullTemplate: `It is often argued that [TOPIC / GENERAL STATEMENT]. While some individuals advocate that [VIEWPOINT A], others firmly believe that [VIEWPOINT B]. In my opinion, I predominantly agree with the former perspective, and this essay will elucidate relevant arguments supported by examples to substantiate this viewpoint.

To begin with, the primary rationale supporting this stance is that [FIRST SUPPORTING REASON]. A salient case in point is that [DETAILED EXPLANATION OR EXAMPLE]. Consequently, this demonstrates that [POSITIVE IMPACT / RESULT], which directly reinforces the imperative need for [KEY POINT].

Furthermore, another compelling facet worthy of consideration is [SECOND SUPPORTING REASON]. To illustrate, recent empirical investigations have revealed that [EVIDENCE OR REAL-WORLD OBSERVATION]. As a direct result, [SECONDARY BENEFIT], thereby cementing the viability of this approach in modern society.

In conclusion, although counterarguments may suggest that [OPPOSING VIEW], the overwhelming benefits regarding [MAIN THEME] remain undeniable. Therefore, it is reasonable to deduce that proactive measures in this direction will yield profound long-term advantages.`
};
