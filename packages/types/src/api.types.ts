import type { IsoDateString } from "./common.types";
import type { PaginationMeta } from "./pagination.types";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_FAILED"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  statusCode: number;
  message: string;
  data: TData;
  meta?: PaginationMeta;
  timestamp: IsoDateString;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: ErrorCode;
  message: string;
  details: ApiErrorDetail[];
  timestamp: IsoDateString;
}

export type ApiResponseBody<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
