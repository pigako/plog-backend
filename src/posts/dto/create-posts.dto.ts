import { IsNumber, IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";

export class CreatePostInput {
    @IsString()
    title: string;

    @IsString()
    contents: string;

    @IsNumber()
    category: number;
}

export class CreatePostOutput extends CoreOutput {}
