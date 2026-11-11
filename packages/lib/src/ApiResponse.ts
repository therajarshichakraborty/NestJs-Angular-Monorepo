import type { ApiSuccessResponse, PaginatedResult, PaginationMeta } from "@repo/types";

import { HTTP_STATUS } from "./constant";

export class ApiResponse<TData> {
  public readonly success = true;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: TData;
  public readonly meta: PaginationMeta | undefined;
  public readonly timestamp: string;

  public constructor(statusCode: number, message: string, data: TData, meta?: PaginationMeta) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  public static ok<TData>(data: TData, message = "Request completed successfully"): ApiResponse<TData> {
    return new ApiResponse(HTTP_STATUS.OK, message, data);
  }

  public static created<TData>(data: TData, message = "Resource created successfully"): ApiResponse<TData> {
    return new ApiResponse(HTTP_STATUS.CREATED, message, data);
  }

  public static paginated<TItem>(
    result: PaginatedResult<TItem>,
    message = "Request completed successfully",
  ): ApiResponse<TItem[]> {
    return new ApiResponse(HTTP_STATUS.OK, message, result.items, result.meta);
  }

  public toJSON(): ApiSuccessResponse<TData> {
    const body: ApiSuccessResponse<TData> = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    };

    if (this.meta) {
      body.meta = this.meta;
    }

    return body;
  }
}

export function createPaginationMeta(page: number, limit: number, totalItems: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
