import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from './courier.entity';
import { CourierService } from './courier.service';

@Module({
  imports: [TypeOrmModule.forFeature([Courier])],
  providers: [CourierService],
  exports: [CourierService],
})
export class CourierModule {}
