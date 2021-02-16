import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Comment extends CoreEntity {
    @Column()
    @IsString()
    userId: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    comment: string;

    @ManyToOne(
        () => Post,
        (post) => post.comments
    )
    post: Post;
}
