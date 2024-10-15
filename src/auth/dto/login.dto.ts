import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
