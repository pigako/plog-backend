import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("/")
    async list(): Promise<GetPostsOutput> {
        return await this.postsService.list();
    }

    @Post("/")
    async create(@Body() createPostInput: CreatePostInput): Promise<CreatePostOutput> {
        return await this.postsService.create(createPostInput);
    }
}
