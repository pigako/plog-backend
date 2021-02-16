import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("/")
    test(@Res() res: Response): Response {
        return res.send(this.postsService.test());
    }

    @Post("/")
    async create(@Res() res: Response): Promise<Response> {
        const result = await this.postsService.create();

        return res.send(result);
    }
}
