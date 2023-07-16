import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/models/dto/create-user.dto';
import { LoginUserDto } from 'src/users/models/dto/login-user.dto';
import { UserI } from 'src/users/models/interfaces/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): UserI {
    return {
      email: createUserDto.email,
      password: createUserDto.password,
      phone: createUserDto.phone,
      username: createUserDto.username,
    };
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): UserI {
    return {
      email: loginUserDto.email,
      phone: loginUserDto.phone,
      password: loginUserDto.password,
    };
  }
}
