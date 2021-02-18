import { CoreOutput } from "src/common/dto/output.dto";
import { Post } from "../entities/post.entity";

export class GetPostInput {}
export class GetPostOutput extends CoreOutput {
    post?: Post;
}
