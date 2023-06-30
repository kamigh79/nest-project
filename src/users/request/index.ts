import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Username: string;

  @ApiProperty()
  @IsNotEmpty()
  Password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Code: string;
}
export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  UserName: string;

  @ApiProperty()
  @IsNotEmpty()
  PassWord: string;
}
export class ProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  UserName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  FirstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  LastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  Age: number;
}
