import { DEFAULT_THROTTLER_PROFILE_NAME } from 'assets/constant/constant';

import { Request } from 'express';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';


import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';

import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

import { AppRepository } from './repository/app.repository';

import { EnvInterface } from 'assets/interface/env/env.interface';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: join('env', 'dev.env'),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        type: 'single',
        options: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES'),
        },
      }),
    }),
  ThrottlerModule.forRoot([
      {
        name: DEFAULT_THROTTLER_PROFILE_NAME,
        limit: 3,
        ttl: seconds(30),
        blockDuration: seconds(10),
        generateKey: (context) => {
          const req = context.switchToHttp().getRequest<Request>();

          const forwardedFor = req.headers['x-forwarded-for'] as string;

          const ip = forwardedFor ?? req.ip;


          return ip;
        }
      },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
  ],
  providers: [
    AppRepository,
    AuthService,
    UserService,
  ],
})
export class AppModule { }
