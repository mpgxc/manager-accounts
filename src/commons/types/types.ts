export type AccountProps = {
  id: string;
  name: string;
  username: string;
  password: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
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
