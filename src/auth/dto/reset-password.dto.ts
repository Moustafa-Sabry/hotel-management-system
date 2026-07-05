import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'moustafa@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '87654321',
    minLength: 8,
  })
  @MinLength(8)
  password: string;
}