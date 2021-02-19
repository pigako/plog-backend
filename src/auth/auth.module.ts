import { DynamicModule, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { AuthModuleOptions } from "./auth.interface";
@Module({})
export class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule {
        return {
            module: AuthModule,
            exports: [AuthService],
            providers: [
                AuthService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                }
            ],
            imports: [UserModule]
        };
    }
}
