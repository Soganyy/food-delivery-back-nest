import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/base.entity';

export class UserResponseDto extends BaseEntity {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;
}
