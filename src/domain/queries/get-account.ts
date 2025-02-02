import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';

type GetAccountQueryInput = {
  id?: string;
  phone?: string;
  username?: string;
  email?: string;
  tenantCode: string;
};

type GetAccountQueryOutputProps = {
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

type GetAccountQueryOutput = Result<
  GetAccountQueryOutputProps,
  ApplicationError
>;

interface GetAccountQuery {
  handle(props: GetAccountQueryInput): Promise<GetAccountQueryOutput>;
}

export {
  GetAccountQuery,
  GetAccountQueryInput,
  GetAccountQueryOutput,
  GetAccountQueryOutputProps,
};
