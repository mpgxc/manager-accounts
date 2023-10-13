import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const RequiredHeaders = createParamDecorator(
  async <T extends string>(properties: T[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const headers = Object.keys(request.headers).reduce((acc, header) => {
      if (properties.includes(header as T)) {
        acc[header] = request.headers[header.toLowerCase()];
      }

      return acc;
    }, {});

    const missingRequiredHeaders = properties.filter(
      (property) => !Object.keys(headers).includes(property),
    );

    if (missingRequiredHeaders.length) {
      throw new BadRequestException(
        `Missing headers: ${missingRequiredHeaders.toString()}`,
      );
    }

    return headers;
  },
);
