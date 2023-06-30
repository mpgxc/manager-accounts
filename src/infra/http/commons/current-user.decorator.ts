import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequesterUser } from '../../../../global/express';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): RequesterUser =>
    ctx.switchToHttp().getRequest().user,
);
