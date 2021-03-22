import { OmitType, PartialType } from "@nestjs/swagger";
import { GoogleUser } from "src/entities/google-user.entity";

export class googleUserInfo extends PartialType(OmitType(GoogleUser, ["id", "role", "createdAt", "updatedAt"])) {}
