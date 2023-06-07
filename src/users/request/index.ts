import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';
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
