import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";

export class CreatePostInput {
    @IsString()
    title: string;

    @IsString()
    contents: string;
}

export class CreatePostOutput extends CoreOutput {}
