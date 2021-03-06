import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { throwError, ERROR } from "src/common/common.error";
import { RedisService } from "src/redis/redis.service";
import { Repository } from "typeorm";
import { InfoOutput } from "./dto/info.dto";
import { LogoutInput, LogoutOutput } from "./dto/logout.dto";
import { SigninInput, SigninOutput } from "./dto/signin.dto";
import { SignupInput, SignupOutput } from "./dto/signup.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly user: Repository<User>, private readonly redisService: RedisService) {}

    async getInfo(userId: string): Promise<InfoOutput> {
        try {
            const result = await this.getUser(userId);
            if (!result) {
                throw new Error("ERROR_DONT_FIND_USER");
            }

            return {
                statusCode: HttpStatus.OK,
                user: result
            };
        } catch (error) {
            console.error(error);

            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_CREATE_USER",
                    message: "유저의 정보를 찾을 수 없습니다."
                });
            }
        }
    }

    async getUser(userId: string): Promise<User | undefined> {
        return await this.user.findOne(
            { userId: userId },
            {
                select: ["id", "userId", "role"]
            }
        );
    }

    async signup(signupInput: SignupInput): Promise<SignupOutput> {
        try {
            const findUser = await this.user.findOne({ userId: signupInput.userId });

            if (findUser) {
                throw new Error("ERROR_ALREADY_EXISTS_USER");
            }

            await this.user.save(
                this.user.create({
                    userId: signupInput.userId,
                    password: signupInput.password,
                    role: signupInput.role
                })
            );

            return {
                statusCode: HttpStatus.CREATED
            };
        } catch (error) {
            console.error(error);

            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_CREATE_USER",
                    message: "유저를 생성할 수 없습니다."
                });
            }
        }
    }

    async signin(signinInput: SigninInput): Promise<SigninOutput> {
        try {
            const findUser = await this.user.findOne(
                {
                    userId: signinInput.userId
                },
                {
                    select: ["userId", "role", "password"]
                }
            );

            if (!findUser) {
                throw new Error("ERROR_DONT_FIND_USER");
            }

            const result = await findUser.checkPassword(signinInput.password);

            if (!result) {
                throw new Error("ERROR_DONT_MATCH_PASSWORD");
            }

            this.redisService.set(`LOGIN_USER:${findUser.userId}`, findUser.userId);
            delete findUser["password"];
            return {
                statusCode: HttpStatus.OK,
                user: findUser
            };
        } catch (error) {
            console.error(error);

            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "ERROR_DONT_CREATE_USER",
                    message: "유저를 찾을 수 없습니다."
                });
            }
        }
    }

    async logout(logoutInput: LogoutInput): Promise<LogoutOutput> {
        try {
            await this.redisService.del(`LOGIN_USER:${logoutInput.userId}`);

            return {
                statusCode: HttpStatus.OK
            };
        } catch (error) {
            console.error(error);

            if (Object.keys(ERROR).includes(error.message)) {
                throwError(error.message);
            } else {
                throwError("INTERNAL_SERVER_ERROR", {
                    code: "EERROR_DONT_LOGOUT",
                    message: "로그아웃에 실패했습니다."
                });
            }
        }
    }
}
