import { CacheModule, DynamicModule, Global, Module } from "@nestjs/common";
import { CONFIG_OPTIONS, REDIS_CLIENT } from "src/common/common.constants";
import { RedisModuleOptions } from "./redis.interface";
import * as redis from "async-redis";
import { RedisService } from "./redis.service";

@Module({})
@Global()
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            exports: [RedisService],
            providers: [
                RedisService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                {
                    provide: REDIS_CLIENT,
                    useFactory: async () => {
                        const redisClient = redis.createClient(options);

                        return redisClient;
                    }
                }
            ]
        };
    }
}
