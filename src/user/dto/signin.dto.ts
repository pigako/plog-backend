import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../entities/user.entity";

export class SigninInput {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}

export class SigninOutput extends CoreOutput {
    userId: User["userId"];
}
