import { HttpStatus } from "@nestjs/common";

class Error {
    code?: string;
    message?: string;
}

export class CoreOutput {
    statusCode?: HttpStatus;
    error?: Error;
}
