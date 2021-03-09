import { IsEnum, IsInstance, IsJSON, IsNumber, IsObject, IsString, Length } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContactReply } from "./contact-reply.entity";

enum Categry {
    SERVICE = "SERVICE",
    FUNCTION = "FUNCTION",
    RATE_SYSTEM = "RATE_SYSTEM",
    ETC = "ETC"
}

enum Status {
    WAIT = "WAIT",
    COMPLETE = "COMPLETE",
    ADMIN_DELETE = "ADMIN_DELETE",
    USER_DELETE = "USER_DELETE"
}

class FileObject {
    originalFilename: string;
    name: string;
    url: string;
}

@Entity()
export class Contact {
    @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true, comment: "문의사항 고유번호" })
    @IsNumber()
    contactUid: number;

    @Column({ type: "char", length: 50, comment: "제목" })
    @IsString()
    @Length(0, 50)
    title: string;

    @Column({ type: "text", comment: "내용" })
    @IsString()
    description: string;

    @Column({ type: "bigint", unsigned: true, comment: "Truing Account 사용자 고유번호" })
    @IsNumber()
    userUid: number;

    @Column({ type: "char", length: 64, comment: "작성자" })
    @IsString()
    @Length(0, 64)
    userName: string;

    @Column({ type: "char", length: 255, comment: "작성자 회사명", nullable: true })
    @IsString()
    @Length(0, 255)
    userCorpName: string;

    @Column({ type: "enum", enum: Categry, comment: "문의 종류" })
    @IsEnum(Categry)
    category: Categry;

    @Column({ type: "enum", enum: Status, comment: "문의 상태", default: "WAIT" })
    @IsEnum(Status)
    status: Status;

    @Column({ type: "json", comment: '첨부파일 [{"originalFilename":"원본 파일이름","name":"파일 이름","url":"c/dfdafadfadsfa.png"}]', nullable: true })
    @IsInstance(FileObject)
    files: FileObject;

    @Column({ type: "char", length: 50, comment: "삭제사유", nullable: true })
    @IsString()
    @Length(0, 50)
    deletedReason: string;

    @OneToOne(
        () => ContactReply,
        (contactReply) => contactReply.contact
    )
    contactReply: ContactReply;

    @CreateDateColumn({ type: "datetime", precision: null, default: () => null })
    createdAt: Date;
    // ALTER TABLE `contact` ADD `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP

    @UpdateDateColumn({ type: "datetime", precision: null, default: () => null, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    // ALTER TABLE `contact` ADD `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6)
}
