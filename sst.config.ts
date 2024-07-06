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
    const lambda = new sst.aws.Function('TestLambda', {
      url: true,
      handler: './apps/functions/src/hello.handler',
    });

    const frontend = new sst.aws.StaticSite('Frontend', {
      path: './apps/frontend',
      build: {
        output: 'dist',
        command: 'yarn build',
      },
    });

    return {
      hello: lambda.url,
      frontend: frontend.url,
    };
  },
});
