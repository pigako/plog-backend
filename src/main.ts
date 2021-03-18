import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { HealthcheckMiddleware } from "./middleware/healthcheck.middleware";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});
    const configService = app.get(ConfigService);

    app.setGlobalPrefix("api/v1");
    app.enableCors({
        allowedHeaders: "Content-Type",
        methods: "POST,GET,PUT,PATCH,DELETE,OPTIONS",
        credentials: true,
        origin: process.env.NODE_ENV === "production" ? "https://www.pigako.com" : true
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.use(
        morgan("dev", {
            skip: (req, res) => {
                if (req.hostname == "hc.check") {
                    return true;
                }
            }
        })
    );
    app.use(cookieParser(configService.get("SESSION_KEY")));

    app.use(HealthcheckMiddleware);

    const config = new DocumentBuilder()
        .setTitle("Pigako Blog API")
        .setVersion("1.0")
        .addTag("Plog")
        .addCookieAuth("connect.sid")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/v1/swagger", app, document);

    const port = process.env.NODE_ENV === "production" ? 80 : 4000;

    await app.listen(port);
}
bootstrap();
