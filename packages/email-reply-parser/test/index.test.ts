import { expect, describe, it } from 'vitest';
import { readFile } from 'fs/promises';
import { EmailReplyParser } from '../lib/index';

const FIRST_FRAGMENT =
  'Fusce bibendum, quam hendrerit sagittis tempor, dui turpis tempus erat, pharetra sodales ante sem sit amet metus.\n\
Nulla malesuada, orci non vulputate lobortis, massa felis pharetra ex, convallis consectetur ex libero eget ante.\n\
Nam vel turpis posuere, rhoncus ligula in, venenatis orci. Duis interdum venenatis ex a rutrum.\n\
Duis ut libero eu lectus consequat consequat ut vel lorem. Vestibulum convallis lectus urna,\n\
et mollis ligula rutrum quis. Fusce sed odio id arcu varius aliquet nec nec nibh.';

const parseEmailFile = async (filename: string) => {
  const file = await readFile(`${__dirname}/fixtures/${filename}.txt`, 'utf-8');
  return new EmailReplyParser().read(file);
};

describe('EmailReplyParser', () => {
  it('parses email with one reply', async () => {
    const body = `Hi folks\n\nWhat is the best way to clear a Riak bucket of all key, values after\nrunning a test?\nI am currently using the Java HTTP API.\n\n-Abhishek Kona\n\n`;

    const email = await parseEmailFile('email_1');
    expect(email.getVisibleText()).toBe(body);
  });
});
