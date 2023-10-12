export class AuthenticateAccountOutput {
  token!: string;

  refreshToken!: string;
}

class MeRoles {
  role!: string;

  permissions!: Array<string>;
}

export class MeOutput {
  id!: string;

  name!: string;

  username!: string;

  lastName!: string;

  phone!: string;

  email!: string;

  avatar!: string;

  tenantCode!: string;

  roles!: MeRoles[];
}
