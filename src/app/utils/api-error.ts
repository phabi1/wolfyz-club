import { HttpErrorResponse } from '@angular/common/http';

/**
 * Human readable message for an API error. Validation errors (422) of the
 * auth server's API carry one message per field in `error.errors`.
 */
export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    if (body && typeof body === 'object') {
      if (body.errors && typeof body.errors === 'object') {
        return Object.values(body.errors as Record<string, string>).join(' ');
      }
      if (typeof body.message === 'string' && body.message) {
        return body.message;
      }
    }
    if (error.status === 0) {
      return $localize`:@@common.error.network:The server cannot be reached.`;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error ?? '');
}
