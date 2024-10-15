import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Merchant } from 'src/merchant/merchant.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { Courier } from 'src/courier/courier.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'bigint', nullable: true })
  deliveryPrice: number;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  deliveryTime: Date;

  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  totalPrice: number;

  @ApiProperty()
  @Column({ type: 'text' })
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Merchant, (merchant) => merchant.orders)
  merchant: Merchant;

  @ManyToOne(() => Courier, (couriers) => couriers.orders)
  couriers: Courier;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
