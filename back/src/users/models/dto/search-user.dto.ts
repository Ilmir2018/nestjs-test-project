import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UserSearchDto {
  @ApiProperty({ example: 'user@mail.com', description: 'Email пользователя' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'User', description: 'Имя пользователя' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: '8917339493553',
    description: 'Телефон пользователя',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
