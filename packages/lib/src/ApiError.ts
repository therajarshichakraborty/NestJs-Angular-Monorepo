import type { ApiErrorDetail, ApiErrorResponse, ErrorCode } from "@repo/types";

import { ERROR_CODES, HTTP_STATUS } from "./constant";

export interface ApiErrorOptions {
  statusCode: number;
  code: ErrorCode;
  message: string;
  details?: ApiErrorDetail[];
  cause?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details: ApiErrorDetail[];

  public constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "ApiError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details ?? [];
  }

  public static badRequest(message: string, details?: ApiErrorDetail[]): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.BAD_REQUEST, code: ERROR_CODES.BAD_REQUEST, message, details });
  }

  public static unauthorized(message = "Authentication is required"): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.UNAUTHORIZED, code: ERROR_CODES.UNAUTHORIZED, message });
  }

  public static forbidden(message = "You do not have permission to perform this action"): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.FORBIDDEN, code: ERROR_CODES.FORBIDDEN, message });
  }

  public static notFound(message = "The requested resource was not found"): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.NOT_FOUND, code: ERROR_CODES.NOT_FOUND, message });
  }

  public static conflict(message: string): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.CONFLICT, code: ERROR_CODES.CONFLICT, message });
  }

  public static validationFailed(details: ApiErrorDetail[], message = "Validation failed"): ApiError {
    return new ApiError({
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      code: ERROR_CODES.VALIDATION_FAILED,
      message,
      details,
    });
  }

  public static tooManyRequests(message = "Too many requests, please try again later"): ApiError {
    return new ApiError({ statusCode: HTTP_STATUS.TOO_MANY_REQUESTS, code: ERROR_CODES.TOO_MANY_REQUESTS, message });
  }

  public static internal(message = "Something went wrong on our side", cause?: unknown): ApiError {
    return new ApiError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message,
      cause,
    });
  }

  public static serviceUnavailable(message = "The service is temporarily unavailable"): ApiError {
    return new ApiError({
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      code: ERROR_CODES.SERVICE_UNAVAILABLE,
      message,
    });
  }

  public static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }

  public static fromUnknown(error: unknown): ApiError {
    if (ApiError.isApiError(error)) {
      return error;
    }

    return ApiError.internal(undefined, error);
  }

  public isServerError(): boolean {
    return this.statusCode >= 500;
  }

  public toResponseBody(): ApiErrorResponse {
    return {
      success: false,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}
