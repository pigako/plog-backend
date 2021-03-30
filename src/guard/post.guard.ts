import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Role } from "src/common/common.constants";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const role = await this.authService.getRole(request.user.type, request.user.id);

        console.log(role);

        if (role === Role["User"]) {
            return false;
        }

        return true;
    }
}
