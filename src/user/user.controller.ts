import { Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
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

        response.cookie("PLOG", { userId: result.userId });
        return response.status(HttpStatus.OK).json({});
    }
}
