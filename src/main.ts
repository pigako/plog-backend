import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});
    app.setGlobalPrefix("api/v1");
    app.use(morgan("dev"));
    await app.listen(4000);
}
bootstrap();
