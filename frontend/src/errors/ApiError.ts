/**
 * Base API Error class with additional context and metadata
 */
export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly isRetryable: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode?: number,
    isRetryable = false,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // @ts-expect-error - captureStackTrace is a V8-specific feature
    if (typeof Error.captureStackTrace === 'function') {
      // @ts-expect-error - captureStackTrace is a V8-specific feature
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a user-friendly error message
   */
  public getUserMessage(): string {
    return this.message;
  }

  /**
   * Returns a detailed error object for logging
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isRetryable: this.isRetryable,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors (connection failures, timeouts)
 */
export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred', context?: Record<string, unknown>) {
    super(message, undefined, true, context);
    this.name = 'NetworkError';
  }

  public getUserMessage(): string {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
}

/**
 * Validation errors (400 Bad Request)
 */
export class ValidationError extends ApiError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message = 'Validation failed',
    validationErrors?: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, 400, false, context);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }

  public getUserMessage(): string {
    if (this.validationErrors) {
      const errors = Object.entries(this.validationErrors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return `Validation failed: ${errors}`;
    }
    return this.message;
  }
}

/**
 * Resource not found errors (404 Not Found)
 */
export class NotFoundError extends ApiError {
  public readonly resourceType?: string;
  public readonly resourceId?: string;

  constructor(
    message = 'Resource not found',
    resourceType?: string,
    resourceId?: string,
    context?: Record<string, unknown>
  ) {
    super(message, 404, false, context);
    this.name = 'NotFoundError';
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  public getUserMessage(): string {
    if (this.resourceType) {
      return `${this.resourceType} not found${this.resourceId ? ` (ID: ${this.resourceId})` : ''}`;
    }
    return this.message;
  }
}

/**
 * Authentication/Authorization errors (401 Unauthorized, 403 Forbidden)
 */
export class UnauthorizedError extends ApiError {
  constructor(
    message = 'Unauthorized access',
    statusCode: 401 | 403 = 401,
    context?: Record<string, unknown>
  ) {
    super(message, statusCode, false, context);
    this.name = 'UnauthorizedError';
  }

  public getUserMessage(): string {
    if (this.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }
    return 'Authentication required. Please log in and try again.';
  }
}

/**
 * Server errors (500+ status codes)
 */
export class ServerError extends ApiError {
  constructor(
    message = 'Server error occurred',
    statusCode = 500,
    context?: Record<string, unknown>
  ) {
    super(message, statusCode, true, context);
    this.name = 'ServerError';
  }

  public getUserMessage(): string {
    return 'An unexpected server error occurred. Please try again later.';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends ApiError {
  constructor(message = 'Request timeout', context?: Record<string, unknown>) {
    super(message, 408, true, context);
    this.name = 'TimeoutError';
  }

  public getUserMessage(): string {
    return 'The request took too long to complete. Please try again.';
  }
}

/**
 * Factory function to create appropriate error from HTTP response
 */
export function createApiError(
  statusCode: number,
  message: string,
  data?: unknown,
  context?: Record<string, unknown>
): ApiError {
  switch (statusCode) {
    case 400:
      return new ValidationError(message, undefined, context);
    case 401:
    case 403:
      return new UnauthorizedError(message, statusCode as 401 | 403, context);
    case 404:
      return new NotFoundError(message, undefined, undefined, context);
    case 408:
      return new TimeoutError(message, context);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, statusCode, context);
    default:
      if (statusCode >= 500) {
        return new ServerError(message, statusCode, context);
      }
      return new ApiError(message, statusCode, false, context);
  }
}
