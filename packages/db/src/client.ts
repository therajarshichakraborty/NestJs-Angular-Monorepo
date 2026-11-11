import { createServiceLogger } from "@repo/lib";
import { Kysely, PostgresDialect } from "kysely";
import type { LogEvent } from "kysely";
import { Pool } from "pg";

import type { Database } from "./schema";

const databaseLogger = createServiceLogger("database");

export interface DatabaseOptions {
  connectionString: string;
  maximumConnections?: number;
  logQueries?: boolean;
}

function logDatabaseEvent(event: LogEvent, logQueries: boolean): void {
  if (event.level === "error") {
    databaseLogger.error("Database query failed", event.error, {
      sql: event.query.sql,
      durationInMilliseconds: event.queryDurationMillis,
    });
    return;
  }

  if (logQueries) {
    databaseLogger.debug("Database query executed", {
      sql: event.query.sql,
      durationInMilliseconds: event.queryDurationMillis,
    });
  }
}

export function createDatabase(options: DatabaseOptions): Kysely<Database> {
  const pool = new Pool({
    connectionString: options.connectionString,
    max: options.maximumConnections ?? 10,
  });

  pool.on("error", (error) => {
    databaseLogger.error("Idle PostgreSQL client raised an error", error);
  });

  const logQueries = options.logQueries ?? false;

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
    log: (event) => logDatabaseEvent(event, logQueries),
  });
}
