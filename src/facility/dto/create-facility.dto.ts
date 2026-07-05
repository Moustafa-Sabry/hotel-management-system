import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}