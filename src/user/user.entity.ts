import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/order/order.entity';
import { BaseEntity } from 'src/common/base.entity';
import { RolesEnum } from 'src/enums/roles.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
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
  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: { type: string; coordinates: number[] };

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
