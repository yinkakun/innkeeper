import { task } from '@trigger.dev/sdk/v3';
import { email } from '../lib';

interface SendWelcomeEmailPayload {
  name: string;
  email: string;
}

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: SendWelcomeEmailPayload) => {
    await email.welcome({ name: payload.name, to: payload.email });
  },
});
