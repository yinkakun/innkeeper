import { task } from '@trigger.dev/sdk/v3';
import { email } from '../service';

interface SendWelcomeEmailPayload {
  name: string;
  email: string;
}

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: SendWelcomeEmailPayload) => {
    await email.welcomeMessage({ name: payload.name, email: payload.email });
  },
});
