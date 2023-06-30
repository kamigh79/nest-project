import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, ProfileDto, UserDto } from './request';
import { Prisma, Profile } from '@prisma/client';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

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

    if (await this.usersService.isUserDuplicated(data)) {
      throw new BadRequestException(null, 'User tekrarist!');
    }

    const createdUser = await this.usersService.createUser(data);

    //generated code
    const codeToSMS = createdUser?.Code;

    //send SMS
    this.usersService.sendSMS(userData.Phone, codeToSMS);

    return createdUser?.id;
  }
  @Post('login')
  async loginuser(
    @Body()
    userdata: LoginDto,
  ): Promise<string> {
    const result = this.usersService.login(userdata);
    return result;
  }

  @Get('all')
  async getAllUsers(@I18n() i18n: I18nContext): Promise<any> {
    const users = await this.usersService.getAllUsers();
    return { message: i18n.t('tr.hello'), data: users };
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async UpdateUserProfile(
    @Body()
    userData: ProfileDto,
  ): Promise<Profile> {
    const result = this.usersService.updateProfile(userData);
    return result;
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
