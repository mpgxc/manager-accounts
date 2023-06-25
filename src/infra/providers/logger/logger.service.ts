import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
class LoggerService extends ConsoleLogger {}

export { LoggerService };
