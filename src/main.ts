import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});
    const configService = app.get(ConfigService);

    app.setGlobalPrefix("api/v1");
    app.enableCors();
    app.use(morgan("dev"));
    app.use(cookieParser());
    app.use(
        session({
            resave: false,
            saveUninitialized: false,
            secret: configService.get("SECRET_KEY"),
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
