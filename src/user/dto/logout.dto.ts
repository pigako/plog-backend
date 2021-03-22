import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../../entities/user.entity";

export class LogoutInput {
    userId: User["userId"];
}

export class LogoutOutput extends CoreOutput {}
