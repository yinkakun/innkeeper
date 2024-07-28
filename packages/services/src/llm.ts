import Anthropic from '@anthropic-ai/sdk';
import { SHADOW_WORK_SYSTEM_PROMPT, createShadowWorkUserPrompt } from './prompts';

type Model = Anthropic;

interface GeneratePromptPayload {
  tone?: string;
  goal?: string;
}

export const initLlm = (model: Model) => {
  return {
    generatePrompt: async ({ goal, tone }: GeneratePromptPayload) => {
      return await model.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        temperature: 0.5,
        system: SHADOW_WORK_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: createShadowWorkUserPrompt({ tone, goal }),
              },
            ],
          },
        ],
      });
    },
  };
};
