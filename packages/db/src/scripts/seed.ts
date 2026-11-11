import { getEnvironment, hashPassword, logger } from "@repo/lib";
import type { UserRole } from "@repo/types";

import { createDatabase } from "../client";

interface DemoUser {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
}

const DEMO_USERS: DemoUser[] = [
  { email: "admin@example.com", fullName: "Demo Admin", password: "admin-password", role: "admin" },
  {
    email: "member@example.com",
    fullName: "Demo Member",
    password: "member-password",
    role: "member",
  },
];

async function seedDemoUsers(): Promise<void> {
  const database = createDatabase({ connectionString: getEnvironment().DATABASE_URL });

  try {
    for (const demoUser of DEMO_USERS) {
      await database
        .insertInto("users")
        .values({
          email: demoUser.email,
          full_name: demoUser.fullName,
          password_hash: await hashPassword(demoUser.password),
          role: demoUser.role,
        })
        .onConflict((conflict) => conflict.column("email").doNothing())
        .execute();

      logger.info(`Seeded demo user ${demoUser.email}`);
    }
  } finally {
    await database.destroy();
  }
}

seedDemoUsers().catch((error: unknown) => {
  logger.error("Seeding demo users failed", error);
  process.exitCode = 1;
});
