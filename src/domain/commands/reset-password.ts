import { ApplicationError } from '@commons/errors';
import { Either } from '@commons/logic';

type ResetPasswordCommandInput = {
  email: string;
  tenantCode: string;
};

type ResetPasswordCommandOutput = Either<ApplicationError, unknown>;

interface ResetPasswordCommand {
  handle(props: ResetPasswordCommandInput): Promise<ResetPasswordCommandOutput>;
}

export {
  ResetPasswordCommand,
  ResetPasswordCommandInput,
  ResetPasswordCommandOutput,
};
