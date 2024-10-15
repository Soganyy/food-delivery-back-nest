import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLocationUpdateDto {
  @ApiProperty({ default: '0' })
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ default: '0' })
  @IsNotEmpty()
  latitude: number;
}
