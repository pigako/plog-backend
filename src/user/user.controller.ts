import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "src/guard/auth.guard";
import { User } from "src/decorator/user.decorator";
import { InfoOutput } from "./dto/info.dto";
import { LogoutInput, LogoutOutput } from "./dto/logout.dto";
import { SigninInput, SigninOutput } from "./dto/signin.dto";
import { SignupInput, SignupOutput } from "./dto/signup.dto";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly service: UserService) {}

    @Get("/info")
    @UseGuards(AuthGuard)
    @ApiCookieAuth()
    @ApiCreatedResponse({ description: "성공", type: InfoOutput })
    async info(@User() user): Promise<InfoOutput> {
        return {
            user: {
                userId: user.email
            }
        };
        return await this.service.getInfo(user.userId);
    }

    @Post("/signup")
    async signup(@Body() signupInput: SignupInput): Promise<SignupOutput> {
        return await this.service.signup(signupInput);
    }

    @Post("/signin")
    @ApiBody({ type: SigninInput })
    @ApiCreatedResponse({
        description: "성공",
        type: SigninOutput
    })
    async signin(@Body() signinInput: SigninInput, @Res() response: Response): Promise<Response> {
        const result = await this.service.signin(signinInput);

        response.cookie("PLOG", result.user.userId, {
            domain: process.env.NODE_ENV === "production" ? "pigako.com" : "localhost",
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

        return response.status(HttpStatus.OK).send(result);
    }
}
