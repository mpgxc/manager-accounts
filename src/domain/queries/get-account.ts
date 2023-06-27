import { ApplicationError } from 'commons/errors';
import { Either } from 'commons/logic';

type GetAccountCommandInput = {
  id?: string;
  phone?: string;
  username?: string;
  email?: string;
  tenantCode: string;
};

type GetAccountCommandOutputProps = {
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

type GetAccountCommandOutput = Either<
  ApplicationError,
  GetAccountCommandOutputProps
>;

interface GetAccountCommand {
  handle(props: GetAccountCommandInput): Promise<GetAccountCommandOutput>;
}

export { GetAccountCommand, GetAccountCommandInput, GetAccountCommandOutput };
