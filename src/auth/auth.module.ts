import { DynamicModule, Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { AuthModuleOptions } from "./auth.interface";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleUser } from "src/entities/google-user.entity";
import { KakaoUser } from "src/entities/kakao-user.entity";
import { GithubUser } from "src/entities/github-user.entity";
import { NaverUser } from "src/entities/naver-user.entity";

@Global()
@Module({})
export class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule {
        return {
            module: AuthModule,
            exports: [AuthService],
            imports: [TypeOrmModule.forFeature([GoogleUser, KakaoUser, GithubUser, NaverUser])],
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
