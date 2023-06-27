import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ApplicationModule } from 'application/application.module';
import { TokenStrategy } from './auth/token.strategy';
import { AccountsController } from './controllers/account.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AccountsController],
  providers: [TokenStrategy],
})
export class InfraHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
