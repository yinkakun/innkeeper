import ky from 'ky';
import { z } from 'zod';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const EmailSchema = z.object({
  body: z.object({
    html: z.string().optional(),
    text: z.string().optional(),
  }),
  subject: z.string(),
  to: z.array(z.string().email()).nonempty(),
  headers: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
});

const baseConfigSchema = z.object({
  fromAddress: z.string().email(),
  replyToAddress: z.string().email(),
});

const sesConfigSchema = baseConfigSchema.extend({
  provider: z.literal('aws'),
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

const plunkConfigSchema = baseConfigSchema.extend({
  provider: z.literal('plunk'),
  apiKey: z.string(),
});

const sendEmailConfigSchema = z.discriminatedUnion('provider', [sesConfigSchema, plunkConfigSchema]);

export const createSendEmail = (emailConfig: z.infer<typeof sendEmailConfigSchema>) => {
  const config = sendEmailConfigSchema.parse(emailConfig);

  const sendEmail = async (emailData: z.infer<typeof EmailSchema>) => {
    const email = EmailSchema.parse(emailData);

    if (config.provider === 'aws') {
      const sendWithSes = new SESv2Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });

      const command = new SendEmailCommand({
        Content: {
          Simple: {
            Body: {
              Text: email.body.text ? { Data: email.body.text } : undefined,
              Html: email.body.html ? { Data: email.body.html } : undefined,
            },
            Subject: { Data: email.subject },
            Headers: email.headers?.map(({ name, value }) => ({
              Name: name,
              Value: value,
            })),
          },
        },
        FromEmailAddress: config.fromAddress,
        Destination: { ToAddresses: email.to },
        ReplyToAddresses: config.replyToAddress ? [config.replyToAddress] : undefined,
      });

      return sendWithSes.send(command).catch((error) => {
        console.error('error:', error);
        throw new Error('Failed to send email');
      });
    }

    if (config.provider === 'plunk') {
      const plunkApiUrl = 'https://api.useplunk.com/v1/send';

      const plunkPayload = {
        to: email.to,
        subject: email.subject,
        headers: email.headers,
        from: config.fromAddress,
        replyTo: config.replyToAddress,
        body: email.body.html || email.body.text,
      };

      return ky
        .post(plunkApiUrl, {
          json: plunkPayload,
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
        })
        .json()
        .catch((error) => {
          console.error('Plunk API error:', error);
          throw new Error('Failed to send email with Plunk');
        });
    }
  };

  return {
    inactiveUser: async (payload: { name: string; email: string }) => {
      return sendEmail({
        to: [payload.email],
        subject: 'We miss you!',
        body: {
          text: `Hey ${payload.name}, we miss you!`,
        },
      });
    },
    welcomeMessage: async (payload: { name: string; email: string }) => {
      return sendEmail({
        to: [payload.email],
        subject: 'Welcome!',
        body: {
          text: `Hey ${payload.name}, welcome to Innkeeper!`,
        },
      });
    },
    weeklyInsights: async (payload: { name: string; email: string; insights: string }) => {
      return sendEmail({
        to: [payload.email],
        subject: 'Weekly Insights',
        body: {
          text: `Hey ${payload.name}, here are your weekly insights: ${payload.insights}`,
        },
      });
    },
    dailyPrompt: async (payload: { name: string; email: string; prompt: string }) => {
      return sendEmail({
        to: [payload.email],
        subject: 'Daily Prompt',
        body: {
          text: `Hey ${payload.name}, here is your daily prompt: ${payload.prompt}`,
        },
      });
    },
  };
};
