import { Request as RequestExpress } from 'express';

type User = {
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

declare module 'express' {
  interface Request extends RequestExpress {
    user: User;
  }
}
