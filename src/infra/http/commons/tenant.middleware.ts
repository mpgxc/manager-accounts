import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { TenantHeader } from '../inputs/headers.input';
import { InputDtosValidate } from './input-dtos-validate';

@Injectable()
export class TenantMiddleware
  extends InputDtosValidate
  implements NestMiddleware
{
  async use(req: Request, res: Response, next: NextFunction) {
    const instance = Object.assign(new TenantHeader(), {
      ['x-tenant-id']: req.headers['x-tenant-id'],
    });

    const { exceptions, hasError } = await this.validate<TenantHeader>(
      instance,
    );

    if (hasError) {
      throw new BadRequestException(exceptions);
    }

    return next();
  }
}
