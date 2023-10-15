import { ApplicationContainerInject } from '@application/application.module';
import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller';
import {
  KafkaProducerService,
  KafkaProducerServiceDummy,
} from './kafka-producer.service';

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
