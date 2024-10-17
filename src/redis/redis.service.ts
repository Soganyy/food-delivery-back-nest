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
      `courier-${courierId}`,
      JSON.stringify(location),
    );
  }

  async removeLocation(courierId: string) {
    await this.redisClient.del(`courier-${courierId}`);
  }

  async getLocation(courierId: string) {
    const location = await this.redisClient.get(`courier-${courierId}`);
    return location ? JSON.parse(location) : null;
  }

  async getAllLocations() {
    return await this.getAllDataMatchingPattern('courier-*');
  }

  async scanKeys(pattern: string): Promise<string[]> {
    const keys = [];
    let cursor = '0';

    do {
      const result = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== '0');

    return keys;
  }

  async getValues(keys: string[]): Promise<any[]> {
    if (keys.length === 0) {
      return [];
    }
    return await this.redisClient.mget(keys);
  }

  async getAllDataMatchingPattern(pattern: string): Promise<any[]> {
    const keys = await this.scanKeys(pattern);
    const values = await this.getValues(keys);
    return values;
  }
}
