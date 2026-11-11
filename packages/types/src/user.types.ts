import type { Uuid } from "./common.types";

export type UserRole = "admin" | "member";

export interface User {
  id: Uuid;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  fullName: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}
