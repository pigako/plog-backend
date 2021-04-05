import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

class Error {
    code?: string;
    message?: string;
}

export class CoreOutput {
    @ApiProperty()
    statusCode?: HttpStatus;
    @ApiProperty()
    error?: Error;
}

export class Response {
    @ApiProperty({ default: "boolean" })
    result?: boolean;

    @IsEnum(HttpStatus)
    @IsOptional()
    @ApiProperty({ required: false, description: "상태값", default: HttpStatus.OK })
    statusCode?: HttpStatus;

    @ApiProperty()
    data?;

    @ApiProperty()
    error?;
}
