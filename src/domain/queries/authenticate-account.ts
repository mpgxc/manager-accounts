import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';

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

type AuthenticateAccountQueryOutput = Result<
  AuthenticateAccountQueryOutputProps,
  ApplicationError
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
