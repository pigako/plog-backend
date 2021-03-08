import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../entities/user.entity";

export class InfoOutput extends CoreOutput {
    data?: Partial<User>;
}
