import { ApiProperty } from "@nestjs/swagger";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Category extends CoreEntity {
    @Column()
    @ApiProperty()
    name: string;

    @OneToMany(
        () => Post,
        (post) => post.category
    )
    @ApiProperty({ type: () => Post })
    posts: Post[];
}
