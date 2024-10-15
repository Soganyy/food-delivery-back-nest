import { Module } from '@nestjs/common';
import { Specification } from './specification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Specification])],
  exports: [TypeOrmModule],
})
export class SpecificationModule {}
