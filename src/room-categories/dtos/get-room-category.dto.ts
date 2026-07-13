import { IsOptional } from 'class-validator';

export class GetRoomCategoryDto {

  @IsOptional()
  search?: string;


  @IsOptional()
  page?: number;


  @IsOptional()
  limit?: number;
}