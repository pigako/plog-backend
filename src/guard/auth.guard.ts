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

        if (authInfo.expires - +(new Date().getTime() - 60 * 1000) < 0) {
            switch (authInfo.type) {
                case "google":
                    await this.authService.googleAuthLogin("refresh", authInfo.refreshToken);
                    break;
                case "kakao":
                    await this.authService.kakaoAuthLogin("refresh", authInfo.refreshToken);
                default:
                    break;
            }
        }

        request.user = {
            userId: authInfo.id,
            userName: authInfo.userName,
            userEmail: authInfo.userEmail,
            profile: authInfo.profile
        };

        return true;
    }
}
