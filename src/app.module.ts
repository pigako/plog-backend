import { Module } from "@nestjs/common";
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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env.dev",
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                PRIVATE_KEY: Joi.string().required(),
                SESSION_KEY: Joi.string().required()
            })
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
        PostsModule,
        CommentsModule,
        AuthModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
