import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiProperty({ example: 'Updated Category Name' })
  title: string;
}
