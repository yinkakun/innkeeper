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
    // const frontend = new sst.aws.StaticSite('Frontend', {
    //   path: './apps/frontend',
    //   build: {
    //     output: 'dist',
    //     command: 'yarn build',
    //   },
    // });

    return {
      // frontend: frontend.url,
    };
  },
});
