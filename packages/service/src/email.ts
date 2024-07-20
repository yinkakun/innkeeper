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

const CreateSendEmailSchema = z.object({
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  fromAddress: z.string().email(),
  replyToAddress: z.string().email(),
});

export const createSendEmail = (emailConfig: Record<string, unknown>) => {
  const config = CreateSendEmailSchema.parse(emailConfig);

  const ses = new SESv2Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const sendEmail = async (emailData: z.infer<typeof EmailSchema>) => {
    const email = EmailSchema.parse(emailData);

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

    return ses.send(command).catch((error) => {
      console.error('error:', error);
      throw new Error('Failed to send email');
    });
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

export const email = createSendEmail({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  fromAddress: process.env.EMAIL_FROM_ADDRESS,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  replyToAddress: process.env.EMAIL_REPLY_TO_ADDRESS,
});
