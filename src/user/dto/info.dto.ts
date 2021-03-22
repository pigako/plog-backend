import { ApiProperty } from "@nestjs/swagger";
import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../../entities/user.entity";

export class InfoOutput extends CoreOutput {
    @ApiProperty()
    user?: Partial<User>;
}
