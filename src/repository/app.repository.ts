import { bcryptHashPassword } from "assets/utils/utils";

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";



@Injectable()
export class AppRepository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor () {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log('Prisma Client успешно подключен', AppRepository.name);

    await this.init();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }


  async init() {
    if (await this.user.count() === 0) {
      // Создаем фейковые данные
      const users = [
        {
          login: 'homer777',
          username: 'homer',
          password: '@Aaa123456',
        },
        {
          login: 'batr777',
          username: 'batr',
          password: '@Aaa123456',
        },
        {
          login: 'meggi777',
          username: 'meggi',
          password: '@Aaa123456',
        },
        {
          login: 'crubs777',
          username: 'crubs',
          password: '@Aaa123456',
        },
        {
          login: 'bob777',
          username: 'bob',
          password: '@Aaa123456',
        }
      ];

      for (const user of users) {
        const { login, username, password } = user;

        await this.user.create({
          data: {
            login: login,
            username: username,
            password_hash: await bcryptHashPassword(password),
          },
        });
      }
    }
  }

}
