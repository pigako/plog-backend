import { CoreOutput } from "src/common/dto/output.dto";

export class CreatePostInput {
    title: string;
    contents: string;
}

export class CreatePostOutput extends CoreOutput {}
