import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { AuthModule } from 'src/auth/auth.module';
import { MerchantModule } from 'src/merchant/merchant.module';
import { SpecificationModule } from 'src/specification/specification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    MerchantModule,
    SpecificationModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
