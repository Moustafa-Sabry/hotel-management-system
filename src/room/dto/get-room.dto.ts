import {
  IsIn,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetRoomDto {
  @ApiPropertyOptional({
    example: '101',
    description: 'Search by room number',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '1000',
    description: 'Minimum room price',
  })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({
    example: '5000',
    description: 'Maximum room price',
  })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @ApiPropertyOptional({
    example: '2',
    description: 'Filter rooms by capacity',
  })
  @IsOptional()
  @IsNumberString()
  capacity?: string;

  @ApiPropertyOptional({
    example: '665f3a8c2c1b4a0012345678',
    description: 'Filter rooms by facility id',
  })
  @IsOptional()
  @IsMongoId()
  facility?: string;

  @ApiPropertyOptional({
    example: '4',
    description: 'Filter rooms with rating greater than or equal to this value',
  })
  @IsOptional()
  @IsNumberString()
  rating?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of rooms per page',
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    example: '665f3a8c2c1b4a0012345678',
    description: 'Filter rooms by category id',
  })
  @IsOptional()
  @IsMongoId()
  category?: string;

  @ApiPropertyOptional({
    example: 'price',
    description: 'Field used for sorting',
    enum: ['price', 'capacity', 'averageRating', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['price', 'capacity', 'averageRating', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sorting direction',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
