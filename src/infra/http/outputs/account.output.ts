import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Documentação de saída para o endpoint /login
 */
export class AuthenticateAccountOutput {
  @ApiProperty()
  token!: string;

  @ApiProperty()
  refreshToken!: string;
}

class MeRoles {
  @ApiProperty()
  role!: string;

  @ApiProperty({
    type: () => [String],
  })
  permissions!: Array<string>;
}

/**
 * @description Documentação de saída para o endpoint /me
 */
export class MeOutput {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  avatar!: string;

  @ApiProperty()
  tenantCode!: string;

  @ApiProperty({
    type: () => MeRoles,
    example: [
      {
        role: 'admin',
        permissions: ['create', 'read', 'update', 'delete'],
      },
    ],
  })
  roles!: MeRoles[];
}

// TODO: Ajustar os parâmetros de saída
/**
 * @description Documentação de saída para o erro 401
 */
export class NotAuthorizedOutput {
  @ApiProperty({
    type: String,
    example: 'Unauthorized',
  })
  message!: string;

  @ApiProperty({
    type: Number,
    example: 401,
  })
  statusCode!: number;
}

/**
 * @description Documentação de saída para o erro 400
 */
export class BadRequestOutput {
  @ApiProperty({
    type: [String],
    example: ['"email" is required'],
  })
  message!: Array<string>;

  @ApiProperty({
    type: Number,
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    type: String,
    example: 'Bad Request',
  })
  error!: string;
}

export class NotFoundOutput {
  @ApiProperty({
    type: String,
    example: 'Not Found',
  })
  error!: string;

  @ApiProperty({
    type: Number,
    example: 404,
  })
  statusCode!: number;

  @ApiProperty({
    type: String,
    example: 'Tenant not found',
  })
  message!: string;
}
