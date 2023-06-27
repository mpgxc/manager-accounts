import { ApplicationError } from 'commons/errors';
import { Either } from 'commons/logic';

type RegisterAccountCommandInput = {
  name: string;
  phone: string;
  email: string;
  lastName: string;
  username: string;
  password: string;
  tenantCode: string;
};

type RegisterAccountCommandOutput = Either<ApplicationError, unknown>;

interface RegisterAccountCommand {
  handle(
    props: RegisterAccountCommandInput,
  ): Promise<RegisterAccountCommandOutput>;
}

export {
  RegisterAccountCommand,
  RegisterAccountCommandInput,
  RegisterAccountCommandOutput,
};
