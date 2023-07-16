import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Email пользователя' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '894575612343', description: 'Телефон пользователя' })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'qwerty000', description: 'Пароль пользователя' })
  @IsNotEmpty()
  password: string;
}
