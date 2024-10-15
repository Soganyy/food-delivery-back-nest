import { ApiProperty } from '@nestjs/swagger';

export class SpecificationCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;
}
