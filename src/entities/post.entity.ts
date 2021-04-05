import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { IsNumber, IsString } from "class-validator";
import { Comment } from "src/entities/comments.entity";
import { User } from "src/entities/user.entity";
import { Category } from "./category.entity";
import { ApiProperty } from "@nestjs/swagger";
@Entity()
export class Post extends CoreEntity {
    @ApiProperty()
    @Column()
    @IsString()
    title: string;

    @ApiProperty()
    @Column({ type: "text" })
    @IsString()
    contents: string;

    @ApiProperty()
    @Column({ default: 0 })
    @IsNumber()
    lookup: number;

    @ApiProperty({ type: () => User, description: "작성한 유저" })
    @ManyToOne(
        () => User,
        (user) => user.posts
    )
    user: User;

    @ApiProperty({ type: () => Category, description: "카테고리" })
    @ManyToOne(
        () => Category,
        (category) => category.posts
    )
    category: Category;

    @ApiProperty({ type: () => Comment, description: "댓글" })
    @OneToMany(
        () => Comment,
        (comment) => comment.post
    )
    comments: Comment[];
}
