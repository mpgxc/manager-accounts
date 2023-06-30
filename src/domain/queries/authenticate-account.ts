import { ApplicationError } from '@commons/errors';
import { Either } from '@commons/logic';

type AuthenticateAccountCommandInput = {
  /**
   * Future supports
   */
  phone?: string;
  username?: string;

  /**
   * Current supports
   */
  email: string;
  password: string;
  tenantCode: string;
};

type AuthenticatedAccountOutput = {
  token: string;
  refreshToken: string;
};

type AuthenticateAccountCommandOutput = Either<
  ApplicationError,
  AuthenticatedAccountOutput
>;

interface AuthenticateAccountCommand {
  handle(
    props: AuthenticateAccountCommandInput,
  ): Promise<AuthenticateAccountCommandOutput>;
}

export {
  AuthenticateAccountCommand,
  AuthenticateAccountCommandInput,
  AuthenticateAccountCommandOutput,
};
