import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly service: PostsService) {}

    @Get("/")
    @UseGuards(AuthGuard)
    async list(): Promise<GetPostsOutput> {
        return await this.service.getList();
    }

    @Post("/")
    @UseGuards(AuthGuard)
    async create(@Body() createPostInput: CreatePostInput): Promise<CreatePostOutput> {
        return await this.service.create(createPostInput);
    }

    @Get("/:id")
    async getPost(@Param() id: number): Promise<GetPostOutput> {
        return await this.service.getPost(id);
    }
}
