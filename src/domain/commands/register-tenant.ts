import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic/result';

type RegisterTenantCommandInput = {
  name: string;
  description: string;
};

type RegisterTenantCommandOutput = Result<void, ApplicationError>;

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
