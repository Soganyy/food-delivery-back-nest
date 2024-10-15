import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/base.entity';
import { Item } from 'src/item/item.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('specifications')
export class Specification extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'text' })
  name: string;

  @ApiProperty()
  @Column({ type: 'bigint' })
  value: number;

  @ManyToOne(() => Item, (item) => item.specifications)
  item: Item;
}
