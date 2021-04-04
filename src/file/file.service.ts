import { Inject, Injectable } from "@nestjs/common";
import { GCS_BUCKET } from "src/common/common.constants";
import * as crypto from "crypto";

@Injectable()
export class FileService {
    constructor(@Inject(GCS_BUCKET) private readonly gcsBucket) {}

    async uploadImages(image: Express.Multer.File) {
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
                    result: false,
                    message: "업로드중 에러 발생"
                });
            });

            stream.on("finish", () => {
                resolve({
                    url: `https://cdn.pigako.com/${fileName}`
                });
            });

            stream.write(image.buffer);
            stream.end();
        });
    }
}
