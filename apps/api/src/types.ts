import type { ReadableStream } from 'web-streams-polyfill';

/**
 * An email message that can be sent from a Worker.
 */
export interface EmailMessage {
  /**
   * Envelope From attribute of the email message.
   */
  readonly from: string;
  /**
   * Envelope To attribute of the email message.
   */
  readonly to: string;
}
/**
 * An email message that is sent to a consumer Worker and can be rejected/forwarded.
 */
export interface ForwardableEmailMessage extends EmailMessage {
  /**
   * Stream of the email message content.
   */
  readonly raw: ReadableStream<Uint8Array>;
  /**
   * An [Headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers).
   */
  readonly headers: Headers;
  /**
   * Size of the email message content.
   */
  readonly rawSize: number;
  /**
   * Reject this email message by returning a permanent SMTP error back to the connecting client including the given reason.
   * @param reason The reject reason.
   * @returns void
   */
  setReject(reason: string): void;
  /**
   * Forward this email message to a verified destination address of the account.
   * @param rcptTo Verified destination address.
   * @param headers A [Headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers).
   * @returns A promise that resolves when the email message is forwarded.
   */
  forward(rcptTo: string, headers?: Headers): Promise<void>;
}