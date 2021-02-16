import { CoreOutput } from "src/common/dto/output.dto";
import { Post } from "../entities/post.entity";

class Data {
    post: Post;
}

export class GetPostInput {}
export class GetPostOutput extends CoreOutput {
    data?: Data;
}
