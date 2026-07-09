import {IsNotEmpty,IsOptional,IsString,} from 'class-validator';


export class CreateRoomCategoryDto {

  @IsString()
  @IsNotEmpty()
  name: string;


  @IsOptional()
  @IsString()
  description?: string;
}