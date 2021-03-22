import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR, throwError } from "src/common/common.error";
import { Repository } from "typeorm";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly post: Repository<Post>, private readonly userService: UserService) {}

    // 목록 조회
    async getList(): Promise<GetPostsOutput> {
        try {
            const list = await this.post.find({
                relations: ["comments"],
                order: {
                    "id": "DESC"
                }
            });

            return {
                statusCode: HttpStatus.OK,
                posts: list
            };
        } catch (error) {
            console.error(error);

            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_GET_POSTS",
                    message: "게시물 리스트를 불러올 수 없습니다."
                });
            }
        }
    }

    // 게시물 생성
    async create({ title, contents }: CreatePostInput, userId: User["userId"]): Promise<CreatePostOutput> {
        try {
            const user = await this.userService.getUser(userId);

            await this.post.save(
                this.post.create({
                    title: title,
                    contents: contents,
                    user: user
                })
            );

            return {
                statusCode: HttpStatus.CREATED
            };
        } catch (error) {
            console.error(error);
            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_CREATE_POST",
                    message: "게시물을 생성할 수 없습니다."
                });
            }
        }
    }

    // 게시물 조회
    async getPost(postId: number): Promise<GetPostOutput> {
        try {
            await this.post.increment({ id: postId }, "lookup", 1);
            const data = await this.post.findOne(postId);

            return {
                statusCode: HttpStatus.OK,
                post: data
            };
        } catch (error) {
            console.error(error);
            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_GET_POST",
                    message: "게시물을 조회 할 수 없습니다."
                });
            }
        }
    }
}
