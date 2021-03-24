import { OmitType, PartialType } from "@nestjs/swagger";
import { GithubUser } from "src/entities/github-user.entity";
import { GoogleUser } from "src/entities/google-user.entity";
import { KakaoUser } from "src/entities/kakao-user.entity";
import { NaverUser } from "src/entities/naver-user.entity";

export class GoogleUserInfo extends PartialType(OmitType(GoogleUser, ["id", "role", "createdAt", "updatedAt"])) {}

export class KakaoUserInfo extends PartialType(OmitType(KakaoUser, ["id", "role", "createdAt", "updatedAt"])) {}

export class GithubUserInfo extends PartialType(OmitType(GithubUser, ["id", "role", "createdAt", "updatedAt"])) {}

export class NaverUserInfo extends PartialType(OmitType(NaverUser, ["id", "role", "createdAt", "updatedAt"])) {}
