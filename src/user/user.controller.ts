import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
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
    async signin(): Promise<void> {}
}
