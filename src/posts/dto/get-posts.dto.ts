import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { Post } from "../../entities/post.entity";

export class GetPostsInput {}
export class GetPostsOutput extends CoreOutput {
    data?: {
        posts?: Post[];
    };
}
