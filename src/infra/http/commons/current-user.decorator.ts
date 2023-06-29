import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../../global/express';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user,
);
