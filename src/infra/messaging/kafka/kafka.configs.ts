import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig, SASLOptions } from 'kafkajs';

@Injectable()
export class kafkaClientConfigsService {
  constructor(private readonly config: ConfigService) {}

  get clientConfigs(): { sasl: SASLOptions } & KafkaConfig {
    return {
      clientId: this.config.getOrThrow<string>('KAFKA.KAFKA_CLIENT_ID')!,
      brokers: [this.config.getOrThrow<string>('KAFKA.KAFKA_BROKER')],
      sasl: {
        mechanism: 'scram-sha-256',
        username: this.config.getOrThrow<string>('KAFKA.KAFKA_USERNAME'),
        password: this.config.getOrThrow<string>('KAFKA.KAFKA_PASSWORD'),
      },
      ssl: true,
    };
  }
}
