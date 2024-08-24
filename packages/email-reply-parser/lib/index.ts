import { EmailParser } from './email-parser';

export class EmailReplyParser {
  read(text: string) {
    return new EmailParser().parse(text);
  }

  parseReply(text: string) {
    return this.read(text).getVisibleText();
  }

  parseReplied(text: string) {
    return this.read(text).getQuotedText();
  }
}
