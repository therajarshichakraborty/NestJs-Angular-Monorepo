import { sql } from "kysely";
import type { Kysely } from "kysely";
import type { Migration } from "kysely/migration";

export const createUsersTableMigration: Migration = {
  async up(database: Kysely<unknown>): Promise<void> {
    await database.schema
      .createTable("users")
      .addColumn("id", "uuid", (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
      .addColumn("email", "varchar(320)", (column) => column.notNull().unique())
      .addColumn("full_name", "varchar(120)", (column) => column.notNull())
      .addColumn("password_hash", "text", (column) => column.notNull())
      .addColumn("role", "varchar(20)", (column) =>
        column
          .notNull()
          .defaultTo("member")
          .check(sql`role in ('admin', 'member')`),
      )
      .addColumn("is_active", "boolean", (column) => column.notNull().defaultTo(true))
      .addColumn("created_at", "timestamptz", (column) => column.notNull().defaultTo(sql`now()`))
      .addColumn("updated_at", "timestamptz", (column) => column.notNull().defaultTo(sql`now()`))
      .execute();

    await database.schema
      .createIndex("users_created_at_index")
      .on("users")
      .column("created_at")
      .execute();
  },

  async down(database: Kysely<unknown>): Promise<void> {
    await database.schema.dropTable("users").ifExists().execute();
  },
};
