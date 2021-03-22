import { DynamicModule, Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { AuthModuleOptions } from "./auth.interface";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleUser } from "src/entities/google-user.entity";

@Global()
@Module({})
export class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule {
        return {
            module: AuthModule,
            exports: [AuthService],
            imports: [TypeOrmModule.forFeature([GoogleUser])],
            providers: [
                AuthService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                }
            ],
            controllers: [AuthController]
        };
    }
}
