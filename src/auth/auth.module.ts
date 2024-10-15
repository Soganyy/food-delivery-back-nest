import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { MerchantModule } from 'src/merchant/merchant.module';
import { CourierModule } from 'src/courier/courier.module';
import { AuthGuard } from './guards/jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => ({
        global: true,
        secret: configservice.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '365d' },
      }),
    }),
    UserModule,
    MerchantModule,
    CourierModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule {}
