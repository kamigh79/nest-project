import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      UserName: string;
      Email: string;
      PassWord: string;
      Phone: string;
    },
  ): Promise<number | undefined> {
    const hashedPassword = await this.usersService.hasher(userData.PassWord);
    userData.PassWord = hashedPassword;
    const createdUser = await this.usersService.createUser(userData);

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
