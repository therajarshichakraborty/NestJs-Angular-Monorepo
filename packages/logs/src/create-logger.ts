import type { LogLevel } from "@repo/types";
import { createLogger as createWinstonLogger } from "winston";

import { AppLogger } from "./app-logger";
import { ensureLogDirectories, resolveLogDirectory } from "./log-directory";
import { createConsoleTransport, createFileTransports } from "./log-transports";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export interface CreateLoggerOptions {
  service: string;
  level?: LogLevel;
  directory?: string;
  enableConsole?: boolean;
  enableFiles?: boolean;
}

function pickMostVerboseLevel(firstLevel: LogLevel, secondLevel: LogLevel): LogLevel {
  return LOG_LEVEL_PRIORITY[firstLevel] >= LOG_LEVEL_PRIORITY[secondLevel] ? firstLevel : secondLevel;
}

export function createLogger(options: CreateLoggerOptions): AppLogger {
  const level = options.level ?? "info";
  const enableConsole = options.enableConsole ?? true;
  const enableFiles = options.enableFiles ?? true;
  const logDirectory = resolveLogDirectory(options.directory);

  const transports = [];

  if (enableFiles) {
    ensureLogDirectories(logDirectory);
    transports.push(...createFileTransports({ directory: logDirectory, service: options.service, level }));
  }

  if (enableConsole) {
    transports.push(createConsoleTransport(level));
  }

  const winstonLogger = createWinstonLogger({
    level: pickMostVerboseLevel(level, "http"),
    defaultMeta: { service: options.service },
    transports,
    exitOnError: false,
  });

  return new AppLogger(winstonLogger);
}
