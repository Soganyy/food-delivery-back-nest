import { ApiProperty } from '@nestjs/swagger';

export class OrderUpdateDto {
  @ApiProperty({ default: 'pendingMerchantResponse' })
  status: string;
}
