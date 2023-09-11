import { ApplicationError } from '@commons/errors';
import { Either } from '@commons/logic';

type RefreshTokenQueryInput = {
  refreshToken: string;
};

type RefreshTokenQueryOutputProps = {
  token: string;
  refreshToken: string;
};

type RefreshTokenQueryOutput = Either<
  ApplicationError,
  RefreshTokenQueryOutputProps
>;

interface RefreshTokenQuery {
  handle(props: RefreshTokenQueryInput): Promise<RefreshTokenQueryOutput>;
}

export {
  RefreshTokenQuery,
  RefreshTokenQueryInput,
  RefreshTokenQueryOutput,
  RefreshTokenQueryOutputProps,
};
