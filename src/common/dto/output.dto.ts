import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

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
