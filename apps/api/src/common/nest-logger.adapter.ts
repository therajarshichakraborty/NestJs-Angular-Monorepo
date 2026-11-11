import { LoggerService } from '@nestjs/common';
import type { AppLogger } from '@repo/logs';

export class NestLoggerAdapter implements LoggerService {
  constructor(private readonly appLogger: AppLogger) {}

  log(message: unknown, context?: string): void {
    this.appLogger.info(String(message), { context });
  }

  error(message: unknown, stackOrContext?: string, context?: string): void {
    this.appLogger.error(String(message), undefined, {
      context: context ?? stackOrContext,
      stack: context ? stackOrContext : undefined,
    });
  }

  warn(message: unknown, context?: string): void {
    this.appLogger.warn(String(message), { context });
  }

  debug(message: unknown, context?: string): void {
    this.appLogger.debug(String(message), { context });
  }

  verbose(message: unknown, context?: string): void {
    this.appLogger.verbose(String(message), { context });
  }
}
