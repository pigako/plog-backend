import { Inject, Injectable } from "@nestjs/common";
import { GCS_BUCKET } from "src/common/common.constants";

@Injectable()
export class FileService {
    constructor(@Inject(GCS_BUCKET) private readonly gcsBucket) {}

    async uploadImages(images: Express.Multer.File) {}
}
