import { IsEnum } from "class-validator";
import { Role } from "src/common/common.constants";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class KakaoUser extends CoreEntity {
    @Column()
    kakaoId: string;

    @Column({ nullable: true })
    kakaoEmail: string;

    @Column()
    name: string;

    @Column({ type: "enum", enum: Role, default: Role["User"] })
    @IsEnum(Role)
    role: Role;
}
