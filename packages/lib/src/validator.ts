import type { ApiErrorDetail, PaginationQuery, UserRole } from "@repo/types";
import { z } from "zod";

import { ApiError } from "./ApiError";
import { PAGINATION_DEFAULTS } from "./constant";

export const uuidSchema = z.uuid();

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be at most 128 characters long");

export const userRoleSchema = z.enum(["admin", "member"] as const satisfies readonly UserRole[]);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION_DEFAULTS.PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION_DEFAULTS.MAXIMUM_LIMIT).default(PAGINATION_DEFAULTS.LIMIT),
}) satisfies z.ZodType<PaginationQuery>;

export const createUserSchema = z.object({
  email: emailSchema,
  fullName: z.string().trim().min(2).max(120),
  password: passwordSchema,
  role: userRoleSchema.optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

export function formatValidationIssues(error: z.ZodError): ApiErrorDetail[] {
  return error.issues.map((issue) => {
    const field = issue.path.join(".");
    return field.length > 0 ? { field, message: issue.message } : { message: issue.message };
  });
}

export function validate<TSchema extends z.ZodType>(schema: TSchema, input: unknown): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw ApiError.validationFailed(formatValidationIssues(result.error));
  }

  return result.data;
}
