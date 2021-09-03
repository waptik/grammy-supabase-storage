import { StorageAdapter } from 'grammy';
import IORedis from 'ioredis';

export class RedisAdapter<T> implements StorageAdapter<T> {
  private redis: IORedis.Redis
  test: string

  constructor({
    redisUrl,
    instance,
    options,
  }: {
    redisUrl?: string,
    instance?: IORedis.Redis,
    options?: IORedis.RedisOptions
  }) {
    if (redisUrl) {
      const redis = new IORedis(redisUrl, options);
      this.redis = redis;
    } else if (instance) {
      this.redis = instance;
    } else {
      throw new Error('You should pass redisUrl or redis instance to constructor.');
    }

    return this;
  }

  async read(key: string) {
    try {
      const value = await this.redis.hmget(key) as unknown as T;
      //console.log('v', value)
      return value;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async write(key: string, value: T) {
    try {
      await this.redis.hmset(key, value as any);
    } catch (e) {
      console.error(e);
    }
  }

  async delete(key: string) {
    try {
      await this.redis.del(key);
    } catch (e) {
      console.error(e);
    }
  }
}
