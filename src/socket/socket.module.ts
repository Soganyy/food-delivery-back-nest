import { Module } from '@nestjs/common';
import { LocationGateway } from './location.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, JwtModule, ConfigModule],
  providers: [LocationGateway],
  exports: [LocationGateway],
})
export class SocketModule {}
