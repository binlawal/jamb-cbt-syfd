import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';

export async function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  request.log.error({
    error: {
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
    },
    request: {
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
    },
  });

  // Handle known application errors
  if (error instanceof AppError) {
    return errorResponse(
      reply,
      error.statusCode,
      error.code,
      error.message,
      error.details
    );
  }

  // Handle Fastify validation errors
  if (error.validation) {
    return errorResponse(
      reply,
      400,
      'VALIDATION_ERROR',
      'Validation failed',
      { validation: error.validation }
    );
  }

  // Handle database errors
  if ((error as any).code?.startsWith('23')) {
    const pgError = error as any;
    
    // Unique constraint violation
    if (pgError.code === '23505') {
      return errorResponse(
        reply,
        409,
        'CONFLICT',
        'Resource already exists',
        { constraint: pgError.constraint }
      );
    }
    
    // Foreign key violation
    if (pgError.code === '23503') {
      return errorResponse(
        reply,
        400,
        'VALIDATION_ERROR',
        'Referenced resource does not exist',
        { constraint: pgError.constraint }
      );
    }
  }

  // Handle unknown errors
  return errorResponse(
    reply,
    error.statusCode || 500,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message
  );
}
