import { CoreOutput } from "src/common/dto/output.dto";
import { Post } from "../entities/post.entity";

class Data {
    posts: Post[];
}

export class GetPostsInput {}
export class GetPostsOutput extends CoreOutput {
    data?: Data;
}
