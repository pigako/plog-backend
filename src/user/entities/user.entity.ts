import { IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { Post } from "src/posts/entities/post.entity";
import { Comment } from "src/comments/entities/comments.entity";

enum Role {
    Admin,
    Manager,
    User
}

@Entity()
export class User extends CoreEntity {
    @Column()
    @IsString()
    userId: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsEnum(Role)
    role: Role;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = bcrypt.hash(this.password, 10);
            } catch (error) {
                console.error(error);

                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(comparePassword: string): Promise<boolean> {
        try {
            return bcrypt.compare(comparePassword, this.password);
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
