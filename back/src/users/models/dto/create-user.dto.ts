import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @ApiProperty({ example: 'Artem', description: 'Имя пользователя' })
  @IsOptional()
  username: string;
}
