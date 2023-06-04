import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { User, Prisma } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const nanoid = customAlphabet('123456789', 6);
    data.Code = nanoid();
    return this.prisma.user.create({
      data,
    });
  }

  async activateUser(data: Prisma.UserCreateInput): Promise<boolean> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        Phone: data.Phone,
      },
    });

    if (user.Code == data.Code) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          IsVerified: true,
        },
      });

      return true;
    }

    return false;
  }

  async hasher(PassWord: string) {
    const salt = await bcrypt.genSalt();
    const password = PassWord;
    const hash = await bcrypt.hash(password, salt);
    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      return hash.toString();
    } else {
      console.log('hash went wrong');
    }
  }

  async sendSMS(cell: string, code: string) {
    console.log(cell, code);
  }
}
