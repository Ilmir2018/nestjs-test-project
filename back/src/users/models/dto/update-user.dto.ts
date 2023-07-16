import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'User', description: 'Имя пользователя' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'user@mail.com', description: 'Email пользователя' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '8917339493553',
    description: 'Телефон пользователя',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Russia',
    description: 'Страна в которой проживает пользователь',
  })
  @IsOptional()
  @IsEmail()
  country?: string;

  @ApiProperty({
    example: 'Kazan',
    description: 'Город в котором проживает пользователь',
  })
  @IsOptional()
  @IsEmail()
  city?: string;

  @ApiProperty({
    example: 'man',
    description: 'Пол пользователя',
  })
  @IsOptional()
  @IsEmail()
  gender?: string;

  @ApiProperty({
    example: 'Воронцов',
    description: 'Фамилия пользователя',
  })
  @IsOptional()
  @IsEmail()
  surname?: string;
}
