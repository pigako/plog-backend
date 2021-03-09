import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../entities/user.entity";

export class SigninInput {
    @ApiProperty()
    @IsString()
    userId: string;

    @IsString()
    @ApiProperty()
    password: string;
}

export class SigninOutput extends CoreOutput {
    @ApiProperty()
    userId: User["userId"];
}
