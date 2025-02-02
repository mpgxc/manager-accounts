import { UserRequester } from '@global/fastify';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenGuard } from '../auth';
import { CurrentUser } from '../commons';
import { MeOutput, NotAuthorizedOutput } from '../outputs/account.output';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsProfileController {
  constructor(
    @LoggerInject(AccountsProfileController.name)
    private readonly logger: LoggerService,
  ) {}

  @Get('me')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: MeOutput })
  @ApiUnauthorizedResponse({ type: NotAuthorizedOutput })
  async me(@CurrentUser() user: UserRequester): Promise<MeOutput> {
    this.logger.log(`Account <${user.id}> is requesting his profile.`);

    return user;
  }
}
