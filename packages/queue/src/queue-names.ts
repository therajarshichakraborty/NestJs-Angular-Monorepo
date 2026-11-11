export const QUEUE_NAMES = {
  USER_CREATED: "user.created",
  EMAIL_SEND: "email.send",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const DEAD_LETTER_SUFFIX = ".dead-letter";

export function toDeadLetterQueueName(queueName: string): string {
  return `${queueName}${DEAD_LETTER_SUFFIX}`;
}
