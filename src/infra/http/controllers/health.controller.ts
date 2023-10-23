import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @LoggerInject(HealthController.name)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async health(): Promise<{
    status: string;
  }> {
    return { status: 'OK' };
  }
}
