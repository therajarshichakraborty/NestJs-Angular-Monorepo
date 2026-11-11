import { createServiceLogger } from "@repo/lib";
import type { Kysely } from "kysely";
import { Migrator } from "kysely/migration";
import type { MigrationResultSet } from "kysely/migration";

import { migrations } from "./migrations";
import type { Database } from "./schema";

const migrationLogger = createServiceLogger("migrator");

function createMigrator(database: Kysely<Database>): Migrator {
  return new Migrator({
    db: database,
    provider: {
      getMigrations: () => Promise.resolve(migrations),
    },
  });
}

function reportMigrationResults(resultSet: MigrationResultSet): void {
  for (const result of resultSet.results ?? []) {
    if (result.status === "Success") {
      migrationLogger.info(
        `Migration "${result.migrationName}" ${result.direction.toLowerCase()} succeeded`,
      );
    } else if (result.status === "Error") {
      migrationLogger.error(
        `Migration "${result.migrationName}" ${result.direction.toLowerCase()} failed`,
      );
    }
  }

  if (resultSet.error) {
    throw resultSet.error instanceof Error
      ? resultSet.error
      : new Error("Database migration failed", { cause: resultSet.error });
  }
}

export async function migrateToLatest(database: Kysely<Database>): Promise<void> {
  const resultSet = await createMigrator(database).migrateToLatest();

  if (resultSet.results?.length === 0) {
    migrationLogger.info("Database schema is already up to date");
  }

  reportMigrationResults(resultSet);
}

export async function rollbackLastMigration(database: Kysely<Database>): Promise<void> {
  const resultSet = await createMigrator(database).migrateDown();

  if (resultSet.results?.length === 0) {
    migrationLogger.info("There are no migrations to roll back");
  }

  reportMigrationResults(resultSet);
}
