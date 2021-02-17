import { IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";

enum Role {
    Admin,
    Manager,
    User
}

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
}
