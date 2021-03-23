import { All, Controller, Get, HttpCode, Param, Query, Redirect, Req, Res } from "@nestjs/common";
import { Request, response, Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly service: AuthService) {}
    @Get("google/callback")
    @HttpCode(302)
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

    @All("kakao/callback")
    @Redirect("https://www.pigako.com/blog/posts", 302)
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
}
