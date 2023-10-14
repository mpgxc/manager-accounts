import { Maybe } from '@commons/logic';
import { Token, TokenRepository } from '@domain/repositories/token-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ImplTokenRepository implements TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(item: Token): Promise<void> {
    const { refreshToken } = item.props;

    await this.prisma.refreshToken.delete({
      where: {
        refreshToken,
      },
    });
  }

  async update(item: Token): Promise<void> {
    const { refreshToken, accountId, createdAt, expiresIn } = item.props;

    await this.prisma.refreshToken.update({
      where: {
        accountId,
      },
      data: {
        createdAt,
        expiresIn,
        accountId,
        refreshToken,
      },
    });
  }

  async updateOrCreate(item: Token): Promise<void> {
    const { expiresIn, refreshToken, createdAt, accountId } = item.props;

    await this.prisma.refreshToken.upsert({
      where: {
        accountId,
      },
      update: {
        expiresIn,
        createdAt,
        refreshToken,
      },
      create: {
        accountId,
        expiresIn,
        createdAt,
        refreshToken,
      },
    });
  }

  async exists(refreshToken: string): Promise<boolean> {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        refreshToken,
      },
    });

    return !!token;
  }

  async create(item: Token): Promise<void> {
    await this.prisma.refreshToken.create({
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
    const token = await this.prisma.refreshToken.findUnique({
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
