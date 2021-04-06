import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GCS_BUCKET } from "src/common/common.constants";
import * as crypto from "crypto";
import { UploadFileResponse } from "./dto/file.dto";

@Injectable()
export class FileService {
    constructor(@Inject(GCS_BUCKET) private readonly gcsBucket) {}

    async uploadImages(image: Express.Multer.File): Promise<UploadFileResponse> {
        return new Promise((resolve, reject) => {
            const fileName = `${new Date().getTime()}_${crypto.randomBytes(4).toString("hex")}.${image.originalname.split(".").pop()}`;
            const blob = this.gcsBucket.file(fileName);
            const stream = blob.createWriteStream({
                gzip: true,
                public: true,
                metadata: {
                    originalName: image.originalname
                }
            });

            stream.on("error", (error) => {
                console.error(error);
                console.error("업로드중 에러 발생");
                reject({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Storage Upload Error`
                });
            });

            stream.on("finish", () => {
                resolve({
                    statusCode: HttpStatus.OK,
                    data: { url: `https://cdn.pigako.com/${fileName}` }
                });
            });

            stream.write(image.buffer);
            stream.end();
        });
    }
}
