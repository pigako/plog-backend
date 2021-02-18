import { CoreOutput } from "src/common/dto/output.dto";
import { Post } from "../entities/post.entity";

export class GetPostsInput {}
export class GetPostsOutput extends CoreOutput {
    posts?: Post[];
}
