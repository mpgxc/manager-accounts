import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequester } from '../../../../global/express';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserRequester =>
    ctx.switchToHttp().getRequest<{
      user: UserRequester;
    }>().user,
);
