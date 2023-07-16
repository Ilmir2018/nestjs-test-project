import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { EmailOrPhoneEnum } from 'src/users/enums/authorization-method.enum';
import { UserSearchDto } from 'src/users/models/dto/search-user.dto';
import { UpdateUserDto } from 'src/users/models/dto/update-user.dto';
import { User } from 'src/users/models/entities/user.entity';
import { UserI } from 'src/users/models/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private authService: AuthService,
  ) {}

  async login(user: UserI, emailOrPhoneFlag: number): Promise<string> {
    try {
      let foundUser;
      emailOrPhoneFlag == EmailOrPhoneEnum.EMAIL
        ? (foundUser = await this.findByEmail(user.email.toLowerCase()))
        : (foundUser = await this.findByPhone(user.phone.toLowerCase()));
      if (foundUser) {
        const matches: boolean = await this.authService.comparePassword(
          user.password,
          foundUser.password,
        );
        if (matches) {
          const payload: UserI = await this.findOne(foundUser.id);
          return this.authService.generateJwt(payload);
        } else {
          throw new HttpException(
            'Login was not successful, wrong cridentials',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          'Login was not successful, wrong cridentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async register(newUser: UserI, emailOrPhoneFlag: number): Promise<any> {
    try {
      let exists: boolean;
      emailOrPhoneFlag == EmailOrPhoneEnum.EMAIL
        ? (exists = await this.mailExists(newUser.email))
        : (exists = await this.phoneExists(newUser.phone));
      if (!exists) {
        const passwordHash: string = await this.authService.hashPassword(
          newUser.password,
        );
        newUser.password = passwordHash;
        console.log(newUser);
        const user = await this.userRepository.create(newUser);
        return this.findOne(user.id);
      } else {
        throw new HttpException(
          'Email or phone is already in use',
          HttpStatus.CONFLICT,
        );
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async getAll(
    page: number,
    limit: number,
    searchQuery: UserSearchDto,
  ): Promise<{ data: User[]; total: number }> {
    try {
      const offset = (page - 1) * page;
      const users = await this.userRepository.findAndCountAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } },
            { phone: { [Op.iLike]: `%${searchQuery}%` } },
          ],
        },
        limit: limit,
        offset,
      });

      return { data: users.rows, total: users.count };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findByPk(+id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await user.update(updateUserDto);
      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      const user = await this.userRepository.destroy({ where: { id } });
      return `User ${user} deleted`;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  public async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });
  }

  private async findByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  private async findByPhone(phone: string): Promise<UserI> {
    return this.userRepository.findOne({
      where: { phone },
      include: { all: true },
    });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  private async phoneExists(phone: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
