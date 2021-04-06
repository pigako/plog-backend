import { Response } from "src/common/dto/output.dto";

export class UploadFileResponse extends Response {
    data?: {
        url?: string;
    };
}
