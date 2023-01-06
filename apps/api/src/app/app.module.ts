import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/news'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../web'),
    }),
    CacheModule.register<ClientOpts>({
      //isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
    NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
