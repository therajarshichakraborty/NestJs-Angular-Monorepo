import type { HttpRequestLog, HttpResponseLog, LogContext } from "@repo/types";
import type { Logger as WinstonLogger } from "winston";

import { HTTP_LOG_KINDS } from "./log-categories";

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };
  }

  if (error === undefined) {
    return {};
  }

  return { error };
}

export class AppLogger {
  private readonly winstonLogger: WinstonLogger;

  public constructor(winstonLogger: WinstonLogger) {
    this.winstonLogger = winstonLogger;
  }

  public error(message: string, error?: unknown, context: LogContext = {}): void {
    this.winstonLogger.error(message, { ...context, ...serializeError(error) });
  }

  public warn(message: string, context: LogContext = {}): void {
    this.winstonLogger.warn(message, context);
  }

  public info(message: string, context: LogContext = {}): void {
    this.winstonLogger.info(message, context);
  }

  public debug(message: string, context: LogContext = {}): void {
    this.winstonLogger.debug(message, context);
  }

  public verbose(message: string, context: LogContext = {}): void {
    this.winstonLogger.verbose(message, context);
  }

  public request(details: HttpRequestLog): void {
    this.winstonLogger.http(`--> ${details.method} ${details.url}`, {
      kind: HTTP_LOG_KINDS.REQUEST,
      ...details,
    });
  }

  public response(details: HttpResponseLog): void {
    this.winstonLogger.http(
      `<-- ${details.method} ${details.url} ${details.statusCode} ${details.durationInMilliseconds}ms`,
      {
        kind: HTTP_LOG_KINDS.RESPONSE,
        ...details,
      },
    );
  }

  public child(context: LogContext): AppLogger {
    return new AppLogger(this.winstonLogger.child(context));
  }

  public async close(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.winstonLogger.on("finish", () => resolve());
      this.winstonLogger.end();
    });
  }
}
