import { Entity } from '@commons/domain';
import { Repository } from '@commons/interfaces';
import { Replace } from '@commons/logic';
import { RefreshTokens } from '@commons/types';

export class Token extends Entity<RefreshTokens> {
  get id(): string {
    return this.props.refreshToken;
  }

  static build(
    props: Replace<
      RefreshTokens,
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

interface TokenRepository
  extends Omit<Repository<Token, RefreshTokens>, 'list'> {
  updateOrCreate(item: Token): Promise<void>;
}

export { TokenRepository };
