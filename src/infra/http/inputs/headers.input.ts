import { RegexPatterns } from '@commons/types';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 *  @description Input headers to access routes
 */
export type TenantHeaderKeys = keyof TenantHeader;

export class TenantHeader {
  @IsString()
  @IsNotEmpty()
  @Matches(RegexPatterns.TENANT_HEADER, {
    message: 'Invalid Tenant Header',
  })
  @Expose({ name: 'tenantId' })
  ['x-tenant-id']!: string;
}

export class AuthorizationHeader {
  @IsString()
  @IsNotEmpty()
  @Matches(RegexPatterns.AUTHORIZATION_HEADER, {
    message: 'Invalid Authorization Header',
  })
  authorization!: string;
}
