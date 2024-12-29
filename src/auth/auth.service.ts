import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LoginHttpRequestDto } from 'assets/dto/http/request-dto/login.http-request-dto';
import { DataForJwtPayloadType } from 'assets/type/jwt/data-for-jwt-payload.type';
import { bcryptComparePassword } from 'assets/utils/utils';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  
  public async login(dto: LoginHttpRequestDto): Promise<{ access_token: string }> {
    const { login, password } = dto;

    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new BadRequestException('Пользователя с таким логином не существует');
    }

    if (!bcryptComparePassword(password, user.password_hash)) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const jwtPayload: DataForJwtPayloadType = {
      sub: user.id,
      username: user.username,
    };


    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

}
