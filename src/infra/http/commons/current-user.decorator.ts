import { UserRequester } from '@global/fastify';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserRequester =>
    ctx.switchToHttp().getRequest<{
      user: UserRequester;
    }>().user,
);
