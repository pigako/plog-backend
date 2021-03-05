import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "src/decorator/user.decorator";
import { LogoutInput, LogoutOutput } from "./dto/logout.dto";
import { SigninInput } from "./dto/signin.dto";
import { SignupInput, SignupOutput } from "./dto/signup.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post("/signup")
    async signup(@Body() signupInput: SignupInput): Promise<SignupOutput> {
        return await this.service.signup(signupInput);
    }

    @Post("/signin")
    async signin(@Body() signinInput: SigninInput, @Res() response: Response): Promise<Response> {
        const result = await this.service.signin(signinInput);

        response.cookie("PLOG", result.userId, {
            domain: process.env.NODE_ENV === "production" ? "www.pigako.com" : "localhost",
            path: "/",
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            signed: true
        });
        return response.status(HttpStatus.OK).json(result);
    }

    @Delete("/logout")
    @UseGuards(AuthGuard)
    async logout(@User() logoutInput: LogoutInput, @Res() response: Response): Promise<Response> {
        const result = await this.service.logout(logoutInput);

        // response.cookie("PLOG", "", { maxAge: 0 });
        return response.status(HttpStatus.OK).send(result);
    }
}
