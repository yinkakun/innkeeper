import ky from 'ky';
import { z } from 'zod';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const sendEmailOptions = z.object({
  to: z.string(),
  senderUsername: z.string().optional(),
  replyToUsername: z.string().optional(),
});

const withName = sendEmailOptions.extend({
  name: z.string(),
});

const insightsOptions = withName.extend({
  insights: z.string(),
});

const promptOptions = withName.extend({
  prompt: z.string(),
  subject: z.string(),
});

const otpOptions = sendEmailOptions.extend({
  otp: z.string(),
});

const emailSchema = sendEmailOptions.extend({
  body: z.object({
    html: z.string().optional(),
    text: z.string().optional(),
  }),
  subject: z.string(),
  headers: z.record(z.string()).optional(),
});

const baseConfigSchema = z.object({
  emailDomain: z.string(), // domain name for the email sender eg. example.com
});

const sesConfigSchema = baseConfigSchema.extend({
  provider: z.literal('aws'),
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

const plunkConfigSchema = baseConfigSchema.extend({
  apiKey: z.string(),
  provider: z.literal('plunk'),
});

const sendEmailConfigSchema = z.discriminatedUnion('provider', [sesConfigSchema, plunkConfigSchema]);

export const initEmailSender = (emailConfig: z.infer<typeof sendEmailConfigSchema>) => {
  const config = sendEmailConfigSchema.parse(emailConfig);
  const noReplyEmailAddress = `noreply@${config.emailDomain}`;

  const emailAddress = (username: string) => `${username}@${config.emailDomain}`;

  const sendEmail = async (emailData: z.infer<typeof emailSchema>) => {
    const email = emailSchema.parse(emailData);

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
            Headers: Object.entries(email.headers ?? {}).map(([name, value]) => ({
              Name: name,
              Value: value,
            })),
          },
        },
        Destination: { ToAddresses: [email.to] },
        FromEmailAddress: email.senderUsername ? emailAddress(email.senderUsername) : noReplyEmailAddress,
        ReplyToAddresses: [email.replyToUsername ? emailAddress(email.replyToUsername) : noReplyEmailAddress],
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
        headers: email.headers,
        subject: email.subject,
        body: email.body.html ?? email.body.text,
        from: email.senderUsername ? emailAddress(email.senderUsername) : noReplyEmailAddress,
        replyTo: email.replyToUsername ? emailAddress(email.replyToUsername) : noReplyEmailAddress,
      };

      const response = await ky
        .post(plunkApiUrl, {
          json: plunkPayload,
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
        })
        .json()
        .catch((error) => {
          if (error instanceof Error) {
            // stringify the whole error message
            console.info('👀 Plunk API error:', JSON.stringify(error, null, 2));
            throw error;
          }
          throw new Error('Failed to send email with Plunk', error);
        });
      console.log('🌱 plunk response:', JSON.stringify(response, null, 2));
      return response;
    }
  };

  return {
    alertInactiveUser: async (payload: z.infer<typeof withName>) => {
      return sendEmail({
        to: payload.to,
        subject: 'We miss you!',
        body: {
          text: `Hey ${payload.name}, we miss you!`,
        },
      });
    },
    welcome: async (payload: z.infer<typeof withName>) => {
      return sendEmail({
        to: payload.to,
        subject: 'Welcome!',
        body: {
          text: `Hey ${payload.name}, welcome to Innkeeper!`,
        },
      });
    },
    insights: async (payload: z.infer<typeof insightsOptions>) => {
      return sendEmail({
        to: payload.to,
        subject: 'Weekly Insights',
        body: {
          text: `${payload.insights}`,
        },
      });
    },
    sendPrompt: async ({ prompt, to, replyToUsername, senderUsername, subject, name }: z.infer<typeof promptOptions>) => {
      return sendEmail({
        to,
        subject,
        senderUsername,
        replyToUsername,
        body: {
          text: `
            Hey ${name}, here's your daily prompt:
            ${prompt}
          `,
        },
      });
    },
    otp: async (payload: z.infer<typeof otpOptions>) => {
      return sendEmail({
        to: payload.to,
        subject: 'Login OTP',
        body: {
          text: `Your Login OTP is: ${payload.otp}`,
        },
      });
    },
  };
};
