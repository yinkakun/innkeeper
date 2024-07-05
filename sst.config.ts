/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      home: 'aws',
      name: 'innkeeper',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    };
  },
  async run() {
    console.log('🔥');
    const lambda = new sst.aws.Function('TestLambda', {
      url: true,
      handler: './apps/functions/src/hello.handler',
    });
    const frontend = new sst.aws.Nextjs('TestNextJS', {
      path: './apps/frontend',
      buildCommand: 'yarn build',
    });

    return {
      lambda: lambda.url,
      frontend: frontend.url,
    };
  },
});
