export const LOG_CATEGORIES = {
  COMBINED: "combined",
  ERRORS: "errors",
  WARNINGS: "warnings",
  REQUESTS: "requests",
  RESPONSES: "responses",
} as const;

export type LogCategory = (typeof LOG_CATEGORIES)[keyof typeof LOG_CATEGORIES];

export const HTTP_LOG_KINDS = {
  REQUEST: "request",
  RESPONSE: "response",
} as const;

export type HttpLogKind = (typeof HTTP_LOG_KINDS)[keyof typeof HTTP_LOG_KINDS];
