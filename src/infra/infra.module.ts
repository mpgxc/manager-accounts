import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';

import { PassportModule } from '@nestjs/passport';
import { RedisClientOptions } from 'redis';
import { DatabaseModule } from './database/database.module';
import { configuration } from './environment';
import { InfraGRPCModule } from './grpc/grpc.module';
import { InfraHttpModule } from './http/http.module';
import { MessagingModule } from './messaging/messaging.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    PassportModule,
    InfraGRPCModule,
    InfraHttpModule,
    ProvidersModule,
    MessagingModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
      store: redisStore,
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],
})
export class InfraModule {}
