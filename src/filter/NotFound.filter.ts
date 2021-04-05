import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(404).json({
            error: `찾을 수 없습니다.`
        });
    }
}
