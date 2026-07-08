import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'moustafa@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsNotEmpty()
  password: string;
}