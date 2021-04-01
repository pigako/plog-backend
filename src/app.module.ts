import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RedisModule } from "./redis/redis.module";
import { FileController } from "./file/file.controller";
import { FileModule } from "./file/file.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                PRIVATE_KEY: Joi.string().required(),
                SESSION_KEY: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().required(),
                GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),

                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),
                GOOGLE_REDIRECT_URI: Joi.string().required(),
                GOOGLE_GRANT_TYPE: Joi.string().required(),

                KAKAO_CLIENT_ID: Joi.string().required(),
                KAKAO_CLIENT_SECRET: Joi.string().required(),
                KAKAO_REDIRECT_URI: Joi.string().required(),
                KAKAO_GRANT_TYPE: Joi.string().required(),

                GITHUB_CLIENT_ID: Joi.string().required(),
                GITHUB_CLIENT_SECRET: Joi.string().required(),
                GITHUB_REDIRECT_URI: Joi.string().required(),
                GITHUB_GRANT_TYPE: Joi.string().required(),

                NAVER_CLIENT_ID: Joi.string().required(),
                NAVER_CLIENT_SECRET: Joi.string().required(),
                NAVER_REDIRECT_URI: Joi.string().required(),
                NAVER_GRANT_TYPE: Joi.string().required(),
                NAVER_REFRESH_TYPE: Joi.string().required()
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
            entities: [__dirname + "/entities/*{.ts,.js}"]
        }),
        AuthModule.forRoot({
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
            GOOGLE_GRANT_TYPE: process.env.GOOGLE_GRANT_TYPE,

            KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
            KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
            KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
            KAKAO_GRANT_TYPE: process.env.KAKAO_GRANT_TYPE,

            GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
            GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
            GITHUB_GRANT_TYPE: process.env.GITHUB_GRANT_TYPE,

            NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
            NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
            NAVER_REDIRECT_URI: process.env.NAVER_REDIRECT_URI,
            NAVER_GRANT_TYPE: process.env.NAVER_GRANT_TYPE,
            NAVER_REFRESH_TYPE: process.env.NAVER_REFRESH_TYPE
        }),
        FileModule.forRoot({}),
        PostsModule,
        CommentsModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
