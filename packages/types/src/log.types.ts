export type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";

export type LogContext = Record<string, unknown>;

export interface HttpRequestLog {
  requestId: string;
  method: string;
  url: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface HttpResponseLog {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  durationInMilliseconds: number;
}
