import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly redisService: RedisService, private readonly authService: AuthService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        console.log(request.signedCookies);
        console.log(request.cookies);

        const authInfo = await this.redisService.get(`COOKIE_${request.signedCookies?.PLOG}`);

        if (!authInfo) {
            return false;
        }

        if (authInfo.info.exp - +(new Date().getTime() / 1000).toFixed(0) < 0) {
            switch (authInfo.type) {
                case "google":
                    await this.authService.googleAuthLogin("refresh", authInfo.token.refresh_token);
                    break;
                default:
                    break;
            }
        }

        request.user = authInfo.info;

        return true;
    }
}
