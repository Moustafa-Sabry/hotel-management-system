import { IsNumberString, IsOptional, IsString } from 'class-validator';
export class GetRoomDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  minPrice?: number;

  @IsOptional()
  maxPrice?: number;

  @IsOptional()
  capacity?: number;

  @IsOptional()
  facility?: string;

  @IsOptional()
  rating?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}