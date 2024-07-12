/// <reference path="./.sst/platform/config.d.ts" />

import * as aws from '@pulumi/aws';

export default $config({
  app(input) {
    return {
      home: 'aws',
      name: 'innkeeper',
      providers: { aws: true, cloudflare: true },
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    };
  },
  async run() {
    // S3 Bucket -> SQS -> Lambda

    // const queue = new sst.aws.Queue('EmailQueue');
    // queue.subscribe('apps/functions/src/save-journal-entry.handler');

    const emailBucket = new aws.s3.Bucket('email-storage-bucket', {
      bucket: 'email-storage-bucket',
      forceDestroy: true,
    });

    const emailProcessingQueue = new aws.sqs.Queue('email-processing-queue', {
      name: 'email-processing-queue',
    });

    const sesRuleSet = new aws.ses.ReceiptRuleSet('email-rule-set', {
      ruleSetName: 'EmailRuleSet',
    });

    new aws.s3.BucketNotification('bucket-notification', {
      bucket: emailBucket.id,
      queues: [
        {
          events: ['s3:ObjectCreated:*'],
          queueArn: emailProcessingQueue.arn,
        },
      ],
    });

    const emailResponseLambda = new sst.aws.Function('email-response-lambda', {
      handler: 'apps/functions/src/save-journal-entry.handler',
      link: [emailProcessingQueue, emailBucket],
    });

    new aws.lambda.EventSourceMapping(
      'sqs-lambda-trigger',
      {
        functionName: emailResponseLambda.arn,
        eventSourceArn: emailProcessingQueue.arn,
      },
      {},
    );

    // ses receipt rule to save email in s3
    const saveEmailRule = new aws.ses.ReceiptRule('store-email-rule', {
      enabled: true,
      recipients: ['olopo.studio'],
      scanEnabled: true,
      tlsPolicy: 'Require',
      ruleSetName: sesRuleSet.ruleSetName,
      s3Actions: [
        {
          position: 0,
          bucketName: emailBucket.bucket,
          objectKeyPrefix: 'incoming-emails/',
        },
      ],
    });

    const activeRuleSet = new aws.ses.ActiveReceiptRuleSet('active-rule-set', {
      ruleSetName: sesRuleSet.ruleSetName,
    });

    return {
      'queue url': emailProcessingQueue.url,
      'email bucket name': emailBucket.bucket,
      'response handler lambda url': emailResponseLambda.url,
    };
  },
});
