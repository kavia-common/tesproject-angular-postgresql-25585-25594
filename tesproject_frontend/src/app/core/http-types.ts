import { HttpErrorResponse } from '@angular/common/http';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * PUBLIC_INTERFACE
 * Convert Angular HttpErrorResponse into a consistent ApiError.
 */
export function toApiError(err: unknown): ApiError {
  if (err instanceof HttpErrorResponse) {
    const message =
      (typeof err.error === 'string' && err.error) ||
      (err.error && typeof err.error === 'object' && 'message' in err.error ? String((err.error as { message?: unknown }).message) : '') ||
      err.message ||
      'Request failed';

    return {
      message,
      status: err.status,
      details: err.error,
    };
  }

  if (err && typeof err === 'object' && 'message' in err) {
    return { message: String((err as { message?: unknown }).message ?? 'Request failed') };
  }

  return { message: 'Request failed' };
}
