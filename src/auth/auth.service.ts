import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as querystring from "querystring";
import * as crypto from "crypto";

import { RedisService } from "src/redis/redis.service";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { AuthModuleOptions } from "./auth.interface";
import { GoogleUser } from "src/entities/google-user.entity";
import { googleUserInfo } from "./dto/google-user-info.dto";
@Injectable()
export class AuthService {
    constructor(private readonly redisService: RedisService, @Inject(CONFIG_OPTIONS) private readonly config: AuthModuleOptions, @InjectRepository(GoogleUser) private readonly googleUser: Repository<GoogleUser>) {}

    createLoginGoogleData(code: string): string {
        const data = {
            "code": code,
            "client_id": this.config.GOOGLE_CLIENT_ID,
            "client_secret": this.config.GOOGLE_CLIENT_SECRET,
            "redirect_uri": this.config.GOOGLE_REDIRECT_URI,
            "grant_type": this.config.GOOGLE_GRANT_TYPE
        };

        return querystring.stringify(data);
    }

    createRefreshGoogleData(refreshToken): string {
        const data = {
            "client_id": this.config.GOOGLE_CLIENT_ID,
            "client_secret": this.config.GOOGLE_CLIENT_SECRET,
            "refresh_token": refreshToken,
            "grant_type": "refresh_token"
        };

        return querystring.stringify(data);
    }

    async getToken(data: string) {
        return await axios
            .post("https://oauth2.googleapis.com/token", data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then((response) => {
                console.log(response.data);

                return response.data;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async getInfo(id: string) {
        return await axios
            .get("https://oauth2.googleapis.com/tokeninfo", {
                "params": {
                    "id_token": id
                }
            })
            .then((response) => {
                console.log(response.data);

                return response.data;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async googleUpsert(userInfo: googleUserInfo) {
        const googleUser = await this.googleUser.findOne({
            googleId: userInfo.googleId,
            googleEmail: userInfo.googleEmail
        });

        if (!googleUser) {
            await this.googleUser.save(this.googleUser.create(userInfo));
        }
    }

    async googleAuthLogin(code: string, refreshToken?) {
        try {
            const data = refreshToken ? this.createLoginGoogleData(code) : this.createRefreshGoogleData(refreshToken);

            const token = await this.getToken(data);
            if (!token) {
                return false;
            }

            const info = await this.getInfo(token.id_token);
            if (!info) {
                return false;
            }

            const cookiename = new Date().getTime().toString(16) + "-" + crypto.randomBytes(8).toString("hex");
            await this.redisService.set(
                `COOKIE_${cookiename}`,
                JSON.stringify({
                    type: "google",
                    token: token,
                    info: info
                })
            );

            this.googleUpsert({
                googleEmail: info.email,
                googleId: info.sub,
                name: info.name
            });

            return {
                cookiename: cookiename,
                email: info.email,
                name: info.name,
                picture: info.picture
            };
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
