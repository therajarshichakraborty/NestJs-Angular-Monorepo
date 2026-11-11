import { format } from "winston";
import type { Logform } from "winston";

const LEVEL_SYMBOL = Symbol.for("level");

export function readOriginalLevel(info: Logform.TransformableInfo): string {
  const originalLevel = (info as Record<symbol, unknown>)[LEVEL_SYMBOL];
  return typeof originalLevel === "string" ? originalLevel : info.level;
}

export function keepOnlyWhen(
  predicate: (info: Logform.TransformableInfo) => boolean,
): Logform.Format {
  const filterFormat = format((info) => (predicate(info) ? info : false));
  return filterFormat();
}

export function createFileFormat(): Logform.Format {
  return format.combine(format.timestamp(), format.json());
}

export function createConsoleFormat(): Logform.Format {
  return format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => {
      const { timestamp, level, message, service, ...metadata } = info;
      const metadataText = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";

      return `${String(timestamp)} [${String(service)}] ${level}: ${String(message)}${metadataText}`;
    }),
  );
}
