import { NextResponse } from 'next/server';

/**
 * Standard API Error Codes
 */
export const ApiErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};

/**
 * Creates a standardized success response envelope.
 * 
 * @param {any} data - The payload data
 * @param {object} meta - Optional metadata (pagination, counts, version)
 * @param {number} status - HTTP status code (default: 200)
 */
export function apiSuccess(data, meta = {}, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      ...meta,
    },
  }, { status });
}

/**
 * Creates a standardized error response envelope.
 * 
 * @param {string} code - Error code from ApiErrorCode
 * @param {string} message - User-friendly error message
 * @param {any} details - Additional contextual error details or validation issues
 * @param {number} status - HTTP status code (default: 400)
 */
export function apiError(code = ApiErrorCode.BAD_REQUEST, message = 'Request failed', details = null, status = 400) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  }, { status });
}

export function apiUnauthorized(message = 'Authentication required to perform this action') {
  return apiError(ApiErrorCode.UNAUTHORIZED, message, null, 401);
}

export function apiForbidden(message = 'Insufficient permissions to perform this action') {
  return apiError(ApiErrorCode.FORBIDDEN, message, null, 403);
}

export function apiNotFound(resource = 'Resource') {
  return apiError(ApiErrorCode.NOT_FOUND, `${resource} not found`, null, 404);
}

export function apiValidationError(details, message = 'Validation failed') {
  return apiError(ApiErrorCode.VALIDATION_ERROR, message, details, 422);
}

export function apiInternalError(message = 'An unexpected internal error occurred') {
  return apiError(ApiErrorCode.INTERNAL_ERROR, message, null, 500);
}
