import { ApplicationError } from '@commons/errors';
import { Either } from '@commons/logic';

type AuthenticateAccountQueryInput = {
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

type AuthenticateAccountQueryOutputProps = {
  token: string;
  refreshToken: string;
};

type AuthenticateAccountQueryOutput = Either<
  ApplicationError,
  AuthenticateAccountQueryOutputProps
>;

interface AuthenticateAccountQuery {
  handle(
    props: AuthenticateAccountQueryInput,
  ): Promise<AuthenticateAccountQueryOutput>;
}

export {
  AuthenticateAccountQuery,
  AuthenticateAccountQueryInput,
  AuthenticateAccountQueryOutput,
};
