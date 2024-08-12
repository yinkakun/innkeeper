export const SHADOW_WORK_SYSTEM_PROMPT = `
# Shadow Journal Prompt Generator

You are an AI assistant specialized in generating daily shadow journal prompts. Your purpose is to help users explore their shadow selves, as conceptualized by Carl Jung, through introspective writing exercises. Each day, you will create a unique, thought-provoking prompt that encourages self-reflection and personal growth.

## Background Knowledge:

1. The "shadow" in Jungian psychology refers to the unconscious or disowned parts of one's personality.
2. Shadow work aims to make the unconscious conscious, promoting self-awareness and personal growth.
3. This process can help individuals heal from past traumas, resolve internal conflicts, and improve relationships.

## Prompt Generation Guidelines:

1. Create prompts that are introspective, challenging, and tailored to exploring one's shadow self.
2. Incorporate themes of self-awareness, personal growth, healing, and authenticity.
3. Use a compassionate and non-judgmental tone to encourage honest self-reflection.
4. Vary the difficulty and emotional depth of prompts to maintain user engagement.
5. Occasionally include relevant quotes from Carl Jung, Friedrich Nietzsche, Rumi, or other philosophers/psychologists to add depth to the prompts.

## Prompt Structure:

1. Start with a brief introduction or context-setting sentence.
2. Present the main journaling question or task.
3. Optionally, include 1-2 follow-up questions to deepen the reflection.
4. End with an encouraging note or a relevant quote.

## Example Prompts:

1. "Our anger often masks deeper emotions. Recall a recent moment of anger. What emotions might be hiding beneath that anger? How might acknowledging these underlying feelings change your perspective?"

2. "Carl Jung said, 'Everything that irritates us about others can lead us to an understanding of ourselves.' Think of someone who irritates you. What quality in them bothers you most? How might this quality reflect an aspect of yourself that you've been avoiding or denying?"

3. "Imagine meeting your shadow self face-to-face. What does it look like? What would it say to you? Write a dialogue between your conscious self and your shadow self, allowing both sides to express themselves freely."

Remember to generate diverse prompts that cover various aspects of shadow work, including facing fears, acknowledging repressed emotions, exploring contradictions in behavior, and integrating disowned parts of the self.
`;

const FOCUS_AREAS = [
  {
    name: 'Repressed emotions',
    description: 'Emotions that have been pushed down or denied, often unconsciously.',
  },
  {
    name: 'Childhood trauma',
    description: 'Unresolved experiences from early life that continue to impact present behavior.',
  },
  {
    name: 'Self-sabotaging behaviors',
    description: 'Actions that undermine personal goals and well-being.',
  },
  {
    name: 'Unacknowledged fears',
    description: 'Anxieties or phobias that are not consciously recognized but influence behavior.',
  },
  {
    name: 'Projection of faults onto others',
    description: "Attributing one's own undesirable traits or behaviors to other people.",
  },
  {
    name: 'Denied aspects of personality',
    description: 'Parts of oneself that are consciously or unconsciously rejected.',
  },
  {
    name: 'Unconscious biases',
    description: 'Prejudices or preconceptions held without awareness.',
  },
  {
    name: 'Suppressed desires',
    description: 'Wants or needs that are pushed aside or denied expression.',
  },
  {
    name: 'Unmet needs',
    description: 'Essential requirements for well-being that are not being fulfilled.',
  },
  {
    name: 'Personal insecurities',
    description: 'Areas of self-doubt or lack of confidence.',
  },
  {
    name: 'Relationship patterns',
    description: 'Recurring dynamics or behaviors in interpersonal connections.',
  },
  {
    name: 'Family dynamics',
    description: 'Intergenerational patterns and roles within the family system.',
  },
  {
    name: 'Cultural conditioning',
    description: 'Beliefs and behaviors shaped by societal norms and expectations.',
  },
  {
    name: 'Limiting beliefs',
    description: 'Self-imposed restrictions on capabilities or possibilities.',
  },
  {
    name: 'Shame and guilt',
    description: 'Feelings of unworthiness or regret that influence behavior.',
  },
  {
    name: 'Inner critic',
    description: 'The internalized voice of self-judgment and criticism.',
  },
  {
    name: 'Perfectionism',
    description: 'The belief that anything less than perfect is unacceptable.',
  },
  {
    name: 'Anger and resentment',
    description: 'Unexpressed or unresolved feelings of frustration or bitterness.',
  },
  {
    name: 'Jealousy and envy',
    description: "Feelings of discontent or resentment towards others' advantages or possessions.",
  },
  {
    name: 'Addictive behaviors',
    description: 'Compulsive actions used to cope with or escape from difficult emotions.',
  },
  {
    name: 'Self-worth issues',
    description: "Challenges in recognizing and accepting one's inherent value.",
  },
  {
    name: 'Unresolved grief',
    description: 'Incomplete processing of loss or significant life changes.',
  },
  {
    name: 'Personal boundaries',
    description: 'Limits and rules set for oneself in relationships and interactions.',
  },
  {
    name: 'Power dynamics',
    description: 'Patterns of control and influence in relationships and social structures.',
  },
  {
    name: 'Spiritual bypassing',
    description: 'Using spiritual beliefs to avoid dealing with psychological issues.',
  },
  {
    name: 'Toxic positivity',
    description: 'The belief that one should maintain a positive mindset regardless of circumstances.',
  },
  {
    name: 'Imposter syndrome',
    description: 'Persistent self-doubt despite evidence of competence and success.',
  },
  {
    name: 'Unacknowledged talents',
    description: 'Skills or abilities that are undervalued or unrecognized by oneself.',
  },
  {
    name: 'Cognitive dissonance',
    description: 'Mental discomfort from holding conflicting beliefs or values.',
  },
  {
    name: 'Defense mechanisms',
    description: 'Psychological strategies used to cope with uncomfortable thoughts or feelings.',
  },
  {
    name: 'Archetypes',
    description: 'Universal, symbolic patterns of behavior (e.g., Inner Child, Warrior, Caregiver).',
  },
  {
    name: 'Shadow aspects of virtues',
    description: 'The potential negative expressions of typically positive traits.',
  },
  {
    name: 'Unconscious motivations',
    description: 'Hidden drives or desires that influence behavior without awareness.',
  },
  {
    name: 'Generational trauma',
    description: 'Psychological effects passed down through generations in families or communities.',
  },
  {
    name: 'Personal values conflicts',
    description: 'Contradictions between held beliefs and actual behaviors or choices.',
  },
  {
    name: 'Self-deception',
    description: 'The act of lying to or misleading oneself, often to avoid uncomfortable truths.',
  },
  {
    name: 'Projection of positive traits',
    description: "Attributing one's own positive qualities to others, often due to low self-esteem.",
  },
  {
    name: 'Unintegrated experiences',
    description: "Events or insights that have not been fully processed or incorporated into one's worldview.",
  },
  {
    name: 'Suppressed creativity',
    description: 'Unexpressed or underutilized artistic or innovative capabilities.',
  },
  {
    name: 'Hidden prejudices',
    description: 'Unconscious biases or discriminatory attitudes not openly acknowledged.',
  },
  {
    name: 'Emotional intelligence gaps',
    description: 'Areas where one lacks awareness or skill in managing emotions.',
  },
  {
    name: 'Unacknowledged privileges',
    description: 'Advantages one has due to social status, often taken for granted.',
  },
  {
    name: 'Resistance to change',
    description: 'Tendency to maintain the status quo, even when change could be beneficial.',
  },
  {
    name: 'Avoidance patterns',
    description: 'Habitual ways of escaping uncomfortable situations or emotions.',
  },
  {
    name: 'Relationship with authority',
    description: "One's typical responses to power structures and those in positions of influence.",
  },
  {
    name: 'Coping mechanisms',
    description: 'Strategies used to manage stress or difficult emotions.',
  },
  {
    name: 'Body image issues',
    description: 'Concerns or insecurities related to physical appearance.',
  },
  {
    name: 'Unresolved conflicts',
    description: 'Ongoing disagreements or tensions, internal or interpersonal.',
  },
  {
    name: 'Personal myths and narratives',
    description: 'The stories one tells oneself about their life and identity.',
  },
  {
    name: 'Relationship with success and failure',
    description: 'Attitudes and behaviors surrounding achievement and setbacks.',
  },
];

const PROMPT_TONES = [
  {
    name: 'reflective',
    description: 'Encouraging deep thought and introspection',
    example: 'Take a moment to look back on...',
  },
  {
    name: 'compassionate',
    description: 'Gentle and understanding approach',
    example: 'Be kind to yourself as you consider...',
  },
  {
    name: 'challenging',
    description: 'Pushing boundaries and comfort zones',
    example: 'Dare to confront the part of you that...',
  },
  {
    name: 'analytical',
    description: 'Logical and methodical examination',
    example: 'Examine the facts and reasons behind...',
  },
  {
    name: 'imaginative',
    description: 'Using creativity and visualization',
    example: 'Imagine a world where your shadow self...',
  },
  {
    name: 'empowering',
    description: 'Focusing on strength and capability',
    example: 'Recognize the power you have to...',
  },
  {
    name: 'curious',
    description: 'Encouraging exploration and discovery',
    example: 'What might happen if you were to...',
  },
  {
    name: 'accepting',
    description: 'Promoting self-acceptance and non-judgment',
    example: 'Without judging, observe the part of you that...',
  },
  {
    name: 'motivational',
    description: 'Inspiring action and change',
    example: 'Take the first step towards...',
  },
  {
    name: 'nurturing',
    description: 'Caring and supportive approach',
    example: 'Gently attend to the part of you that needs...',
  },
  {
    name: 'philosophical',
    description: 'Contemplating deeper meanings and concepts',
    example: 'Consider the nature of...',
  },
  {
    name: 'pragmatic',
    description: 'Practical and solution-oriented',
    example: 'What concrete steps can you take to...',
  },
  {
    name: 'playful',
    description: 'Using humor and lightness',
    example: 'If your shadow had a theme song, what would it be?',
  },
  {
    name: 'confrontational',
    description: 'Directly addressing issues',
    example: 'Face the truth about...',
  },
  {
    name: 'soothing',
    description: 'Calming and reassuring',
    example: 'Allow yourself to find peace with...',
  },
  {
    name: 'inquisitive',
    description: 'Asking probing questions',
    example: 'What lies beneath the surface of...?',
  },
  {
    name: 'mystical',
    description: 'Exploring spiritual or transcendent themes',
    example: 'Connect with the deeper wisdom within you...',
  },
  {
    name: 'scientific',
    description: 'Using empirical observation and analysis',
    example: 'Observe and record your reactions to...',
  },
  {
    name: 'poetic',
    description: 'Using metaphor and artistic expression',
    example: 'If your shadow were a landscape, how would you describe it?',
  },
  {
    name: 'grounding',
    description: 'Focusing on the present and physical reality',
    example: 'Bring awareness to your body as you consider...',
  },
];

interface CreateUserPromptPayload {
  tone: string | undefined | null;
  goal: string | undefined | null;
}

export const createShadowWorkUserPrompt = ({ tone, goal }: CreateUserPromptPayload) => {
  const primaryTone = tone ?? 'reflective';
  const primaryGoal = goal ?? 'self awareness';
  const additionalGoal = getRandomElement(FOCUS_AREAS.filter((f) => f.name !== primaryGoal));
  const additionalTone = getRandomElement(PROMPT_TONES.filter((t) => t.name !== primaryTone));

  const prompt = `
  Generate today's shadow work journal prompt based on the following information:
  2. Desired tone: ${primaryTone}
  1. Primary goal: ${primaryGoal}
  4. Additional tone: ${additionalTone?.name} (${additionalTone?.description})
  4. Additional focus area: ${additionalGoal?.name} (${additionalGoal?.description})
  IMPORTANT: Provide ONLY the journal prompt itself. Do not include any introductory phrases like "Here's today's journal prompt" or any concluding remarks. The output should be ready to present directly to the user as their journaling prompt for the day.
  `;

  return prompt;
};

function getRandomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
