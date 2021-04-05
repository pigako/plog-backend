import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Response } from "src/common/dto/output.dto";
import { Post } from "src/entities/post.entity";

export class GetPostsResponse extends Response {
    @ApiProperty({ type: Post, isArray: true })
    data?: {
        posts?: Post[];
    };
}

export class SearchKeywordDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: "검색어" })
    keyword?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, description: "카테고리 고유아이디" })
    category?: number;
}

export class PageDTO {
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, description: "요청 페이지", default: 1 })
    page?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, description: "페이지당 데이터 수", default: 10 })
    maxData?: number;
}
