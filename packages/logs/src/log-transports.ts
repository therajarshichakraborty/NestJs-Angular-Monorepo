import path from "node:path";

import type { LogLevel } from "@repo/types";
import { format, transports } from "winston";
import type { Logform } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { HTTP_LOG_KINDS, LOG_CATEGORIES } from "./log-categories";
import type { LogCategory } from "./log-categories";
import {
  createConsoleFormat,
  createFileFormat,
  keepOnlyWhen,
  readOriginalLevel,
} from "./log-formats";

const LOG_FILE_DATE_PATTERN = "YYYY-MM-DD";
const LOG_FILE_MAXIMUM_SIZE = "20m";
const LOG_FILE_RETENTION = "14d";

interface RotatingFileTransportOptions {
  directory: string;
  service: string;
  category: LogCategory;
  level: LogLevel;
  filter?: (info: Logform.TransformableInfo) => boolean;
  handleExceptions?: boolean;
}

export interface FileTransportsOptions {
  directory: string;
  service: string;
  level: LogLevel;
}

function createRotatingFileTransport(options: RotatingFileTransportOptions): DailyRotateFile {
  const categoryDirectory = path.join(options.directory, options.category);
  const fileFormat = options.filter
    ? format.combine(keepOnlyWhen(options.filter), createFileFormat())
    : createFileFormat();

  return new DailyRotateFile({
    level: options.level,
    dirname: categoryDirectory,
    filename: `${options.service}-%DATE%.log`,
    auditFile: path.join(categoryDirectory, `.${options.service}-audit.json`),
    datePattern: LOG_FILE_DATE_PATTERN,
    maxSize: LOG_FILE_MAXIMUM_SIZE,
    maxFiles: LOG_FILE_RETENTION,
    zippedArchive: true,
    format: fileFormat,
    handleExceptions: options.handleExceptions ?? false,
    handleRejections: options.handleExceptions ?? false,
  });
}

export function createFileTransports(options: FileTransportsOptions): DailyRotateFile[] {
  return [
    createRotatingFileTransport({
      directory: options.directory,
      service: options.service,
      category: LOG_CATEGORIES.COMBINED,
      level: options.level,
    }),
    createRotatingFileTransport({
      directory: options.directory,
      service: options.service,
      category: LOG_CATEGORIES.ERRORS,
      level: "error",
      handleExceptions: true,
    }),
    createRotatingFileTransport({
      directory: options.directory,
      service: options.service,
      category: LOG_CATEGORIES.WARNINGS,
      level: "warn",
      filter: (info) => readOriginalLevel(info) === "warn",
    }),
    createRotatingFileTransport({
      directory: options.directory,
      service: options.service,
      category: LOG_CATEGORIES.REQUESTS,
      level: "http",
      filter: (info) => info.kind === HTTP_LOG_KINDS.REQUEST,
    }),
    createRotatingFileTransport({
      directory: options.directory,
      service: options.service,
      category: LOG_CATEGORIES.RESPONSES,
      level: "http",
      filter: (info) => info.kind === HTTP_LOG_KINDS.RESPONSE,
    }),
  ];
}

export function createConsoleTransport(level: LogLevel): transports.ConsoleTransportInstance {
  return new transports.Console({
    level,
    format: createConsoleFormat(),
    handleExceptions: true,
    handleRejections: true,
  });
}
