import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR, throwError } from "src/common/common.error";
import { Like, Repository } from "typeorm";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { UserService } from "src/user/user.service";
import { PageDTO, SearchKeywordDTO } from "./dto/posts.dto";
import { Pagination } from "src/common/dto/pagination.dto";
import { Category } from "src/entities/category.entity";
import { CreateCategoryDTO } from "./dto/category.dto";
import { Response } from "src/common/dto/output.dto";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly post: Repository<Post>, private readonly userService: UserService) {}

    // 목록 조회
    async getList(page: PageDTO, searchKeyword: SearchKeywordDTO): Promise<GetPostsOutput> {
        try {
            const pagination = new Pagination(page.page, page.maxData);
            const where = {};

            if (searchKeyword?.keyword) {
                where["title"] = Like(`%${searchKeyword.keyword}%`);
            }

            if (searchKeyword?.category) {
                where["category"] = {
                    id: searchKeyword.category
                };
            }

            pagination.totalCounts = await this.post.count({
                where: where
            });
            pagination.makePaging();

            const data = await this.post.find({
                select: ["id", "title", "category", "lookup"],
                where: where,
                order: {
                    "id": "DESC"
                },
                relations: ["category"],
                skip: (pagination.currentPageNumber - 1) * pagination.maxData,
                take: pagination.maxData
            });

            return {
                statusCode: HttpStatus.OK,
                data: {
                    posts: data
                }
            };
        } catch (error) {
            console.error(error);

            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            };
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
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    }

    // 게시물 조회
    async getPost(postId: number): Promise<GetPostOutput> {
        try {
            // TODO 게시글 있는지 없는지 조회
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

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly category: Repository<Category>) {}

    async list(): Promise<Response> {
        try {
            const data = await this.category.find({
                select: ["id", "name", "createdAt"]
            });

            return {
                result: true,
                data: {
                    category: data
                }
            };
        } catch (error) {
            console.error(error);
            return {
                result: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    }

    async create({ name }: CreateCategoryDTO): Promise<Response> {
        try {
            const result = await this.category.save(
                this.category.create({
                    name: name
                })
            );

            if (!result) {
                return {
                    result: false,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `DATABASE ERROR`
                };
            }

            return {
                result: true
            };
        } catch (error) {
            console.error(error);
            return {
                result: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    }
}
