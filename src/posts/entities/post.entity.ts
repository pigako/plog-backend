import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { IsNumber, IsString } from "class-validator";
import { Comment } from "src/comments/entities/comments.entity";

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

    @OneToMany(
        () => Comment,
        (comment) => comment.post
    )
    comments: Comment[];
}
