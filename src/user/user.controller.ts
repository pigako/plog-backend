import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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
    async signin(@Body() signinInput: SigninInput) {}
}
