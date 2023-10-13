import { FastifyRequest as Request } from 'fastify';

type UserRequester = {
  id: string;
  name: string;
  username: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  tenantCode: string;
  roles: Array<{
    role: string;
    permissions: Array<string>;
  }>;
};

declare module 'fastify' {
  interface FastifyRequest extends Request {
    user: UserRequester;
  }
}
