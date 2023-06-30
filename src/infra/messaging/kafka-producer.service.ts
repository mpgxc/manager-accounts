import { LoggerService } from '@infra/providers/logger/logger.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService
  extends ClientKafka
  implements OnModuleDestroy, OnModuleInit
{
  constructor(configService: ConfigService, logger: LoggerService) {
    super({
      client: {
        clientId: configService.get<string>('KAFKA.KAFKA_CLIENT_ID'),
        brokers: [configService.getOrThrow<string>('KAFKA.KAFKA_BROKER')],
        sasl: {
          mechanism: 'scram-sha-256',
          username: configService.getOrThrow<string>('KAFKA.KAFKA_USERNAME'),
          password: configService.getOrThrow<string>('KAFKA.KAFKA_PASSWORD'),
        },
        ssl: true,
      },
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
