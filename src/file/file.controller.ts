import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { FileService } from "./file.service";

@Controller("file")
export class FileController {
    constructor(private readonly service: FileService) {}

    @Post("/upload/image")
    // @UseInterceptors(FileInterceptor("file"))
    async uploadImage(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
        console.log(request);
        return { url: "cdn.pigako.com/image/2020" };
    }
}
