import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Merchant } from './merchant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantController } from './merchant.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => ({
        global: true,
        secret: configservice.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '365d' },
      }),
    }),
  ],
  providers: [MerchantService],
  exports: [MerchantService],
  controllers: [MerchantController],
})
export class MerchantModule {}
