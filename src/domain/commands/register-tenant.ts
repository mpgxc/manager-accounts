import { ApplicationError } from 'commons/errors';
import { Either } from 'commons/logic';

type RegisterTenantCommandInput = {
  name: string;
  description: string;
};

type RegisterTenantCommandOutput = Either<ApplicationError, unknown>;

interface RegisterTenantCommand {
  handle(
    props: RegisterTenantCommandInput,
  ): Promise<RegisterTenantCommandOutput>;
}

export {
  RegisterTenantCommand,
  RegisterTenantCommandInput,
  RegisterTenantCommandOutput,
};
