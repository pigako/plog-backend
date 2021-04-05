import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: "고유 아이디" })
    id: number;

    @CreateDateColumn({ "type": "timestamp" })
    @ApiProperty({ description: "생성일시" })
    createdAt: Date;

    @UpdateDateColumn({ "type": "timestamp" })
    @ApiHideProperty()
    updatedAt: Date;
}
