import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/users/models/interfaces/user.interface';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: UserI): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async comparePassword(
    passsword: string,
    stroredPasswordHash: string,
  ): Promise<any> {
    return bcryptjs.compare(passsword, stroredPasswordHash);
  }

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
  }

  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt);
  }
}
