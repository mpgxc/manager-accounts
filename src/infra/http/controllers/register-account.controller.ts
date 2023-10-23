import { ImplRegisterAccountCommand } from '@application/commands/register-account';
import { ExceptionMapper } from '@commons/errors';
import { RegisterAccountCommand } from '@domain/commands/register-account';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequiredHeaders } from '../commons';
import { RegisterAccountInput } from '../inputs';
import { BadRequestOutput, NotFoundOutput } from '../outputs/account.output';

@ApiTags('accounts')
@Controller('accounts')
export class RegisterAccountController {
  constructor(
    @Inject(ImplRegisterAccountCommand.name)
    private readonly registerAccountCommand: RegisterAccountCommand,

    @LoggerInject(RegisterAccountController.name)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiCreatedResponse({ description: 'Account created!' })
  @ApiNotFoundResponse({ type: NotFoundOutput })
  @ApiBadRequestResponse({ type: BadRequestOutput })
  async createAccount(
    @RequiredHeaders(['x-tenant-id']) headers: Record<string, string>,
    @Body() body: RegisterAccountInput,
  ): Promise<void> {
    const { name, phone, email, lastName, password, username } = body;
    const tenantCode = headers['x-tenant-id'];

    this.logger.log('Infra > Http > Controller > Create Account', {
      email,
      username,
    });

    const response = await this.registerAccountCommand.handle({
      name,
      phone,
      email,
      lastName,
      password,
      username,
      tenantCode,
    });

    if (response.hasError) {
      this.logger.warn(
        `Infra > Http > Controller > Create Account > Failure: ${response.value.message}`,
      );

      throw ExceptionMapper(response.value);
    }

    this.logger.log('Infra > Http > Controller > Create Account > Success', {
      email,
      username,
    });
  }
}
