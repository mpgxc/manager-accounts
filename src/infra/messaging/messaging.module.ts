import { ApplicationContainerInject } from '@application/application.module';
import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  providers: [
    KafkaProducerService,
    ApplicationContainerInject.RegisterTenantCommand,
  ],
  exports: [KafkaProducerService],
  controllers: [TenantsController],
})
export class MessagingModule {}
