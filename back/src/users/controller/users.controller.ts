import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../services/user-service/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { UserHelperService } from '../services/user-helper/user-helper.service';
import { UserI } from '../models/interfaces/user.interface';
import { LoginResponseI } from '../models/interfaces/login-responce.interface';
import { EmailOrPhoneEnum } from '../enums/authorization-method.enum';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../models/entities/user.entity';
import { UserSearchDto } from '../models/dto/search-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private userHelperService: UserHelperService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Find all users whose name matches the line you are entering',
  })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED.' })
  @Get('find-by')
  async getAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchQuery') searchQuery: UserSearchDto,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.getAll(page, limit, searchQuery);
  }

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully authorized.',
  })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED.' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: UserI =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    let jwt: string;
    if (loginUserDto.email) {
      jwt = await this.usersService.login(userEntity, EmailOrPhoneEnum.EMAIL);
    } else if (loginUserDto.phone) {
      jwt = await this.usersService.login(userEntity, EmailOrPhoneEnum.PHONE);
    }
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 3600,
    };
  }

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED.' })
  @Post('register')
  register(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<UserI> {
    const userEntity: UserI =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    if (createUserDto.email) {
      return this.usersService.register(userEntity, EmailOrPhoneEnum.EMAIL);
    } else if (createUserDto.phone) {
      return this.usersService.register(userEntity, EmailOrPhoneEnum.PHONE);
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Update user function',
  })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED.' })
  @Patch(':id')
  update(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Delete user function',
  })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED.' })
  @Delete(':id')
  remove(@Query('id') id: number): Promise<string> {
    return this.usersService.deleteUser(+id);
  }
}
