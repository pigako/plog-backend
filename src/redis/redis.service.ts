import { Inject, Injectable } from "@nestjs/common";
import { REDIS_CLIENT } from "src/common/common.constants";

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient) {}

    async set(key: string, value: string): Promise<boolean> {
        try {
            this.redisClient.setex(key, 3600 * 1000, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    async get(key: string): Promise<any> {
        try {
            const value = await this.redisClient.get(key);
            return JSON.parse(value);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async del(key: string): Promise<boolean> {
        try {
            await this.redisClient.del(key);
            return true;
        } catch (error) {
            return false;
        }
    }
}
