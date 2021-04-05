import { Module } from "@nestjs/common";
import { CategoryService, PostsService } from "./posts.service";
import { CategoryController, PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { UserModule } from "src/user/user.module";
import { Category } from "src/entities/category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, Category]), UserModule],
    providers: [PostsService, CategoryService],
    controllers: [PostsController, CategoryController]
})
export class PostsModule {}
