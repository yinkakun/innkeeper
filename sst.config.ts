/// <reference path="./.sst/platform/config.d.ts" />

import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export default $config({
  app(input) {
    return {
      home: 'aws',
      name: 'innkeeper',
      providers: { aws: true },
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    };
  },
  async run() {
    const emailBucket = new aws.s3.Bucket('IncomingEmailBucket', {
      bucket: pulumi.interpolate`${pulumi.getStack()}-incoming-email-bucket`,
      forceDestroy: true,
    });

    // Set the bucket ownership controls
    const bucketOwnershipControls = new aws.s3.BucketOwnershipControls('BucketOwnershipControls', {
      bucket: emailBucket.id,
      rule: { objectOwnership: 'BucketOwnerPreferred' },
    });

    const bucketAcl = new aws.s3.BucketAclV2(
      'BucketAcl',
      {
        bucket: emailBucket.id,
        acl: 'private',
      },
      {
        dependsOn: [bucketOwnershipControls],
      },
    );

    const bucketPolicy = new aws.s3.BucketPolicy('EmailBucketPolicy', {
      bucket: emailBucket.id,
      policy: pulumi.all([emailBucket.arn, pulumi.output(aws.getCallerIdentity()).accountId]).apply(([bucketArn, accountId]) =>
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'AllowSESPuts',
              Effect: 'Allow',
              Principal: {
                Service: 'ses.amazonaws.com',
              },
              Action: 's3:PutObject',
              Resource: `${bucketArn}/*`,
              Condition: {
                StringEquals: {
                  'aws:Referer': accountId,
                },
              },
            },
          ],
        }),
      ),
    });

    // Create an SQS queue
    const emailQueue = new aws.sqs.Queue('EmailQueue', {
      name: pulumi.interpolate`${pulumi.getStack()}-email-processing-queue`,
    });

    // Add SQS queue policy to allow S3 to send messages
    const queuePolicy = new aws.sqs.QueuePolicy(
      'EmailQueuePolicy',
      {
        queueUrl: emailQueue.id,
        policy: pulumi.all([emailQueue.arn, emailBucket.arn]).apply(([queueArn, bucketArn]) =>
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 's3.amazonaws.com',
                },
                Action: 'sqs:SendMessage',
                Resource: queueArn,
                Condition: {
                  ArnEquals: {
                    'aws:SourceArn': bucketArn,
                  },
                },
              },
            ],
          }),
        ),
      },
      {
        dependsOn: [emailBucket],
      },
    );

    // Add a new policy for basic Lambda execution permissions

    const processJournalEntry = new sst.aws.Function('ProcessJournalEntryLambda', {
      url: true,
      handler: 'apps/functions/src/save-journal-entry.handler',
      permissions: [
        {
          actions: ['*'],
          resources: ['*'],
        },
      ],
      environment: {
        DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
        INNGEST_EVENT_KEY: 'xxx',
      },
    });

    // Create an SES rule set
    const ruleSet = new aws.ses.ReceiptRuleSet('EmailRuleSet', {
      ruleSetName: pulumi.interpolate`${pulumi.getStack()}-email-processing-rules`,
    });

    const receiptRule = new aws.ses.ReceiptRule(
      'ReceiptRule',
      {
        enabled: true,
        scanEnabled: true,
        tlsPolicy: 'Require',
        recipients: ['yinkakun@gmail.com'],
        ruleSetName: ruleSet.ruleSetName,
        addHeaderActions: [
          {
            position: 0,
            headerName: 'X-S3-Bucket',
            headerValue: 'email-storage-bucket',
          },
        ],
        s3Actions: [
          {
            position: 1,
            bucketName: emailBucket.bucket,
            objectKeyPrefix: 'incoming-emails/',
          },
        ],
      },
      {
        dependsOn: [bucketPolicy, bucketAcl],
      },
    );

    // Set up S3 event notification to SQS (S3 -> SQS)
    const bucketNotification = new aws.s3.BucketNotification(
      'BucketNotification',
      {
        bucket: emailBucket.id,
        queues: [
          {
            queueArn: emailQueue.arn,
            events: ['s3:ObjectCreated:*'],
          },
        ],
      },
      {
        dependsOn: [queuePolicy],
      },
    );

    // Set up Lambda event source mapping (SQS -> Lambda)
    const eventSourceMapping = new aws.lambda.EventSourceMapping('SqsLambdaTrigger', {
      batchSize: 1,
      eventSourceArn: emailQueue.arn,
      functionName: processJournalEntry.arn,
    });

    // **** Email sender **** //

    const emailSender = new sst.aws.Email('EmailSender', { sender: 'dryinkuzz@gmail.com' });

    const inngestLambdaFunction = new sst.aws.Function('InngestLambda', {
      url: true,
      link: [emailSender],
      handler: 'apps/functions/src/inngest.handler',
      environment: {
        DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
        INNGEST_EVENT_KEY: 'xxx',
      },
    });

    return {
      processEmailFunction: processJournalEntry.url,
      'inngest lambda url': inngestLambdaFunction.url,
    };
  },
});
