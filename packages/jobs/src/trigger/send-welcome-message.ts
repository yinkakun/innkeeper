import { task } from '@trigger.dev/sdk/v3';
import { emailSender } from '../service';

interface SendWelcomeEmailPayload {
  name: string;
  email: string;
}

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: SendWelcomeEmailPayload) => {
    await emailSender.welcomeMessage({ name: payload.name, email: payload.email });
  },
});
