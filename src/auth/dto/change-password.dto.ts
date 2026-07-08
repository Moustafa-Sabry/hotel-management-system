import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: '87654321',
    minLength: 8,
  })
  @MinLength(8)
  newPassword: string;
}