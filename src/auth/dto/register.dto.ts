import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty({
    example: 'Moustafa Sabry',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'moustafa@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsPhoneNumber('EG')
  phoneNumber: string;
}
