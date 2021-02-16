import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly post: Repository<Post>) {}

    async list(): Promise<GetPostsOutput> {
        try {
            const list = await this.post.find();

            return {
                result: true,
                data: {
                    posts: list
                }
            };
        } catch (error) {
            console.error(error);
            return {
                result: false,
                error: {
                    code: "ERROR_DONT_GET_POSTS",
                    message: "게시물을 불러올 수 없습니다."
                }
            };
        }
    }

    async create({ title, contents }: CreatePostInput): Promise<CreatePostOutput> {
        try {
            await this.post.save(
                this.post.create({
                    title: title,
                    contents: contents
                })
            );

            return {
                result: true
            };
        } catch (error) {
            console.error(error);

            return {
                result: true,
                error: {
                    code: "ERROR_DONT_CREATE_POST",
                    message: "게시물을 생성할 수 없습니다."
                }
            };
        }
    }
}
