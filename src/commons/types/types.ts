export type AccountProps = {
  id: string;
  name: string;
  username: string;
  password: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  acceptedTerms: boolean;
  refreshTokens: RefreshTokens[];
  avatar: string;
  tenantCode: string;
  roles: RoleProps[];
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleProps = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: PermissionProps[];
};

export type PermissionProps = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TenantProps = {
  id: string;
  name: string;
  description: string;
  accounts: AccountProps[];
  createdAt: Date;
  updatedAt: Date;
};

export type RefreshTokens = {
  refreshToken: string;
  expiresIn: Date;
  createdAt: Date;
  accountId: string;
};
