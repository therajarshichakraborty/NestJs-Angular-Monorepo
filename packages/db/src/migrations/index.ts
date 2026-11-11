import type { Migration } from "kysely/migration";

import { createUsersTableMigration } from "./0001-create-users-table";

export const migrations: Record<string, Migration> = {
  "0001-create-users-table": createUsersTableMigration,
};
