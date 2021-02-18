import { IsEnum, IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { Role } from "../core/core.constants";

export class SignupInput {
    @IsString()
    userId: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role;
}

export class SignupOutput extends CoreOutput {}
