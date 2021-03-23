import { Inject, Injectable, Param } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as querystring from "querystring";
import * as crypto from "crypto";

import { RedisService } from "src/redis/redis.service";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { AuthModuleOptions } from "./auth.interface";
import { GoogleUser } from "src/entities/google-user.entity";
import { googleUserInfo, kakaoUserInfo } from "./dto/user-info.dto";
import { KakaoUser } from "src/entities/kakao-user.entity";
@Injectable()
export class AuthService {
    constructor(
        private readonly redisService: RedisService,
        @Inject(CONFIG_OPTIONS) private readonly config: AuthModuleOptions,
        @InjectRepository(GoogleUser) private readonly googleUser: Repository<GoogleUser>,
        @InjectRepository(KakaoUser) private readonly kakaoUser: Repository<KakaoUser>
    ) {}

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

    async getGoogleToken(data: string) {
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

    async getGoogleInfo(id: string) {
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
            const data = refreshToken ? this.createRefreshGoogleData(refreshToken) : this.createLoginGoogleData(code);

            const token = await this.getGoogleToken(data);
            if (!token) {
                return false;
            }

            const info = await this.getGoogleInfo(token.id_token);
            if (!info) {
                return false;
            }

            console.log(token);
            console.log(info);

            const cookiename = new Date().getTime().toString(16) + "-" + crypto.randomBytes(8).toString("hex");
            await this.redisService.set(
                `COOKIE_${cookiename}`,
                JSON.stringify({
                    type: "google",
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token,
                    expires: new Date().getTime() + token.expires_in,

                    userId: info.sub,
                    userName: info.name,
                    userEmail: info.email,
                    profile: info.picture
                })
            );

            this.googleUpsert({
                googleEmail: info.email,
                googleId: info.sub,
                name: info.name
            });

            return {
                cookiename: cookiename
            };
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    createLoginKakaoData(code: string) {
        const data = {
            grant_type: this.config.KAKAO_GRANT_TYPE,
            client_id: this.config.KAKAO_CLIENT_ID,
            redirect_uri: this.config.KAKAO_REDIRECT_URI,
            code: code,
            client_secret: this.config.KAKAO_CLIENT_SECRET
        };

        return querystring.stringify(data);
    }

    createRefreshKakaoData(refreshToken: string) {
        const data = {
            grant_type: this.config.KAKAO_GRANT_TYPE,
            client_id: this.config.KAKAO_CLIENT_ID,
            refresh_token: refreshToken,
            client_secret: this.config.KAKAO_CLIENT_SECRET
        };

        return querystring.stringify(data);
    }

    async getKakaoToken(data) {
        return await axios
            .post("https://kauth.kakao.com/oauth/token", data, {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                }
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async getKakaoInfo(accessToken) {
        return await axios
            .get("https://kapi.kakao.com/v2/user/me", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                }
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async kakaoUpsert(userInfo: kakaoUserInfo) {
        const kakaoUser = await this.kakaoUser.findOne({
            kakaoId: userInfo.kakaoId
        });

        if (!kakaoUser) {
            await this.kakaoUser.save(this.kakaoUser.create(userInfo));
        }
    }

    async kakaoAuthLogin(code: string, refreshToken?) {
        try {
            const data = refreshToken ? this.createRefreshKakaoData(refreshToken) : this.createLoginKakaoData(code);

            const token = await this.getKakaoToken(data);
            if (!token) {
                return false;
            }

            const info = await this.getKakaoInfo(token.access_token);
            if (!info) {
                return false;
            }

            console.log(token);
            console.log(info);

            const cookiename = new Date().getTime().toString(16) + "-" + crypto.randomBytes(8).toString("hex");
            await this.redisService.set(
                `COOKIE_${cookiename}`,
                JSON.stringify({
                    type: "kakao",
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token,
                    expires: new Date().getTime() + token.expires_in,

                    userId: info.id,
                    userName: info.kakao_account.profile.nickname,
                    userEmail: info.kakao_account?.email,
                    profile: info.kakao_account.profile.thumbnail_image_url
                })
            );

            this.kakaoUpsert({
                kakaoId: info.id,
                kakaoEmail: info.kakao_account?.email,
                name: info.kakao_account.profile.nickname
            });

            return {
                cookiename: cookiename
            };
        } catch (error) {
            console.error(error);

            return false;
        }
    }
}
