import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";
import { IsString } from "class-validator";

@Entity()
export class Post extends CoreEntity {
    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    contents: string;
}
