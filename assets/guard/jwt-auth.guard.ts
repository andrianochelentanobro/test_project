import { Request } from 'express';
import { Redis } from 'ioredis';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';

import { JwtPayloadType } from 'assets/type/jwt/jwt-payload.type';



@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const jwtToken = this.extractTokenFromHeader(request);

    if (!jwtToken) {
      throw new UnauthorizedException();
    }

    if (await this.redisClient.get(jwtToken)) {
      throw new UnauthorizedException('Данный токен недействителен');
    }

    try {
      const jwtPayload = await this.jwtService.verifyAsync<JwtPayloadType>(jwtToken);
      
      request['user'] = jwtPayload;
    } catch (err) {
      throw new UnauthorizedException((err as Error).message);
    }


    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];


    return type === 'Bearer' ? token : undefined;
  }
}
