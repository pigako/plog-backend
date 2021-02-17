import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { IsNumber, IsString } from "class-validator";
import { Comment } from "src/comments/entities/comments.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Post extends CoreEntity {
    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    contents: string;

    @Column({ default: 0 })
    @IsNumber()
    lookup: number;

    @ManyToOne(
        () => User,
        (user) => user.posts
    )
    user: User;

    @OneToMany(
        () => Comment,
        (comment) => comment.post
    )
    comments: Comment[];
}
