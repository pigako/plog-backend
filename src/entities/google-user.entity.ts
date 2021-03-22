import { IsEnum } from "class-validator";
import { Role } from "src/common/common.constants";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class GoogleUser extends CoreEntity {
    @Column()
    googleId: string;

    @Column()
    googleEmail: string;

    @Column()
    name: string;

    @Column({ type: "enum", enum: Role, default: Role["User"] })
    @IsEnum(Role)
    role: Role;
}
