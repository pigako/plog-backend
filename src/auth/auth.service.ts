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
import { GoogleUserInfo, KakaoUserInfo, GithubUserInfo, NaverUserInfo } from "./dto/user-info.dto";
import { KakaoUser } from "src/entities/kakao-user.entity";
import { GithubUser } from "src/entities/github-user.entity";
import { NaverUser } from "src/entities/naver-user.entity";
@Injectable()
export class AuthService {
    constructor(
        private readonly redisService: RedisService,
        @Inject(CONFIG_OPTIONS) private readonly config: AuthModuleOptions,
        @InjectRepository(GoogleUser) private readonly googleUser: Repository<GoogleUser>,
        @InjectRepository(KakaoUser) private readonly kakaoUser: Repository<KakaoUser>,
        @InjectRepository(GithubUser) private readonly githubUser: Repository<GithubUser>,
        @InjectRepository(NaverUser) private readonly naverUser: Repository<NaverUser>
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

    async googleUpsert(userInfo: GoogleUserInfo) {
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
                    redisExpires: new Date().getTime() + 3600 * 1000,

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

    async kakaoUpsert(userInfo: KakaoUserInfo) {
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
                    redisExpires: new Date().getTime() + 3600 * 1000,

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

    async getGithubToken(data): Promise<any> {
        return await axios
            .post(`https://github.com/login/oauth/access_token`, data)
            .then((response) => {
                const parsing = querystring.parse(response.data);
                console.log(parsing);
                return parsing;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async getGithubInfo(accessToken: string) {
        return await axios
            .get(`https://api.github.com/user`, {
                headers: {
                    "Authorization": `token ${accessToken}`
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

    async getGithubUserEmail(accessToken: string) {
        return await axios
            .get(`https://api.github.com/user/emails`, {
                headers: {
                    "Authorization": `token ${accessToken}`
                }
            })
            .then((response) => {
                console.log(response.data);

                return response.data.find((d) => {
                    return d.primary;
                });
            })
            .catch((error) => {
                console.log(error);

                return false;
            });
    }

    async githubUpsert(userInfo: GithubUserInfo) {
        const githubUser = await this.githubUser.findOne({
            githubId: userInfo.githubId
        });

        if (!githubUser) {
            await this.githubUser.save(this.githubUser.create(userInfo));
        }
    }

    async githubAuthLogin(code: string) {
        try {
            const data = {
                client_id: this.config.GITHUB_CLIENT_ID,
                redirect_uri: this.config.GITHUB_REDIRECT_URI,
                code: code,
                client_secret: this.config.GITHUB_CLIENT_SECRET
            };

            const token = await this.getGithubToken(data);
            if (!token) {
                return false;
            }

            const info = await this.getGithubInfo(token.access_token);
            if (!info) {
                return false;
            }

            const email = await this.getGithubUserEmail(token.access_token);

            console.log(token);
            console.log(info);
            console.log(email);

            const cookiename = new Date().getTime().toString(16) + "-" + crypto.randomBytes(8).toString("hex");
            await this.redisService.set(
                `COOKIE_${cookiename}`,
                JSON.stringify({
                    type: "github",
                    accessToken: token.access_token,
                    expires: new Date().getTime() + 365 * 86400 * 1000,
                    redisExpires: new Date().getTime() + 3600 * 1000,

                    userId: info.id,
                    userName: info.name,
                    userEmail: email.email,
                    profile: info.avatar_url
                })
            );

            this.githubUpsert({
                githubId: info.id,
                githubEmail: email.email,
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

    createLoginNaverData(code: string, state: string) {
        const data = {
            grant_type: this.config.NAVER_GRANT_TYPE,
            client_id: this.config.NAVER_CLIENT_ID,
            client_secret: this.config.NAVER_CLIENT_SECRET,
            code: code,
            state: state
        };

        return querystring.stringify(data);
    }

    createRefreshNaverData(refreshToken) {
        const data = {
            grant_type: this.config.NAVER_REFRESH_TYPE,
            client_id: this.config.NAVER_CLIENT_ID,
            client_secret: this.config.NAVER_CLIENT_SECRET,
            refresh_token: refreshToken
        };

        return querystring.stringify(data);
    }

    async getNaverToken(data) {
        return await axios
            .post(`https://nid.naver.com/oauth2.0/token`, data)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async getNaverInfo(token_type: string, access_token: string) {
        return await axios
            .get("https://openapi.naver.com/v1/nid/me", {
                headers: {
                    "Authorization": `${token_type} ${access_token}`
                }
            })
            .then((response) => {
                return response.data?.response;
            })
            .catch((error) => {
                console.error(error);

                return false;
            });
    }

    async naverUpsert(userInfo: NaverUserInfo) {
        const naverUser = await this.naverUser.findOne({
            naverId: userInfo.naverId
        });

        if (!naverUser) {
            await this.naverUser.save(this.naverUser.create(userInfo));
        }
    }

    async naverAuthLogin(code: string, state: string, refreshToken?) {
        try {
            const data = refreshToken ? this.createRefreshNaverData(refreshToken) : this.createLoginNaverData(code, state);

            const token = await this.getNaverToken(data);
            if (!token) {
                return false;
            }

            const info = await this.getNaverInfo(token.token_type, token.access_token);
            if (!info) {
                return false;
            }

            console.log(token);
            console.log(info);

            const cookiename = new Date().getTime().toString(16) + "-" + crypto.randomBytes(8).toString("hex");
            await this.redisService.set(
                `COOKIE_${cookiename}`,
                JSON.stringify({
                    type: "naver",
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token,
                    expires: new Date().getTime() + parseInt(token.expires_in),
                    redisExpires: new Date().getTime() + 3600 * 1000,

                    userId: info.id,
                    userName: info.name,
                    userEmail: info.email,
                    profile: info.profile_image
                })
            );

            this.naverUpsert({
                naverId: info.id,
                naverEmail: info.email,
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
}
