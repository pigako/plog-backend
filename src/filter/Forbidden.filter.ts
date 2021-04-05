import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(403).json({
            error: `권한이 없습니다.`
        });
    }
}
