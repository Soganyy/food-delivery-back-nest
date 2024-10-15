import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { SpecificationCreateDto } from 'src/specification/dto/specification.create.dto';

export class ItemCreateDto {
  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: [SpecificationCreateDto] })
  @IsOptional()
  specifications: SpecificationCreateDto[];
}
