import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly post: Repository<Post>) {}

    async getList(): Promise<GetPostsOutput> {
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
                    message: "게시물 리스트를 불러올 수 없습니다."
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

    async getPost(postId: number): Promise<GetPostOutput> {
        try {
            const data = await this.post.findOne(postId);

            return {
                result: true,
                data: {
                    post: data
                }
            };
        } catch (error) {
            console.error(error);
            return {
                result: false,
                error: {
                    code: "ERROR_DONT_GET_POST",
                    message: "게시물을 조회 할 수 없습니다."
                }
            };
        }
    }
}
