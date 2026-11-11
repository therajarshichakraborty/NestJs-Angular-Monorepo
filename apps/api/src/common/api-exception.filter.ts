import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ApiError, ERROR_CODES, HTTP_STATUS, logger } from "@repo/lib";
import type { ApiErrorResponse, ErrorCode } from "@repo/types";
import type { Request, Response } from "express";

const ERROR_CODE_BY_STATUS: Record<number, ErrorCode> = {
  [HTTP_STATUS.BAD_REQUEST]: ERROR_CODES.BAD_REQUEST,
  [HTTP_STATUS.UNAUTHORIZED]: ERROR_CODES.UNAUTHORIZED,
  [HTTP_STATUS.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
  [HTTP_STATUS.CONFLICT]: ERROR_CODES.CONFLICT,
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: ERROR_CODES.VALIDATION_FAILED,
  [HTTP_STATUS.TOO_MANY_REQUESTS]: ERROR_CODES.TOO_MANY_REQUESTS,
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: ERROR_CODES.SERVICE_UNAVAILABLE,
};

function convertToApiError(exception: unknown): ApiError {
  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();

    return new ApiError({
      statusCode,
      code: ERROR_CODE_BY_STATUS[statusCode] ?? ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: exception.message,
      cause: exception,
    });
  }

  return ApiError.fromUnknown(exception);
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const apiError = convertToApiError(exception);

    if (apiError.isServerError()) {
      logger.error(apiError.message, apiError.cause ?? apiError, {
        method: request.method,
        url: request.originalUrl,
      });
    } else {
      logger.warn(apiError.message, {
        method: request.method,
        url: request.originalUrl,
        statusCode: apiError.statusCode,
      });
    }

    const body: ApiErrorResponse = apiError.toResponseBody();
    response.status(apiError.statusCode).json(body);
  }
}
