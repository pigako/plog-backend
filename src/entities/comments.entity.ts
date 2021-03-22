import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Post } from "src/entities/post.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Comment extends CoreEntity {
    @Column()
    @IsString()
    comment: string;

    @ManyToOne(
        () => Post,
        (post) => post.comments
    )
    post: Post;

    @ManyToOne(
        () => User,
        (user) => user.comments
    )
    user: User;
}
