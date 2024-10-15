import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/item/item.entity';
import { Order } from 'src/order/order.entity';
import { BaseEntity } from 'src/common/base.entity';
import { RolesEnum } from 'src/enums/roles.enum';
import { Exclude } from 'class-transformer';

@Entity('merchants')
export class Merchant extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'text' })
  email: string;

  @ApiProperty()
  @Column({ type: 'text' })
  phoneNumber: string;

  @ApiProperty()
  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ type: 'text' })
  role: RolesEnum;

  @ApiProperty()
  @Column({ type: 'text' })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'text' })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'text' })
  businessName: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: { type: string; coordinates: number[] };

  @OneToMany(() => Item, (item) => item.merchant)
  items: Item[];

  @OneToMany(() => Order, (order) => order.merchant)
  orders: Order[];
}
