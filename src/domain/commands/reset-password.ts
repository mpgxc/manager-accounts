import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';

type ResetPasswordCommandInput = {
  email: string;
  tenantCode: string;
};

type ResetPasswordCommandOutput = Result<ApplicationError, unknown>;

interface ResetPasswordCommand {
  handle(props: ResetPasswordCommandInput): Promise<ResetPasswordCommandOutput>;
}

export {
  ResetPasswordCommand,
  ResetPasswordCommandInput,
  ResetPasswordCommandOutput,
};
