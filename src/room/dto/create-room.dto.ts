import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoomDto {
  @ApiProperty({
    example: '101',
    description: 'Unique room number',
  })
  @IsString()
  roomNumber: string;
  @ApiProperty({
    example: 2,
    description: 'Number of people the room can accommodate',
  })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({
    example: 1500,
    description: 'Room price per night',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Discount percentage',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    example: 'Luxury room with sea view',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    example: ['665f3a8c2c1b4a0012345678'],
    required: false,
    description: 'Facilities ids',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  facilities?: string[];
  @ApiProperty({
    example: ['https://image.com/room.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    example: '665f3a8c2c1b4a0012345678',
    description: 'Room category id',
  })
  @IsMongoId()
  category: string;
}
