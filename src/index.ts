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
    if (!await this.redis.get(key)) {
      return undefined;
    }
    const value = await this.redis.get(key) as unknown as string;
    return JSON.parse(value) as unknown as T;
  }

  async write(key: string, value: T) {
    try {
      await this.redis.set(key, JSON.stringify(value));
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
