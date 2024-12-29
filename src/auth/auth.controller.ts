import { DEFAULT_THROTTLER_PROFILE_NAME } from 'assets/constant/constant';

import { Request } from 'express';
import { Redis } from 'ioredis';

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { seconds, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { HttpBodyValidationPipe } from 'assets/pipe/http-body.validation-pipe';

import { LoginHttpRequestDto } from 'assets/dto/http/request-dto/login.http-request-dto';

import { JwtAuthGuard } from 'assets/guard/jwt-auth.guard';

import { AuthService } from './auth.service';
import { LoginHttpResponseDto } from 'assets/dto/http/response-dto/login.http-response-dto';
import { fillDTO } from 'assets/utils/utils';



@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    @InjectRedis() private readonly redisClient: Redis,
  ) { }


  @ApiOperation({ summary: 'Login', description: 'Logging to service' })
  @ApiBody({ type: LoginHttpRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ [DEFAULT_THROTTLER_PROFILE_NAME]: { limit: 1,  ttl: seconds(30), blockDuration: seconds(10), } })
  async login(@Body(new HttpBodyValidationPipe(LoginHttpRequestDto)) dto: LoginHttpRequestDto): Promise<LoginHttpResponseDto> {
    return fillDTO(LoginHttpResponseDto, await this.authService.login(dto));
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout', description: 'Logout to service' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/logout')
  async logout(@Req() req: Request) {
    const jwtToken = req.headers.authorization.split(' ')[1];

    await this.redisClient.set(jwtToken, 1, 'EX', Math.ceil(req.user.exp - (Date.now()/1000)));
  }

}
