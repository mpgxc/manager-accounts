import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const RequiredHeaders = createParamDecorator(
  async <T extends string>(properties: T[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const propertiesLowerCase = properties.map((h) => h.toLowerCase());

    const headers = Object.keys(request.headers).reduce((acc, header) => {
      if (propertiesLowerCase.includes(header.toLowerCase() as T)) {
        acc[header] = request.headers[header.toLowerCase()];
      }

      return acc;
    }, {});

    const missingRequiredHeaders = propertiesLowerCase.filter(
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
