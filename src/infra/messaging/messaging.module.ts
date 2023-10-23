import { ApplicationContainerInject } from '@application/application.module';
import { Global, Module } from '@nestjs/common';
import { TenantsController } from './kafka/controllers/tenants.controller';
import {
  KafkaProducerService,
  KafkaProducerServiceDummy,
} from './kafka/kafka-producer.service';
import { kafkaClientConfigsService } from './kafka/kafka.configs';

@Global()
@Module({
  providers: [
    kafkaClientConfigsService,
    {
      provide: KafkaProducerService,
      useClass:
        process.env.NODE_ENV === 'dev'
          ? KafkaProducerServiceDummy
          : KafkaProducerService,
    },
    ApplicationContainerInject.RegisterTenantCommand,
  ],
  exports: [KafkaProducerService, kafkaClientConfigsService],
  controllers: [TenantsController],
})
export class MessagingModule {}
