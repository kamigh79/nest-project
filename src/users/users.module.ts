import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
dotenv.config();

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class UsersModule {}
