import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppRepository } from 'src/repository/app.repository';

@Injectable()
export class UserService {
  constructor (
    private readonly appRepository: AppRepository,
  ) { }


  public async getUserByLogin(login: string): Promise<User | null> {
    return await this.appRepository.user.findUnique({
      where: {
        login: login,
      }
    });
  }

  public async getUserById(id: string): Promise<User | null> {
    return await this.appRepository.user.findUnique({
      where: {
        id: id,
      }
    });
  }

}
