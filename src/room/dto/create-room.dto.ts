import {IsArray, IsMongoId,IsNumber,IsOptional,IsString,Max,Min,} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}