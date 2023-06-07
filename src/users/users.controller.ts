import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './request';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: UserDto,
  ): Promise<number | undefined> {
    const hashedPassword = await this.usersService.hasher(userData.Password);

    const data: Prisma.UserCreateInput = {
      Email: userData.Email,
      UserName: userData.Username,
      PassWord: hashedPassword,
      Phone: userData.Phone,
    };

    const createdUser = await this.usersService.createUser(data);

    //generated code
    const codeToSMS = createdUser?.Code;

    //send SMS
    this.usersService.sendSMS(userData.Phone, codeToSMS);

    return createdUser?.id;
  }

  @Post('activate')
  async activateUser(
    @Body()
    userData: {
      Phone: string;
      Code: string;
    },
  ): Promise<boolean> {
    const result = this.usersService.activateUser({
      Email: '',
      Phone: userData.Phone,
      Code: userData.Code,
      UserName: '',
      PassWord: '',
    });

    return result;
  }
}
