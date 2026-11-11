import { createLogger } from "@repo/logs";
import type { AppLogger } from "@repo/logs";

import { getEnvironment } from "./env";

const environment = getEnvironment();

export const logger: AppLogger = createLogger({
  service: environment.SERVICE_NAME,
  level: environment.LOG_LEVEL,
  directory: environment.LOG_DIR,
  enableConsole: environment.NODE_ENV !== "test",
});

export function createServiceLogger(serviceName: string): AppLogger {
  return logger.child({ component: serviceName });
}
