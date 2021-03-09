import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly redisService: RedisService, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        console.log(request.signedCookies);
        console.log(request.cookies);

        const loginUserId = await this.redisService.get(`LOGIN_USER:${request.signedCookies?.PLOG}`);

        if (!loginUserId) {
            return false;
        }

        const user = await this.userService.getUser(request.signedCookies.PLOG);
        request.user = user;
        return true;
    }
}
