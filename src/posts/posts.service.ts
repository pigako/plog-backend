import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly post: Repository<Post>) {}

    test(): string {
        return "Hello";
    }

    async create(): Promise<boolean> {
        try {
            console.log("start");

            await this.post.save(
                this.post.create({
                    title: "테스트입니다.",
                    contents: "테스트 내용입니다.",
                    lookup: 0
                })
            );

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
