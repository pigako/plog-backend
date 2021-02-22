import { Inject, Injectable } from "@nestjs/common";
import * as redis from "redis";
import { CONFIG_OPTIONS, REDIS_CLIENT } from "src/common/common.constants";
import { RedisModuleOptions } from "./redis.interface";

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient) {}

    async set(key: string, value: string): Promise<boolean> {
        try {
            this.redisClient.set(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    async get(key: string): Promise<string | boolean> {
        try {
            return this.redisClient.get(key);
        } catch (error) {
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
