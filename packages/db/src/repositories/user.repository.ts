import { createPaginationMeta } from "@repo/lib";
import type {
  PaginatedResult,
  PaginationQuery,
  UpdateUserInput,
  User,
  UserRole,
} from "@repo/types";
import type { Kysely } from "kysely";

import { mapUserRowToUser } from "../mappers/user.mapper";
import type { Database, UserRow, UserRowUpdate } from "../schema";

export interface CreateUserRecord {
  email: string;
  fullName: string;
  passwordHash: string;
  role?: UserRole;
}

export class UserRepository {
  private readonly database: Kysely<Database>;

  public constructor(database: Kysely<Database>) {
    this.database = database;
  }

  public async findById(userId: string): Promise<User | undefined> {
    const row = await this.database
      .selectFrom("users")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();
    return row ? mapUserRowToUser(row) : undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const row = await this.database
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
    return row ? mapUserRowToUser(row) : undefined;
  }

  public async findRowByEmail(email: string): Promise<UserRow | undefined> {
    return this.database
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }

  public async findMany(pagination: PaginationQuery): Promise<PaginatedResult<User>> {
    const offset = (pagination.page - 1) * pagination.limit;

    const rows = await this.database
      .selectFrom("users")
      .selectAll()
      .orderBy("created_at", "desc")
      .limit(pagination.limit)
      .offset(offset)
      .execute();

    const countResult = await this.database
      .selectFrom("users")
      .select((expressionBuilder) => expressionBuilder.fn.countAll<string>().as("total"))
      .executeTakeFirstOrThrow();

    return {
      items: rows.map(mapUserRowToUser),
      meta: createPaginationMeta(pagination.page, pagination.limit, Number(countResult.total)),
    };
  }

  public async create(record: CreateUserRecord): Promise<User> {
    const row = await this.database
      .insertInto("users")
      .values({
        email: record.email,
        full_name: record.fullName,
        password_hash: record.passwordHash,
        role: record.role,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return mapUserRowToUser(row);
  }

  public async update(userId: string, changes: UpdateUserInput): Promise<User | undefined> {
    const rowChanges: UserRowUpdate = { updated_at: new Date() };

    if (changes.fullName !== undefined) {
      rowChanges.full_name = changes.fullName;
    }

    if (changes.role !== undefined) {
      rowChanges.role = changes.role;
    }

    if (changes.isActive !== undefined) {
      rowChanges.is_active = changes.isActive;
    }

    const row = await this.database
      .updateTable("users")
      .set(rowChanges)
      .where("id", "=", userId)
      .returningAll()
      .executeTakeFirst();

    return row ? mapUserRowToUser(row) : undefined;
  }

  public async delete(userId: string): Promise<boolean> {
    const result = await this.database
      .deleteFrom("users")
      .where("id", "=", userId)
      .executeTakeFirst();
    return result.numDeletedRows > 0n;
  }
}
