import { FastifyReply } from 'fastify';
import { ApiResponse, PaginatedResponse } from '@jamb-cbt/shared';

export function successResponse<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200
): FastifyReply {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return reply.code(statusCode).send(response);
}

export function paginatedResponse<T>(
  reply: FastifyReply,
  data: T[],
  page: number,
  limit: number,
  total: number
): FastifyReply {
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return reply.code(200).send(response);
}

export function errorResponse(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, any>
): FastifyReply {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return reply.code(statusCode).send(response);
}

export function createdResponse<T>(reply: FastifyReply, data: T): FastifyReply {
  return successResponse(reply, data, 201);
}

export function noContentResponse(reply: FastifyReply): FastifyReply {
  return reply.code(204).send();
}
