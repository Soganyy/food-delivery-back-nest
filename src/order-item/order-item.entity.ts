import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/order/order.entity';
import { BaseEntity } from 'src/common/base.entity';
import { Item } from 'src/item/item.entity';

@Entity('orderItems')
export class OrderItem extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'bigint' })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Item, (item) => item.orderItems)
  item: Item;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
