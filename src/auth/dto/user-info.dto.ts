import { OmitType, PartialType } from "@nestjs/swagger";
import { GoogleUser } from "src/entities/google-user.entity";
import { KakaoUser } from "src/entities/kakao-user.entity";

export class googleUserInfo extends PartialType(OmitType(GoogleUser, ["id", "role", "createdAt", "updatedAt"])) {}

export class kakaoUserInfo extends PartialType(OmitType(KakaoUser, ["id", "role", "createdAt", "updatedAt"])) {}
