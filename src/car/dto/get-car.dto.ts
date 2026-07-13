import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetCarDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}