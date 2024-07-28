import type { TriggerConfig } from '@trigger.dev/sdk/v3';

export const config: TriggerConfig = {
  project: 'proj_jtsbdjbbdmhwrdcqtzmi',
  logLevel: 'debug', // TODO: Change to 'info' based on the environment
  retries: {
    enabledInDev: true,
    default: {
      factor: 2,
      maxAttempts: 3,
      randomize: true,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
    },
  },
  triggerDirectories: ['./src/trigger'],
  additionalPackages: [
    'ky@latest',
    'date-fns@latest',
    'otpauth@latest',
    'date-fns@latest',
    'postgres@latest',
    '@anthropic-ai/sdk',
    'date-fns-tz@latest',
    'drizzle-zod@latest',
    'drizzle-orm@latest',
    '@paralleldrive/cuid2@latest',
    '@aws-sdk/client-sesv2@latest',
  ],
  dependenciesToBundle: ['@innkeeper/services', '@innkeeper/db', '@lucia-auth/adapter-drizzle', 'ky'],
};
