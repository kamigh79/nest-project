import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Prisma, Profile } from '@prisma/client';
import { LoginDto, ProfileDto } from './request';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const nanoid = customAlphabet('123456789', 6);
    data.Code = nanoid();
    return await this.prisma.user.create({
      data,
    });
  }

  async updateProfile(data: ProfileDto): Promise<Profile> {
    const user = await this.prisma.user.findFirst({
      where: {
        UserName: data.UserName.toLowerCase(),
      },
    });
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!!profile) {
      return await this.prisma.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          Bio: data.Bio,
          Age: data.Age,
          FirstName: data.FirstName,
          LastName: data.LastName,
        },
      });
    } else {
      const created_profile = await this.prisma.profile.create({
        data: {
          userId: user.id,
          Bio: data.Bio,
          Age: data.Age,
          FirstName: data.FirstName,
          LastName: data.LastName,
        },
      });
      return created_profile;
    }
  }

  async login(data: LoginDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        UserName: data.UserName.toLowerCase(),
      },
    });
    const isMatch = await bcrypt.compare(data.PassWord, user.PassWord);
    if (!isMatch) {
      return 'username or password is wrong';
    }
    if (user.IsVerified == true) {
      const accessToken = await this.jwt.signAsync(
        {
          id: user.id,
          username: user.UserName,
        },
        {
          secret: 'secret',
        },
      );
      return accessToken;
    } else {
      return 'verify first';
    }
  }

  async isUserDuplicated(data: Prisma.UserCreateInput): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            Email: data.Email.toLowerCase(),
          },
          {
            UserName: data.UserName.toLowerCase(),
          },
          { Phone: data.Phone.toLowerCase() },
        ],
      },
    });

    return !!user;
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
    const password = PassWord;
    const hash = await bcrypt.hash(password, 10);
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
