import type { UserRole } from "@repo/types";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type CreatedAtColumn = ColumnType<Date, never, never>;

export type UpdatedAtColumn = ColumnType<Date, never, Date>;

export interface UsersTable {
  id: Generated<string>;
  email: string;
  full_name: string;
  password_hash: string;
  role: ColumnType<UserRole, UserRole | undefined, UserRole>;
  is_active: ColumnType<boolean, boolean | undefined, boolean>;
  created_at: CreatedAtColumn;
  updated_at: UpdatedAtColumn;
}

export interface Database {
  users: UsersTable;
}

export type UserRow = Selectable<UsersTable>;

export type NewUserRow = Insertable<UsersTable>;

export type UserRowUpdate = Updateable<UsersTable>;
