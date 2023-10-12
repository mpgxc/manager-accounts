import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { AuthorizationHeader } from '../inputs/headers.input';
import { InputDtosValidate } from './input-dtos-validate';

@Injectable()
export class AuthorizationMiddleware
  extends InputDtosValidate
  implements NestMiddleware
{
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers as Record<string, string>;

    const instance = Object.assign(new AuthorizationHeader(), {
      authorization,
    });

    const { exceptions, hasError } =
      await this.validate<AuthorizationHeader>(instance);

    if (hasError) {
      throw new BadRequestException(exceptions);
    }

    const [, token] = authorization.split(' ');

    return next();
  }
}
