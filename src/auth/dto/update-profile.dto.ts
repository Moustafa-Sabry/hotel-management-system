import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Moustafa Sabry',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '+201012345678',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profileImage?: string;
}
