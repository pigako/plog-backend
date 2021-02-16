import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ "type": "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ "type": "timestamp" })
    updatedAt: Date;
}
