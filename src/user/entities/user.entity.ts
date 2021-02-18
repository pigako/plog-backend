import { IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { Post } from "src/posts/entities/post.entity";
import { Comment } from "src/comments/entities/comments.entity";
import { Role } from "../core/core.constants";

@Entity()
export class User extends CoreEntity {
    @Column()
    @IsString()
    userId: string;

    @Column()
    @IsString()
    password: string;

    @Column({ type: "enum", enum: Role })
    @IsEnum(Role)
    role: Role;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (error) {
                console.error(error);

                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(comparePassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(comparePassword, this.password);
        } catch (error) {
            console.error(error);

            throw new InternalServerErrorException();
        }
    }

    @OneToMany(
        () => Post,
        (post) => post.user
    )
    posts: Post[];

    @OneToMany(
        () => Comment,
        (comment) => comment.user
    )
    comments: Comment[];
}
