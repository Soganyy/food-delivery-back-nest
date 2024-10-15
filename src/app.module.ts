import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MerchantModule } from './merchant/merchant.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ItemModule } from './item/item.module';
import { SpecificationModule } from './specification/specification.module';
import { CourierModule } from './courier/courier.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        logging: true,
        synchronize: false,
        entities: [path.join(__dirname, '/**/*.entity{.js,.ts}')],
      }),
    }),
    UserModule,
    MerchantModule,
    OrderModule,
    OrderItemModule,
    ItemModule,
    SpecificationModule,
    CourierModule,
    CategoryModule,
    AuthModule,
    RedisModule,
  ],
})
export class AppModule {}
