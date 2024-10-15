import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base.entity';
import { RolesEnum } from 'src/enums/roles.enum';
import { Order } from 'src/order/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('couriers')
export class Courier extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'text' })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'text' })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'text' })
  phoneNumber: string;

  @ApiProperty()
  @Column({ type: 'text' })
  email: string;

  @ApiProperty()
  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ type: 'text' })
  role: RolesEnum;

  @ApiProperty()
  @Column({ type: 'text' })
  vehicle: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string;

  @OneToMany(() => Order, (order) => order.couriers)
  orders: Order[];
}
