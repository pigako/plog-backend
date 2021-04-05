import { ApiProperty, getSchemaPath, OmitType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Response } from "src/common/dto/output.dto";
import { Category } from "src/entities/category.entity";

export class getCategoriesResponse extends PickType(Response, ["data"]) {
    @ApiProperty({ type: OmitType(Category, ["posts"]), isArray: true })
    category: Category[];
}

export class CreateCategoryDTO {
    @IsString()
    @ApiProperty({ description: "카테고리 이름" })
    name: string;
}
