import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  subcategories: Category[];
}
