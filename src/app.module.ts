import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { Post } from "./posts/entities/post.entity";
import { Comment } from "./comments/entities/comments.entity";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";
import { RedisModule } from "./redis/redis.module";
import { HealthcheckMiddleware } from "./middleware/healthcheck.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev",
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                PRIVATE_KEY: Joi.string().required(),
                SESSION_KEY: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().required()
            })
        }),
        RedisModule.forRoot({
            redisHost: process.env.REDIS_HOST,
            redisPort: process.env.REDIS_PORT
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            timezone: "+09:00",
            synchronize: true,
            logging: true,
            entities: [Post, Comment, User]
        }),
        AuthModule,
        PostsModule,
        CommentsModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
