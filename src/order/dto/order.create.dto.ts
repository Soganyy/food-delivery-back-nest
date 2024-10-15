import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrderCreateDto {
  @ApiProperty({ default: [{ itemId: 0, quantity: 0 }] })
  @IsNotEmpty()
  items: {
    itemId: number;
    quantity: number;
  }[];

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  deliveryPrice: number;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  deliveryTime: number;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  merchantId: number;
}
