import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("/")
    async list(): Promise<GetPostsOutput> {
        return await this.postsService.getList();
    }

    @Post("/")
    async create(@Body() createPostInput: CreatePostInput): Promise<CreatePostOutput> {
        return await this.postsService.create(createPostInput);
    }

    @Get("/:id")
    async getPost(@Query() id: number): Promise<GetPostOutput> {
        return await this.postsService.getPost(id);
    }
}
