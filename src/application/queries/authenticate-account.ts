import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ImplRegisterAccountCommand } from 'application/commands/register-account';
import { Cache } from 'cache-manager';
import { ApplicationError } from 'commons/errors';
import { Result } from 'commons/logic';
import {
  AuthenticateAccountCommand,
  AuthenticateAccountCommandInput,
  AuthenticateAccountCommandOutput,
} from 'domain/queries/authenticate-account';
import { AccountRepository } from 'domain/repositories/account-repository';
import { ImplAccountRepository } from 'infra/database/repositories';
import { ImplHasherProvider } from 'infra/providers/hasher/hasher.provider';
import { LoggerService } from 'infra/providers/logger/logger.service';
import { SecretsManagerOutput } from 'infra/providers/secrets-manager/secrets-manager.interface';

@Injectable()
class ImplAuthenticateAccountCommand implements AuthenticateAccountCommand {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(ImplAccountRepository.name)
    private readonly repository: AccountRepository,
    private readonly hasher: ImplHasherProvider,
    private readonly logger: LoggerService,
    private jwtService: JwtService,
  ) {
    this.logger.setContext(ImplRegisterAccountCommand.name);
  }

  async handle({
    email,
    password,
    tenantCode,
  }: AuthenticateAccountCommandInput): Promise<AuthenticateAccountCommandOutput> {
    try {
      const tenantExists = await this.repository.findTenantByName(tenantCode);

      if (!tenantExists) {
        return Result.failure(
          ApplicationError.build({
            message: 'Tenant not found!',
            name: 'TenantNotFound',
          }),
        );
      }

      const account = await this.repository.findBy({
        email,
        tenantCode,
      });

      if (!account) {
        return Result.failure(
          ApplicationError.build({
            message: 'Account not found!',
            name: 'AccountNotFound',
          }),
        );
      }

      const passwordMatch = await this.hasher.isMatch(
        password,
        account.props.password,
      );

      if (!passwordMatch) {
        return Result.failure(
          ApplicationError.build({
            message: 'Cant authenticate account! Invalid credentials!',
            name: 'CantAuthenticateAccount',
          }),
        );
      }

      //TODO: Tem que virar mapper!
      const roles = account.props.roles.map((role) => ({
        role: role.props.name,
        permissions: role.props.permissions.map(({ props }) => props.name),
      }));

      const payload = {
        sub: account.id,
        email: account.props.email,
        username: account.props.username,
        tenantCode: account.props.tenantCode,
        roles,
      };

      const secrets = await this.cacheManager.get<SecretsManagerOutput>(
        tenantCode,
      );

      return Result.success({
        refreshToken: 'refreshToken',
        token: await this.jwtService.signAsync(payload, {
          privateKey: secrets?.value.jwt_secret_key,
        }),
        roles,
      });
    } catch (error) {
      this.logger.error(
        'Application > Command - Authenticate Account > Unexpected Error',
        error,
      );

      return Result.failure(
        ApplicationError.build({
          message: `Unexpected error on authenticate account! ${
            (error as Error).message
          }`,
          name: 'UnexpectedError',
        }),
      );
    }
  }
}

export { ImplAuthenticateAccountCommand };
