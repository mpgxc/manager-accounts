import { Entity } from '@commons/domain';
import { Repository } from '@commons/interfaces';
import { Replace } from '@commons/logic';

export type TokenProps = {
  accountId: string;
  refreshToken: string;
  expiresIn: Date;
  createdAt: Date;
};

export class Token extends Entity<TokenProps> {
  get id(): string {
    return this.props.refreshToken;
  }

  static build(
    props: Replace<
      TokenProps,
      {
        createdAt?: Date;
      }
    >,
  ): Token {
    return new Token(
      {
        ...props,
        createdAt: new Date(),
      },
      props.refreshToken,
    );
  }
}

type TokenRepositoryOutput = TokenProps & {
  id: string;
};

interface TokenRepository
  extends Omit<Repository<Token, TokenRepositoryOutput>, 'list'> {
  updateOrCreate(item: Token): Promise<void>;
}

export { TokenRepository, TokenRepositoryOutput };
