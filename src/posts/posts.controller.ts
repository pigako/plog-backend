import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guard/auth.guard";
import { CreatePostInput, CreatePostOutput } from "./dto/create-posts.dto";
import { GetPostOutput } from "./dto/get-post.dto";
import { GetPostsOutput } from "./dto/get-posts.dto";
import { CategoryService, PostsService } from "./posts.service";
import { User } from "../decorator/user.decorator";
import { ApiCookieAuth, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType, PickType } from "@nestjs/swagger";
import { GetPostsResponse, PageDTO, SearchKeywordDTO } from "./dto/posts.dto";
import { CreateCategoryDTO, getCategoriesResponse } from "./dto/category.dto";
import { Response } from "src/common/dto/output.dto";
import { Category } from "src/entities/category.entity";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
    constructor(private readonly service: PostsService) {}

    @Get("/")
    @ApiOperation({ summary: "게시글 리스트 조회" })
    @ApiResponse({ status: HttpStatus.OK, type: GetPostsResponse, description: "게시글 리스트 조회" })
    async list(@Query() page: PageDTO, @Query() searchKeyword: SearchKeywordDTO): Promise<GetPostsOutput> {
        return await this.service.getList(page, searchKeyword);
    }

    @Post("/")
    @UseGuards(AuthGuard)
    @ApiCookieAuth()
    async create(@Body() createPostInput: CreatePostInput, @User() user): Promise<CreatePostOutput> {
        return await this.service.create(createPostInput, user.userId);
    }

    @Get("/:id")
    @ApiParam({ name: "id", description: "게시글 고유아이디" })
    async getPost(@Param("id") id: number): Promise<GetPostOutput> {
        return await this.service.getPost(id);
    }
}

@ApiTags("Category")
@Controller("category")
@ApiExtraModels(Post, Category)
export class CategoryController {
    constructor(private readonly service: CategoryService) {}

    @Get("/")
    @ApiOperation({ summary: "카테고리 리스트 조회" })
    @ApiResponse({ status: HttpStatus.OK, type: getCategoriesResponse, description: "카테고리 조회" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: PickType(Response, ["error"]) })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: PickType(Response, ["error"]) })
    async list(): Promise<getCategoriesResponse> {
        const result = await this.service.list();

        if (!result.result) {
            throw new HttpException(
                {
                    error: result?.error
                },
                result.statusCode
            );
        }

        return result?.data;
    }

    @Post("/")
    @UseGuards(AuthGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: "카테고리 생성" })
    @ApiResponse({ status: HttpStatus.CREATED, type: PickType(Response, []), description: "생성 결과" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: PickType(Response, ["error"]) })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: PickType(Response, ["error"]), description: "권한이 없는 경우 - ROLE ADMIN만 접근 가능" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: PickType(Response, ["error"]) })
    async create(createCategoryDto: CreateCategoryDTO): Promise<Response> {
        const result = await this.service.create(createCategoryDto);

        if (!result) {
            throw new HttpException(
                {
                    error: result?.error
                },
                result.statusCode
            );
        }

        return result?.data;
    }
}
