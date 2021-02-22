import { DynamicModule, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { AuthModuleOptions } from "./auth.interface";
@Module({
    imports: [],
    exports: [AuthService],
    providers: [AuthService]
})
export class AuthModule {}
