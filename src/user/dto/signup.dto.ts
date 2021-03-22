import { IsEnum, IsString } from "class-validator";
import { Role } from "src/common/common.constants";
import { CoreOutput } from "src/common/dto/output.dto";

export class SignupInput {
    @IsString()
    userId: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role;
}

export class SignupOutput extends CoreOutput {}
