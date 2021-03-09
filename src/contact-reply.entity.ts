import { IsInstance, IsNumber, IsString, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Contact } from "./contact.entity";

class FileObject {
    originalFilename: string;
    name: string;
    url: string;
}

@Entity({ name: "contact_reply" })
export class ContactReply {
    @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true, comment: "문의답변 고유번호" })
    @IsNumber()
    contactReplyUid: number;

    @Column({ type: "char", length: 50, comment: "담당자" })
    @IsString()
    @Length(0, 50)
    admin: string;

    @Column({ type: "text", comment: "내용" })
    @IsString()
    contents: string;

    @Column({ type: "json", comment: '첨부파일 [{"originalFilename":"원본 파일이름","name":"파일 이름","url":"c/dfdafadfadsfa.png"}]', nullable: true })
    @IsInstance(FileObject)
    files: FileObject;

    @OneToOne(
        () => Contact,
        (contact) => contact.contactReply,
        {
            nullable: false
        }
    )
    @JoinColumn({
        referencedColumnName: "contactUid"
    })
    contact: Contact;

    @CreateDateColumn({ type: "datetime", precision: null, default: () => null })
    createdAt: Date;
    // ALTER TABLE `contact` ADD `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP

    @UpdateDateColumn({ type: "datetime", precision: null, default: () => null, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
    // ALTER TABLE `contact` ADD `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6)
}
