import { randomUUID } from "node:crypto";

import { Injectable, NestMiddleware } from "@nestjs/common";
import { REQUEST_ID_HEADER, logger } from "@repo/lib";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();
    const incomingRequestId = request.header(REQUEST_ID_HEADER);
    const requestId = incomingRequestId ?? randomUUID();

    response.setHeader(REQUEST_ID_HEADER, requestId);

    logger.request({
      requestId,
      method: request.method,
      url: request.originalUrl,
      ipAddress: request.ip,
      userAgent: request.header("user-agent"),
    });

    response.on("finish", () => {
      const elapsedNanoseconds = process.hrtime.bigint() - startedAt;

      logger.response({
        requestId,
        method: request.method,
        url: request.originalUrl,
        statusCode: response.statusCode,
        durationInMilliseconds: Number(elapsedNanoseconds / 1_000_000n),
      });
    });

    next();
  }
}
