import { Controller, Get, HttpCode, HttpStatus, Query, Redirect, Req, Res } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @ApiExcludeEndpoint(true)
    @Get("google/callback")
    @HttpCode(HttpStatus.MOVED_PERMANENTLY)
    async googleCallback(@Res() response: Response, @Query("code") code: string) {
        const authResult = await this.service.googleAuthLogin(code);

        if (!authResult) {
            return false;
        }

        response.cookie("PLOG", authResult.cookiename, {
            domain: process.env.NODE_ENV === "production" ? ".pigako.com" : "localhost",
            path: "/",
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            signed: true
        });

        response.redirect(process.env.NODE_ENV === "production" ? "https://www.pigako.com/blog/posts" : "http://localhost:3000/blog/posts");
    }

    @ApiExcludeEndpoint(true)
    @Get("kakao/callback")
    @Redirect("https://www.pigako.com/blog/posts", HttpStatus.MOVED_PERMANENTLY)
    async kakakoCallback(@Res() response: Response, @Query("code") code: string) {
        const authResult = await this.service.kakaoAuthLogin(code);

        if (!authResult) {
            return false;
        }

        response.cookie("PLOG", authResult.cookiename, {
            domain: process.env.NODE_ENV === "production" ? ".pigako.com" : "localhost",
            path: "/",
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            signed: true
        });

        if (process.env.NODE_ENV !== "production") {
            return { url: "http://localhost:3000/blog/posts" };
        }
    }

    @ApiExcludeEndpoint(true)
    @Get("github/callback")
    @Redirect("https://www.pigako.com/blog/posts", HttpStatus.MOVED_PERMANENTLY)
    async githubCallback(@Res() response: Response, @Query("code") code: string) {
        const authResult = await this.service.githubAuthLogin(code);

        if (!authResult) {
            return false;
        }

        response.cookie("PLOG", authResult.cookiename, {
            domain: process.env.NODE_ENV === "production" ? ".pigako.com" : "localhost",
            path: "/",
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            signed: true
        });

        if (process.env.NODE_ENV !== "production") {
            return { url: "http://localhost:3000/blog/posts" };
        }
    }

    @ApiExcludeEndpoint(true)
    @Get("naver/callback")
    @Redirect("https://www.pigako.com/blog/posts", HttpStatus.MOVED_PERMANENTLY)
    async naverCallback(@Res() response: Response, @Query("code") code: string, @Query("state") state: string) {
        const authResult = await this.service.naverAuthLogin(code, state);

        if (!authResult) {
            return false;
        }

        response.cookie("PLOG", authResult.cookiename, {
            domain: process.env.NODE_ENV === "production" ? ".pigako.com" : "localhost",
            path: "/",
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            signed: true
        });

        if (process.env.NODE_ENV !== "production") {
            return { url: "http://localhost:3000/blog/posts" };
        }
    }
}
