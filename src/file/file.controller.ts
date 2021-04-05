import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { FileService } from "./file.service";

@ApiTags("File")
@Controller("file")
export class FileController {
    constructor(private readonly service: FileService) {}

    @Post("/upload/image")
    @UseInterceptors(FileInterceptor("upload"))
    async uploadImage(@Req() request: Request, @UploadedFile("file") file: Express.Multer.File) {
        console.log(file);

        const result = await this.service.uploadImages(file);
        console.log(result);
        return result;
    }
}
