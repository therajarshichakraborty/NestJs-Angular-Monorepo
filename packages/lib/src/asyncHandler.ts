export type NextFunction = (error?: unknown) => void;

export type AsyncRequestHandler<TRequest, TResponse> = (
  request: TRequest,
  response: TResponse,
  next: NextFunction,
) => Promise<unknown>;

export type RequestHandler<TRequest, TResponse> = (
  request: TRequest,
  response: TResponse,
  next: NextFunction,
) => void;

export function asyncHandler<TRequest, TResponse>(
  handler: AsyncRequestHandler<TRequest, TResponse>,
): RequestHandler<TRequest, TResponse> {
  return (request, response, next) => {
    handler(request, response, next).catch(next);
  };
}

export async function tryCatch<TResult>(
  operation: () => Promise<TResult>,
): Promise<[TResult, null] | [null, Error]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    return [null, normalizedError];
  }
}
