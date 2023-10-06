import { Maybe } from '@commons/logic';
import { Token, TokenRepository } from '@domain/repositories/token-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplTokenRepository implements TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(refreshToken: string): Promise<boolean> {
    const token = await this.prisma.refreshTokens.findUnique({
      where: {
        refreshToken,
      },
    });

    return !!token;
  }

  async create(item: Token): Promise<void> {
    await this.prisma.refreshTokens.create({
      data: {
        expiresIn: item.props.expiresIn,
        refreshToken: item.props.refreshToken,
        account: {
          connect: {
            id: item.props.accountId,
          },
        },
      },
    });
  }

  async findById(refreshToken: string): Promise<Maybe<Token>> {
    const token = await this.prisma.refreshTokens.findUnique({
      where: {
        refreshToken,
      },
    });

    return token
      ? Token.build({
          ...token,
          accountId: token.accountId!,
        })
      : null;
  }
}
