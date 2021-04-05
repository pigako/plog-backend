import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { urlencoded, json } from "express";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { HealthcheckMiddleware } from "./middleware/healthcheck.middleware";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NotFoundExceptionFilter } from "./filter/NotFound.filter";
import { ForbiddenExceptionFilter } from "./filter/Forbidden.filter";
import { BadRequestExceptionFilter } from "./filter/BadRequest.filter";

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
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
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
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));

    app.use(HealthcheckMiddleware);

    app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalFilters(new ForbiddenExceptionFilter());
    app.useGlobalFilters(new BadRequestExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle("Pigako Blog API")
        .setVersion("1.0")
        .addCookieAuth("PLOG")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/v1/swagger", app, document, {
        // swaggerOptions: { defaultModelsExpandDepth: -1 },
        customSiteTitle: "Plog Api Docs"
        // customfavIcon: "../../favicon.ico"
    });

    const port = process.env.NODE_ENV === "production" ? 80 : 4000;

    await app.listen(port);
}
bootstrap();
