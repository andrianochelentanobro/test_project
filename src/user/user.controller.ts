import { fillDTO } from 'assets/utils/utils';

import { Request } from 'express';

import { BadRequestException, Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from './user.service';

import { JwtAuthGuard } from 'assets/guard/jwt-auth.guard';

import { GetMeHttpResponseDto } from 'assets/dto/http/response-dto/get-me.http-response-dto';



@Controller('users')
export class UserController {
  constructor (
    private readonly userService: UserService,
  ) { }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Me', description: 'Get Me info' })
  @ApiResponse({ status: HttpStatus.OK, type: GetMeHttpResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req: Request): Promise<GetMeHttpResponseDto> {
    const userId = req.user.sub;

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }


    return fillDTO(GetMeHttpResponseDto, user);
  }

}
