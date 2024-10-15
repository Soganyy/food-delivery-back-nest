import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6380,
    });

    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async setLocation(
    courierId: string,
    location: { latitude: number; longitude: number },
  ) {
    await this.redisClient.set(
      `courier:${courierId}`,
      JSON.stringify(location),
    );
  }

  async getLocation(courierId: string) {
    const location = await this.redisClient.get(`courier:${courierId}`);
    return location ? JSON.parse(location) : null;
  }

  async removeLocation(courierId: string) {
    await this.redisClient.del(`courier:${courierId}`);
  }
}
