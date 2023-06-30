import { ApplicationContainerInject } from '@application/application.module';
import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  providers: [
    KafkaConsumerService,
    ApplicationContainerInject.RegisterTenantCommand,
  ],
  exports: [KafkaConsumerService],
  controllers: [TenantsController],
})
export class MessagingModule {}
