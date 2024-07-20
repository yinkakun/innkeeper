import { email } from '@innkeeper/service';
import { task } from '@trigger.dev/sdk/v3';

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
