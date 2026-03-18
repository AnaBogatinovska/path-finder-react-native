export type AppErrorCode =
  | 'NETWORK_UNAVAILABLE'
  | 'LOCATION_PERMISSION_DENIED'
  | 'LOCATION_PERMISSION_BLOCKED'
  | 'LOCATION_UNAVAILABLE'
  | 'ROUTE_NOT_FOUND'
  | 'UNKNOWN'

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
