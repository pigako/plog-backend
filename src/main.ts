import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

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
    app.use(morgan("dev"));
    app.use(cookieParser());
    app.use(
        session({
            resave: false,
            saveUninitialized: false,
            secret: configService.get("SESSION_KEY"),
            cookie: {
                httpOnly: true,
                secure: true
            },
            name: "PLOG"
        })
    );

    await app.listen(4000);
}
bootstrap();
