import { ApplicationError } from '@commons/errors';
import { Result } from '@commons/logic';

type RefreshTokenQueryInput = {
  refreshToken: string;
};

type RefreshTokenQueryOutputProps = {
  token: string;
  refreshToken: string;
};

type RefreshTokenQueryOutput = Result<
  RefreshTokenQueryOutputProps,
  ApplicationError
>;

interface RefreshTokenQuery {
  handle(props: RefreshTokenQueryInput): Promise<RefreshTokenQueryOutput>;
}

export { RefreshTokenQuery, RefreshTokenQueryInput, RefreshTokenQueryOutput };
