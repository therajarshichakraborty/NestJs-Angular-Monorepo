import { z } from "zod";

import { DEFAULT_DATABASE_URL, DEFAULT_RABBITMQ_URL, ENVIRONMENTS, LOG_LEVELS } from "./constant";

const environmentSchema = z.object({
  NODE_ENV: z.enum(ENVIRONMENTS).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  SERVICE_NAME: z.string().trim().min(1).default("app"),
  LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
  LOG_DIR: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  DATABASE_URL: z.url().default(DEFAULT_DATABASE_URL),
  RABBITMQ_URL: z.url().default(DEFAULT_RABBITMQ_URL),
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>;

let cachedEnvironmentVariables: EnvironmentVariables | undefined;

export function parseEnvironment(source: NodeJS.ProcessEnv): EnvironmentVariables {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment variables:\n${problems}`);
  }

  return result.data;
}

export function getEnvironment(): EnvironmentVariables {
  cachedEnvironmentVariables ??= parseEnvironment(process.env);
  return cachedEnvironmentVariables;
}

export function isProduction(): boolean {
  return getEnvironment().NODE_ENV === "production";
}
