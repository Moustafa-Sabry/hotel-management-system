import { CreateRoomCategoryDto } from "./create-room-category.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateRoomCategoryDto extends PartialType(CreateRoomCategoryDto){}