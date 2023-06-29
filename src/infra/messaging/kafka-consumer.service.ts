import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerKafka } from '@nestjs/microservices';
import { LoggerService } from 'infra/providers/logger/logger.service';

@Injectable()
export class KafkaConsumerService
  extends ServerKafka
  implements OnModuleDestroy
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
      consumer: {
        groupId: configService.getOrThrow<string>('KAFKA.KAFKA_GROUP_ID'),
      },
    });

    logger.setContext(KafkaConsumerService.name);
  }

  async onModuleDestroy() {
    await this.close();
  }
}
