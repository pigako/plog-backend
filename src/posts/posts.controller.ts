import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("/")
    test(@Res() res: Response) {
        res.send(this.postsService.test());
    }
}
