import type { Handler } from 'aws-lambda';
import { Resource } from 'sst';

console.log('Hello world');

export const handler: Handler = async () => {
  return {
    body: {
      hello: true,
    },
    statusCode: 200,
  };
};
