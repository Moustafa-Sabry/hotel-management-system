import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetRoomDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;
}