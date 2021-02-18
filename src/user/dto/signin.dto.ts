import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";

export class SigninInput {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}

export class SigninOutput extends CoreOutput {}
