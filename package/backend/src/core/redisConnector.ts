import { createClient } from 'redis';
import { Redis as RedisEnv } from './constants/env';

const redisClient = createClient({ url: `redis://${RedisEnv.REDIS_HOST_URL}:${RedisEnv.REDIS_HOST_PORT}` });

export class RedisConnector<T> {
    private mainKey: string;
    private connected: boolean = false;
    private ttlSek: number;

    constructor(mainKey: string, ttlSek?: number) {
        this.mainKey = mainKey;
        this.ttlSek = ttlSek || 24 * 60 * 60;
        this.ensureConnected();
    }

    private async ensureConnected(): Promise<void> {
        if (!this.connected) {
            try {
                await redisClient.connect();
                this.connected = true;
            } catch (err) {
                this.connected = false;
                throw new Error('Redis connection failed: ' + err);
            }
        }
    }

    private getTtl(ttl?: number) {
        if (ttl > 0) return ttl;
        return this.ttlSek;
    }

    public async get(id: string): Promise<T | null> {
        try {
            await this.ensureConnected();
            const result = (await redisClient.hGet(this.mainKey, id)) as string;
            return result ? (JSON.parse(result) as T) : null;
        } catch (err) {
            return null;
        }
    }

    public async save(id: string, data: T, ttlSeconds?: number): Promise<T> {
        try {
            if (!id) return null;
            await this.ensureConnected();
            const EX = this.getTtl(ttlSeconds);
            await redisClient.set(`${this.mainKey}:${id}`, JSON.stringify(data), { EX });
            return data;
        } catch (err) {
            return null;
        }
    }

    public async saveHash(id: string, data: T): Promise<T> {
        try {
            if (!id) return null;
            await this.ensureConnected();
            await redisClient.hSet(this.mainKey, id, JSON.stringify(data));
            return data;
        } catch (err) {
            return null;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            await this.ensureConnected();
            const result = await redisClient.hDel(this.mainKey, id);
            return Number(result) > 0;
        } catch (err) {
            return false;
        }
    }

    public async find(matchKey: string, matchValue: string): Promise<T[]> {
        try {
            await this.ensureConnected();
            const all = await redisClient.hGetAll(this.mainKey);
            return Object.values(all)
                .map((json) => {
                    try {
                        return JSON.parse(json) as T;
                    } catch {
                        return null;
                    }
                })
                .filter((item): item is T => item !== null && (item as any)[matchKey] === matchValue);
        } catch (err) {
            return [];
        }
    }

    public async getAll(): Promise<T[]> {
        try {
            await this.ensureConnected();
            const all = await redisClient.hGetAll(this.mainKey);
            return Object.values(all)
                .map((json) => {
                    try {
                        return JSON.parse(json) as T;
                    } catch {
                        return null;
                    }
                })
                .filter((item): item is T => item !== null);
        } catch (err) {
            return [];
        }
    }
}
