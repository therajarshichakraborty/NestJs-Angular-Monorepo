import { getEnvironment, logger } from "@repo/lib";

import { createDatabase } from "../client";
import { migrateToLatest, rollbackLastMigration } from "../migrator";

const SUPPORTED_COMMANDS = ["latest", "rollback"] as const;

type MigrationCommand = (typeof SUPPORTED_COMMANDS)[number];

function readCommand(): MigrationCommand {
  const command = process.argv[2] ?? "latest";

  if (!SUPPORTED_COMMANDS.includes(command as MigrationCommand)) {
    throw new Error(
      `Unknown migration command "${command}". Use one of: ${SUPPORTED_COMMANDS.join(", ")}`,
    );
  }

  return command as MigrationCommand;
}

async function runMigrations(): Promise<void> {
  const command = readCommand();
  const database = createDatabase({ connectionString: getEnvironment().DATABASE_URL });

  try {
    if (command === "latest") {
      await migrateToLatest(database);
    } else {
      await rollbackLastMigration(database);
    }
  } finally {
    await database.destroy();
  }
}

runMigrations()
  .then(() => logger.info("Migration command finished"))
  .catch((error: unknown) => {
    logger.error("Migration command failed", error);
    process.exitCode = 1;
  });
