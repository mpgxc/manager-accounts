import { ApplicationContainerInject } from '@application/application.module';
import { Global, Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller';
import {
  KafkaProducerService,
  KafkaProducerServiceDummy,
} from './kafka-producer.service';

@Global()
@Module({
  providers: [
    {
      provide: KafkaProducerService,
      useClass:
        process.env.NODE_ENV === 'dev'
          ? KafkaProducerServiceDummy
          : KafkaProducerService,
    },
    ApplicationContainerInject.RegisterTenantCommand,
  ],
  exports: [KafkaProducerService],
  controllers: [TenantsController],
})
export class MessagingModule {}
