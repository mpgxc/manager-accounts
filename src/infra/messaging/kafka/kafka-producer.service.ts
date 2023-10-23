import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaClientConfigsService } from './kafka.configs';

export class KafkaProducerServiceDummy {
  emit() {}
}

@Injectable()
export class KafkaProducerService
  extends ClientKafka
  implements OnModuleDestroy, OnModuleInit
{
  constructor(
    kafkaConfigs: kafkaClientConfigsService,
    @LoggerInject(KafkaProducerService.name) logger: LoggerService,
  ) {
    super({
      client: kafkaConfigs.clientConfigs,
      producer: {
        allowAutoTopicCreation: true,
      },
    });

    logger.setContext(KafkaProducerService.name);
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
