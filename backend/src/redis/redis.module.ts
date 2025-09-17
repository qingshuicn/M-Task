import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_OPTIONS, RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_OPTIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        password: config.get<string>('redis.password') ?? undefined,
        db: config.get<number>('redis.db'),
        keyPrefix: config.get<string>('redis.keyPrefix'),
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      }),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
