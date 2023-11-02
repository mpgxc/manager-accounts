import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';

type RegisterAccountCommandInput = {
  name: string;
  phone: string;
  email: string;
  lastName: string;
  username: string;
  password: string;
  tenantCode: string;
};

type RegisterAccountCommandOutput = Result<void, ApplicationError>;

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
