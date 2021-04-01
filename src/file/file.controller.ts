import { Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { FileService } from "./file.service";

@Controller("file")
export class FileController {
    constructor(private readonly service: FileService) {}

    @Post("upload/image")
    async uploadImage(@Req() request: Request) {
        console.log(request);
    }
}
