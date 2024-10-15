import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterCourierDto extends LoginDto {
  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  @IsString()
  vehicle: string;
}
