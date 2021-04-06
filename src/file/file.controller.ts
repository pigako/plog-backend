import { Controller, Get, HttpException, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, PickType } from "@nestjs/swagger";
import { Request } from "express";
import { UploadFileResponse } from "./dto/file.dto";
import { FileService } from "./file.service";

@ApiTags("File")
@Controller("file")
export class FileController {
    constructor(private readonly service: FileService) {}

    @Post("/upload/image")
    @UseInterceptors(FileInterceptor("upload"))
    async uploadImage(@Req() request: Request, @UploadedFile("file") file: Express.Multer.File): Promise<UploadFileResponse["data"]> {
        const result = await this.service.uploadImages(file);
        if (!result.result) {
            throw new HttpException(result.error, result.statusCode);
        }

        return result.data;
    }
}
